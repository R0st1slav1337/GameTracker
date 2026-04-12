from rest_framework import serializers
from .models import Game, Review, Library, Profile
from django.contrib.auth.models import User

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
    password = serializers.CharField()


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['username', 'bio', 'avatar', 'is_public']