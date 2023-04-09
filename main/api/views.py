from django.http import Http404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer, RoomSerializer, ReadMessageSerializer, CreateMessageSerializer, UpdateMessageSerializer, UserShowSerializer, UserCreationSerializer, CustomTokenObtainPairSerializer
from main.models import User, Room, Message

# Create your views here.

# TODO: room setting page
# TODO: avartar, username(or change to name)
# TODO: see other User in frontend
# TODO: update own user in frontend


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()


def get_object(Model, pk):
    try:
        return Model.objects.get(id=pk)
    except Model.DoesNotExist:
        raise Http404


@api_view(['GET'])
def getRoutes(request):
    routes = {
        '':                         '[GET] getRoutes',
        'token/':                   '[POST] CustomTokenObtainPairView',
        'token/refresh/':           '[POST] TokenRefreshView',
        'users/':                   '[POST] UserList',
        "users/<int:pk>/":          '[GET, PATCH, DELETE] UserDetail',
        "rooms/":                   '[POST, GET] RoomList',
        "rooms/<int:pk>/":          '[GET, PATCH, DELETE] RoomDetail',
        'rooms/<int:pk>/users/':    '[GET] listUserInRoom',
        'rooms/<int:pk>/messages/': '[GET] listMessageInRoom',
        "rooms/<int:pk>/join/":     '[POST] joinRoom',
        "rooms/<int:pk>/leave/":    '[POST] leaveRoom',
        "messages/":                '[POST] MessageList',
        "messages/<int:pk>/":       '[PATCH, DELETE] MessageDetail',
    }
    return Response(routes)

# comment_part -------------------------------------------------------------------------------------- #


class UserList(APIView):

    def post(self, request, format=None):
        serializer = UserCreationSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        else:
            return Response('create user failed', status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        user = get_object(User, pk)
        serializer = UserShowSerializer(user)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        if pk != request.user.id:
            return Response(f'incorrect user id {pk} {request.user.id}', status=status.HTTP_400_BAD_REQUEST)

        user = get_object(User, pk)
        serializer = UserShowSerializer(
            instance=user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response('update user failed', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = get_object(User, pk)
        username = user.username
        user.delete()

        return Response(f'delete user "{str(username)}"')


# comment_part -------------------------------------------------------------------------------------- #

class RoomList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = RoomSerializer(
            data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

        return Response('create room failed', status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        user = request.user

        rooms = user.participated_rooms.all()
        serializers = RoomSerializer(rooms, many=True)
        return Response(serializers.data)


class RoomDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, format=None):
        room = get_object(Room, pk)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        room = get_object(Room, pk)
        serializer = RoomSerializer(
            instance=room, data=request.data, partial=True)

        if room.host.id != request.user.id:  # type: ignore
            return Response('you are not the host', status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response('update room failed', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        room = get_object(Room, pk)
        topic = room.topic
        room.delete()
        return Response(f'delete room "{topic}"')


# comment_part -------------------------------------------------------------------------------------- #


class MessageList(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = CreateMessageSerializer(
            data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response('createMessage failed', status=status.HTTP_400_BAD_REQUEST)


class MessageDetail(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, format=None):
        message = get_object(Message, pk)
        serializer = UpdateMessageSerializer(
            instance=message, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response('updateMessage failed', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        message = get_object(Message, pk)
        if request.user.id == message.user.id:  # type: ignore
            content = message.content
            message.delete()
            return Response(f'deleteMessage "{content}"')
        return Response('deleteMessage failed', status=status.HTTP_400_BAD_REQUEST)


# comment_part -------------------------------------------------------------------------------------- #


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listUserInRoom(request, pk):
    room = get_object(Room, pk)
    users = room.participants.all()

    if not users.filter(id=request.user.id):
        return Response("you are not in this room", status=status.HTTP_400_BAD_REQUEST)

    serializer = UserShowSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listMessageInRoom(request, pk):
    room = get_object(Room, pk)

    if not room.participants.filter(id=request.user.id):
        return Response("you are not in this room", status=status.HTTP_400_BAD_REQUEST)

    # messages = room.messages.all()
    messages = Message.objects.filter(room=room)
    serializers = ReadMessageSerializer(messages, many=True)
    return Response(serializers.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def joinRoom(request, pk):
    try:
        room = get_object(Room, pk)
    except Room.DoesNotExist:
        return Response("room does not exist", status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not room.participants.filter(id=user.id):
        room.participants.add(user.id)
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    return Response("you had already joined this room", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leaveRoom(request, pk):
    user = request.user

    try:
        room = get_object(Room, pk)
    except Room.DoesNotExist:
        return Response('room does not exist', status=status.HTTP_400_BAD_REQUEST)

    room.participants.remove(user)
    serializer = RoomSerializer(room)
    return Response(serializer.data)
