from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Game, Review, Profile, Library
from .serializers import GameSerializer, ReviewSerializer, RegisterSerializer, ProfileSerializer, LoginSerializer, \
    LibrarySerializer, ManualLibrarySerializer, ReviewCreateSerializer, LibraryCreateSerializer
from .utils import save_rawg_game
from .rawg_service import search_rawg_games, get_rawg_game, get_rawg_games


# Login user and return JWT tokens
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid credential'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        },
        status=status.HTTP_200_OK
    )


# Register new user
@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'created'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Logout user by blacklisting refresh token
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {'message': 'Successfully logged out'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception:
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_400_BAD_REQUEST
            )


def get_or_create_game_from_rawg(rawg_id):
    game = Game.objects.filter(rawg_id=rawg_id).first()

    if game:
        return game

    data = get_rawg_game(rawg_id)
    return save_rawg_game(data)

# Get list of games from local database.

# Search games on rawg.io by query parameter "search". Return simplified game data list
@api_view(['GET'])
@permission_classes([AllowAny])
def games_list(request):
    search = request.GET.get('search', '').strip()
    page = request.GET.get('page','').strip()

    try:
        data = search_rawg_games(search, page)
        simplified = []

        for item in data.get("results", []):
            simplified.append({
                "id": item.get("id"),
                "name": item.get("name"),
                "released": item.get("released"),
                "rating": item.get("rating"),
                "image": item.get("background_image"),
            })

        return Response({
            "count": data.get("count"),
            "next": data.get("next"),
            "previous": data.get("previous"),
            "results": simplified,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# Get game details by rawg.io id. If game is not in local database, get it from rawg.io and save to local database
@api_view(['GET'])
@permission_classes([AllowAny])
def game_detail(request, game_id):
    try:
        data = get_rawg_game(game_id)

        result = {
            "id": data.get("id"),
            "name": data.get("name"),
            "description": data.get("description"),
            "released": data.get("released"),
            "rating": data.get("rating"),
            "image": data.get("background_image"),
            "genres": [genre.get("name") for genre in data.get("genres", [])],
        }

        return Response(result, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get list of reviews or add review to game
class ReviewListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rawg_id = request.GET.get('game')

        if not rawg_id:
            return Response({'error': 'game querry parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

        game = Game.objects.filter(rawg_id=rawg_id).first()

        if not game:
            return Response([], status=status.HTTP_200_OK)

        reviews = Review.objects.filter(game=game)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        rawg_id = serializer.validated_data['rawg_id']
        text = serializer.validated_data['text']
        rating = serializer.validated_data['rating']

        try:
            game = get_or_create_game_from_rawg(rawg_id)

            review, created = Review.objects.update_or_create(
                user=request.user,
                game=game,
                defaults={
                    'text': text,
                    'rating': rating,
                }
            )

            response_serializer = ReviewSerializer(review)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get, update or delete specific review
class ReviewDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Review, pk=pk) # program will not crash if there is no such review
    
    def get(self, request, pk):
        review = self.get_object(pk)
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        review = self.get_object(pk)

        # Check if user want to change other person's review
        if review.user != request.user:
            return Response(
                {'error': 'You can edit only your own review'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save(user=review.user) # Save correct user for PUT
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        review = self.get_object(pk)
        
        # Check if user want to delete other person's review
        if review.user != request.user:
            return Response(
                {'error': 'You can delete only your own review'},
                status=status.HTTP_403_FORBIDDEN
            )
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Get public profile by username
@api_view(['GET'])
def get_profile(request, username):
    try:
        user = User.objects.get(username=username)
        profile = Profile.objects.get(user=user)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Chek if user profile is private
    if not profile.is_public and request.user != user:
        return Response({'error': 'Profile is private'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


# Get or update current user profile
class MyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Check if user can view profile. User can view profile if it is public or user is owner of the profile
def can_view_profile(request, user, profile):
    return profile.is_public or request.user == user


# Get list of reviews for specific user. User can view reviews if profile is public or user is owner of the profile
class UserReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not can_view_profile(request, user, profile):
            return Response({'error': 'Profile is private'}, status=status.HTTP_403_FORBIDDEN)

        reviews = Review.objects.filter(user=user)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Get list of games in user library. User can view library if profile is public or user is owner of the profile
class UserLibraryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        if not can_view_profile(request, user, profile):
            return Response({'error': 'Profile is private'}, status=status.HTTP_403_FORBIDDEN)

        items = Library.objects.filter(user=user)
        serializer = LibrarySerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# Get list of games in user library or add game to library
class LibraryListCreate(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        items = Library.objects.filter(user=request.user)
        serializer = LibrarySerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = LibraryCreateSerializer(
            data = request.data,
            context = {'request':request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get, update or delete specific library item
class LibraryDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Library, pk=pk)
    
    def put(self, request, pk):
        item = self.get_object(pk)

        if item.user != request.user:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = LibrarySerializer(item, data = request.data)
        if serializer.is_valid():
            serializer.save(user=item.user)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        item = self.get_object(pk)

        if item.user != request.user:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ManualLibraryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ManualLibrarySerializer(
            data=request.data,
            context={'request': request}
        )

        if serializer.is_valid():
            library = serializer.save()
            return Response(
                LibrarySerializer(library).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
