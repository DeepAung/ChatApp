import re
from django.core.checks import messages
from django.http.response import HttpResponse
from django.shortcuts import render

from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import serializers, status

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, RoomSerializer, MessageSerializer, UserShowSerializer, UserCreationSerializer, CustomTokenObtainPairSerializer
from main.models import User, Room, Message

import base64, os

# Create your views here.

# TODO: room setting page
# TODO: avartar, username(or change to name)
# TODO: time since
# TODO: leave / update / create / delete room in frontend
# TODO: see other User in frontend
# TODO: update own user in frontend


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()

@api_view(['GET'])
def getRoutes(request):
    routes = {
        'create-user/': 'POST',
        'list-user/<int:pk>/': 'GET',
        'update-user/<int:pk>/': 'PUT',
        'delete-user/<int:pk>/': 'DELETE',
        'get-user/<int:pk>/': 'GET',
        # comment_part ----------------------------- #
        'create-room/': 'POST',
        'list-room/<int:pk>': 'GET',
        'detail-room/<int:pk>/': 'GET',
        'update-room/<int:pk>/': 'PUT',
        'delete-room/<int:pk>/': 'DELETE',
        'join-room/<int:pk>/': 'POST',
        'leave-room/<int:pk>/': 'POST',
        # comment_part ----------------------------- #
        'create-message/': 'POST',
        'list-message/<int:pk>': 'GET',
        'update-message/<int:pk>/': 'PUT',
        'delete-message/<int:pk>/': 'DELETE',
        # comment_part ----------------------------- #
        'login/': 'POST',
        'logout/': 'POST',
    }
    return Response(routes)

# comment_part -------------------------------------------------------------------------------------- #

# @api_view(['POST'])
# def login_user(request):
#     print('-------------------------------\n', str(request.user))
#     if str(request.user) != 'AnonymousUser':
#         return Response('please logout first before you login', status=status.HTTP_400_BAD_REQUEST)

#     input_user = AuthenticationForm(request, data=request.data)

#     if input_user.is_valid():
#         username = input_user.cleaned_data.get('username')
#         password = input_user.cleaned_data.get('password')
#         user = authenticate(username=username, password=password)

#         if user is not None:
#             login(request, user)
#             return Response(input_user.data)
#         else:
#             return Response('user is None', status=status.HTTP_400_BAD_REQUEST)
#     else:
#         return Response('form is not valid', status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def logout_user(request):
#     if str(request.user) == 'AnonymousUser':
#         return Response('please login first before you logout', status=status.HTTP_400_BAD_REQUEST)
    
#     logout(request)
#     return Response('logout successfully')

# comment_part -------------------------------------------------------------------------------------- #

@api_view(['POST'])
def createUser(request):
    serializer = UserCreationSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)
    else:
        return Response('createUser failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listUser(request, pk):
    room = Room.objects.get(id=pk)
    users = room.participants.all()
    serializer = UserShowSerializer(users, many=True)

    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = User.objects.get(id=request.user.id)
    # old_image = user.avatar
    # print('--------------------------', old_image)
    serializer = UserShowSerializer(instance=user, data=request.data, partial=True, context={'request': request})

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response('updateUser failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUser(request, pk):
    user = User.objects.get(id=pk)
    username = user.username
    user.delete()

    return Response(f'deleteUser "{str(username)}"')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user)
    return Response(serializer.data)


# comment_part -------------------------------------------------------------------------------------- #

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createRoom(request):
    serializer = RoomSerializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response(serializer.data)

    return Response('createRoom failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listRoom(request):
    user = request.user
    if user.username != '':
        rooms = user.participated_rooms.all()
        serializers = RoomSerializer(rooms, many=True)
        return Response(serializers.data)
    return Response([], status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def detailRoom(request, pk):
    room = Room.objects.get(id=pk)
    serializer = RoomSerializer(room)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateRoom(request, pk):
    room = Room.objects.get(id=pk)
    serializer = RoomSerializer(instance=room, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response('updateRoom failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteRoom(request, pk):
    room = Room.objects.get(id=pk)
    topic = room.topic
    room.delete()
    return Response(f'deleteRoom "{topic}"')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def joinRoom(request, pk):
    try:
        user = request.user
        room = Room.objects.get(id=pk)
        if (user) and (room) and (not room.participants.filter(id=user.id)):
            room.participants.add(user.id)
            serializer = RoomSerializer(room)
            return Response(serializer.data)
            
        return Response("joinRoom failed\n you'd alredy joined this room", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("joinRoom failed\nthis room isn't exist", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leaveRoom(request, pk):
    user = request.user
    room = Room.objects.get(id=pk)
    room.participants.remove(user)
    serializer = RoomSerializer(room)
    return Response(serializer.data)


# comment_part -------------------------------------------------------------------------------------- #


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createMessage(request):
    serializer = MessageSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response('createMessage failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listMessage(request, pk):
    room = Room.objects.get(id=pk)
    messages = Message.objects.filter(room=room)
    serializers = MessageSerializer(messages, many=True)
    return Response(serializers.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateMessage(request, pk):
    message = Message.objects.get(id=pk)
    serializer = MessageSerializer(instance=message, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response('updateMessage failed', status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteMessage(request, pk):
    message = Message.objects.get(id=pk)
    if request.user.id == message.user.id:
        content = message.content
        message.delete()
        return Response(f'deleteMessage "{content}"')
    return Response('deleteMessage failed', status=status.HTTP_400_BAD_REQUEST)

# comment_part -------------------------------------------------------------------------------------- #