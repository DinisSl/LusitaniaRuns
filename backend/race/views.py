from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
import datetime


@api_view(['GET', 'POST'])
def races(request):
    if request.method == 'GET':
        races_list = Race.objects.all()
        serializer = RaceSerializer(races_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = RaceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def race_detail(request, race_id):
    try:
        race = Race.objects.get(pk=race_id)
    except Race.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RaceSerializer(race)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = RaceSerializer(race, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        race.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET', 'POST'])
def profiles(request):
    if request.method == 'GET':
        profiles_list = Profile.objects.all()
        serializer = ProfileSerializer(profiles_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def profile_view(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=request.user)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == 'PUT':
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        if first_name is not None:
            request.user.first_name = first_name
        if last_name is not None:
            request.user.last_name = last_name
        request.user.save()

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'msg': 'profile updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def runnersignups(request):
    if request.method == 'GET':
        runnersignups_list = RunnerSignup.objects.all()
        serializer = RunnerSignupSerializer(runnersignups_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({'msg': 'Profile not found. Complete your profile first.'},
                            status=status.HTTP_400_BAD_REQUEST)

        race_id = request.data.get('race')

        if VolunteerSignup.objects.filter(user=profile, race_id=race_id).exists():
            return Response({'msg': 'Ora bolas!!! Já está inscrito como voluntário nesta corrida.'}, status=status.HTTP_400_BAD_REQUEST)
        if RunnerSignup.objects.filter(user=profile, race_id=race_id).exists():
            return Response({'msg': 'Ora bolas!!! Já está inscrito como corredor nesta corrida.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RunnerSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile, state="PENDENTE")
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def runnersignup_detail(request, runnersignup_id):
    try:
        runnersignup = RunnerSignup.objects.get(pk=runnersignup_id)
    except RunnerSignup.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Só o dono ou staff podem aceder
    if runnersignup.user.user != request.user and not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = RunnerSignupSerializer(runnersignup)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not request.user.is_staff:
            return Response({'msg': 'Apenas administradores podem alterar inscrições'}, status=status.HTTP_403_FORBIDDEN)
        serializer = RunnerSignupSerializer(runnersignup, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        runnersignup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def volunteersignups(request):
    if request.method == 'GET':
        volunteersignups_list = VolunteerSignup.objects.all()
        serializer = VolunteerSignupSerializer(volunteersignups_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({'msg': 'Profile not found.'}, status=status.HTTP_400_BAD_REQUEST)

        race_id = request.data.get('race')

        if VolunteerSignup.objects.filter(user=profile, race_id=race_id).exists():
            return Response({'msg': 'Ora bolas!!! Já está inscrito como voluntário nesta corrida.'},status=status.HTTP_400_BAD_REQUEST)
        if RunnerSignup.objects.filter(user=profile, race_id=race_id).exists():
            return Response({'msg': 'Ora bolas!!! Já está inscrito como corredor nesta corrida.'},status=status.HTTP_400_BAD_REQUEST)

        serializer = VolunteerSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=profile, state="PENDENTE")
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def volunteersignup_detail(request, volunteersignup_id):
    try:
        volunteersignup = VolunteerSignup.objects.get(pk=volunteersignup_id)
    except VolunteerSignup.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if volunteersignup.user.user != request.user and not request.user.is_staff:
        return Response({'msg': 'Sem permissão'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        serializer = VolunteerSignupSerializer(volunteersignup)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not request.user.is_staff:
            return Response({'msg': 'Apenas administradores podem alterar inscrições'}, status=status.HTTP_403_FORBIDDEN)
        serializer = VolunteerSignupSerializer(volunteersignup, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        volunteersignup.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_signup_status(request, race_id):
    try:
        profile = request.user.profile
    except Profile.DoesNotExist:
        return Response({'status': 'no_profile'}, status=status.HTTP_200_OK)

    if RunnerSignup.objects.filter(user=profile, race_id=race_id).exists():
        return Response({'status': 'runner'}, status=status.HTTP_200_OK)

    if VolunteerSignup.objects.filter(user=profile, race_id=race_id).exists():
        return Response({'status': 'volunteer'}, status=status.HTTP_200_OK)

    return Response({'status': 'none'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def signup(request):
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    password = request.data.get('password')
    birth_date = request.data.get('birthDate')
    phone_number = request.data.get('phoneNumber')
    gender = request.data.get('gender')
    clothing_size = request.data.get('clothingSize')
    username = first_name + last_name

    if not all([first_name, last_name, email, password, birth_date, phone_number, gender, clothing_size]):
        return Response({'msg': 'Campos requeridos em falta'}, status=status.HTTP_400_BAD_REQUEST)

    elif User.objects.filter(email=email).exists():
        return Response({'msg': 'Email já existente'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name,
                                    email=email, password=password, date_joined=datetime.datetime.now())
    Profile.objects.create(user=user, birthDate=birth_date, phoneNumber=phone_number,
                           gender=gender, clothingSize=clothing_size)

    return Response({'msg': 'user ' + user.username + ' created'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user_db = User.objects.get(email=email)
        username = user_db.username
    except User.DoesNotExist:
        username = None

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is not None:
        login(request, user)  # Criação da sessão
        return Response({'msg': 'user logged in'})

    return Response(
        {'msg': 'invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response({'msg': 'user logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    return Response({
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'is_staff': request.user.is_staff,

    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_runner_signups(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Perfil não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

    signups = RunnerSignup.objects.filter(user=profile)
    serializer = RunnerSignupSerializer(signups, many=True)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_runner_signup(request, pk):
    try:
        profile = Profile.objects.get(user=request.user)

        signup = RunnerSignup.objects.get(
            id=pk,
            user=profile
        )

    except RunnerSignup.DoesNotExist:
        return Response(
            {'error': 'Inscrição não encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )

    signup.delete()

    return Response(
        {'msg': 'Inscrição cancelada'},
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_volunteer_signups(request):
    try:
        profile = Profile.objects.get(user=request.user)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Perfil não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )

    signups = VolunteerSignup.objects.filter(user=profile)
    serializer = VolunteerSignupSerializer(signups, many=True)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_volunteer_signup(request, pk):
    try:
        profile = Profile.objects.get(user=request.user)

        signup = VolunteerSignup.objects.get(
            id=pk,
            user=profile
        )

    except VolunteerSignup.DoesNotExist:
        return Response(
            {'error': 'Inscrição não encontrada'},
            status=status.HTTP_404_NOT_FOUND
        )

    signup.delete()

    return Response(
        {'msg': 'Inscrição cancelada'},
        status=status.HTTP_204_NO_CONTENT
    )