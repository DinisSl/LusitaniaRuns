from rest_framework import serializers
from .models import *


class RaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Race
        fields = ('id', 'name', 'date')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user','image', 'birthDate','phoneNumber', 'gender', 'clothingSize')

class RunnerSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = RunnerSignup
        fields = ('user','signupDate', 'classification','race','adminComment','state')
        read_only_fields = ('user', 'state', 'signupDate')

class VolunteerSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = VolunteerSignup
        fields = ('user','signupDate', 'role','race','adminComment','state')
        read_only_fields = ('user', 'signupDate', 'state')