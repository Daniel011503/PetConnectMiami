from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Pet

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PetSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Pet
        fields = ['id', 'name', 'breed', 'age', 'description', 'photo', 'owner']