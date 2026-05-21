from rest_framework import serializers
from .models import *


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ('id', 'name', 'date', 'image', 'details')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user','image', 'birthDate','phoneNumber', 'gender', 'clothingSize')

class RunnerSignupSerializer(serializers.ModelSerializer):
    user_name = serializers.StringRelatedField(source='user', read_only=True)
    race_name = serializers.StringRelatedField(source='race', read_only=True)

    class Meta:
        model = RunnerSignup
        fields = ('id', 'user', 'user_name', 'signupDate', 'classification', 'race', 'race_name', 'adminComment', 'state')
        read_only_fields = ('user', 'state', 'signupDate')

class VolunteerSignupSerializer(serializers.ModelSerializer):
    user_name = serializers.StringRelatedField(source='user', read_only=True)
    race_name = serializers.StringRelatedField(source='race', read_only=True)

    class Meta:
        model = VolunteerSignup
        fields = ('id', 'user', 'user_name', 'signupDate', 'role', 'race', 'race_name', 'adminComment', 'state')
        read_only_fields = ('user', 'signupDate', 'state')