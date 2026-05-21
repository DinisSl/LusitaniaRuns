from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name')



class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ('id', 'name', 'date')



class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = (
            'user',
            'image',
            'birthDate',
            'phoneNumber',
            'gender',
            'clothingSize'
        )



class RunnerSignupSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    race = RaceSerializer(read_only=True)

    class Meta:
        model = RunnerSignup
        fields = (
            'id',
            'user',
            'signupDate',
            'classification',
            'race',
            'adminComment',
            'state'
        )

        read_only_fields = (
            'user',
            'signupDate'
        )



class VolunteerSignupSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    race = RaceSerializer(read_only=True)

    class Meta:
        model = VolunteerSignup
        fields = (
            'id',
            'user',
            'signupDate',
            'role',
            'race',
            'adminComment',
            'state'
        )

        read_only_fields = (
            'user',
            'signupDate'
        )