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

    class Meta:
        model = Review
        fields = '__all__'


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


class LibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        user = self.context['request'].user
        rawg_id = validated_data.pop('rawg_id')
        game = Game.objects.filter(rawg_id=rawg_id)

        if not game:
            data = get_rawg_game(rawg_id)
            game = Game.objects.create(
                rawg_id = data["rawg_id"],
                title = data["title"],
                description = data.get("description",""),
                release_date = data["release_date"],
                rating = data["rating"],
                generes = data["genres"],
                image = data.get("image"),
                slug = data["slug"],
            )
        return Library.objects.create(
            user = user,
            game = game,
            **validated_data
        )


class ManualLibrarySerializer(serializers.ModelSerializer):

    title = serializers.CharField(required=True)  #
    description = serializers.CharField(required=False)
    release_date = serializers.DateField(required=False)
    rating = serializers.FloatField(required=False)
    genres = serializers.CharField(required=False)
    image = serializers.URLField(required=False)

    class Meta:
        model = Library
        fields = ['title', 'description', 'release_date','rating', 'genres', 'image']
        read_only_fields = ['user']

    def create(self,validated_data):
        request = self.context.get("request")
        user = request.user

        game = Game.objects.create(
            rawg_id=None,
            title=validated_data.get("title"),
            description=validated_data.get("description", ""),
            release_date=validated_data.get("release_date", None),
            rating=validated_data.get("rating", None),
            genres=validated_data.get("genres", None),
            image=validated_data.get("image", None),
            slug=""
        )

        return Library.objects.create(
            user = user,
            game = game,
            status = validated_data.get('status')
        )