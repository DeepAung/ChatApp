from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from main.models import Room, Message

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'], password=validated_data["password"])
        return user


class UserShowSerializer(serializers.ModelSerializer):
    get_avatar = serializers.SerializerMethodField('_get_avatar')

    def _get_avatar(self, user):
        if user.avatar:
            return 'http://127.0.0.1:8000' + user.avatar.url
        else:
            return 'http://127.0.0.1:8000/media/avatar.svg'

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name',
                  'last_name', 'bio', 'avatar', 'get_avatar', 'address']


class UserCreationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        label='Confirm Password', write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name',
                  'bio', 'avatar', 'address', 'password', 'password2', ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True},
        }

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.pop('password2')
        if password != confirm_password:
            raise ValidationError('password is not the same')
        return data

    def create(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        bio = validated_data.get('bio')
        bio = bio if bio else ''
        # if not validated_data.get('avartar'):
        # avartar = validated_data.get('avartar') # TODO: add this to form
        try:
            user = User.objects.create(username=username, bio=bio)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            return e


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        new_data = validated_data.copy()
        new_data['host'] = user
        new_data['participants'] = [user]

        room = super().create(new_data)
        return room


class ReadMessageSerializer(serializers.ModelSerializer):
    timeago = serializers.SerializerMethodField('time_ago')

    def time_ago(self, message):
        return message.time_ago()

    class Meta:
        model = Message
        fields = '__all__'


class CreateMessageSerializer(serializers.ModelSerializer):
    timeago = serializers.SerializerMethodField('time_ago')

    def time_ago(self, message):
        return message.time_ago()

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['id', 'timeago',
                            'updated', 'created', 'user']  # exclude content and room

    def create(self, validated_data):
        request = self.context['request']
        user = request.user

        new_data = validated_data.copy()
        new_data['user'] = user

        message = super().create(new_data)
        return message


class UpdateMessageSerializer(serializers.ModelSerializer):
    timeago = serializers.SerializerMethodField('time_ago')

    def time_ago(self, message):
        return message.time_ago()

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['id', 'timeago',
                            'updated', 'created', 'user', 'room']  # exclude content


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        # token['bio'] = user.bio
        # token['avatar'] = user.avatar
        # token['address'] = user.address

        return token
