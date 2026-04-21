from rest_framework import serializers
from .models import Game, Review, Library, Profile
from django.contrib.auth.models import User
from .rawg_service import get_rawg_game

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source = 'user.username')
    game_title = serializers.ReadOnlyField(source = 'game.title')
    game_rawg_id = serializers.ReadOnlyField(source = 'game.rawg_id')

    class Meta:
        model = Review
        fields = ['id', 'user', 'game', 'game_title', 'game_rawg_id', 'text', 'rating']

class ReviewCreateSerializer(serializers.Serializer):
    rawg_id = serializers.IntegerField()
    text = serializers.CharField()
    rating = serializers.IntegerField(min_value=1, max_value=10)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['username', 'bio', 'avatar', 'is_public']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.save()

        instance.bio = validated_data.get('bio', instance.bio)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.is_public = validated_data.get('is_public', instance.is_public)

        instance.save()
        return instance

class LibraryCreateSerializer(serializers.ModelSerializer):
    rawg_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Library
        fields = ['rawg_id','status']
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user

        rawg_id = validated_data.pop('rawg_id')
        status_value = validated_data.get('status')

        game = Game.objects.filter(rawg_id=rawg_id).first()

        if not game:
            data = get_rawg_game(rawg_id)

            game = Game.objects.create(
                rawg_id=data["id"],
                title=data["name"],
                description=data.get("description", ""),
                release_date=data.get("released"),
                rating=data.get("rating"),
                genres="",
                image=data.get("background_image"),
                slug=""
            )

        library_item, created = Library.objects.update_or_create(
            user=user,
            game=game,
            defaults={"status": status_value}
        )

        return library_item


class ManualLibrarySerializer(serializers.ModelSerializer):

    title = serializers.CharField(required=True)
    description = serializers.CharField(required=False, allow_blank=True)
    release_date = serializers.DateField(required=False, allow_null=True)
    rating = serializers.FloatField(required=False, allow_null=True)
    genres = serializers.CharField(required=False, allow_blank=True)
    image = serializers.URLField(required=False, allow_blank=True)
    status = serializers.ChoiceField(choices=Library.STATUS_CHOICES)

    class Meta:
        model = Library
        fields = [
            'title', 'description', 'release_date',
            'rating', 'genres', 'image', 'status'
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        game = Game.objects.create(
            rawg_id=None,
            title=validated_data.get("title"),
            description=validated_data.get("description", ""),
            release_date=validated_data.get("release_date"),
            rating=validated_data.get("rating"),
            genres=validated_data.get("genres"),
            image=validated_data.get("image"),
            slug=""
        )

        library, created = Library.objects.get_or_create(
            user=user,
            game=game,
            defaults={"status": validated_data.get("status")}
        )

        return library

class LibrarySerializer(serializers.ModelSerializer):
    game = GameSerializer()
    class Meta:
        model = Library
        fields = ['id', 'game', 'status']
        read_only_fields = ['user']