from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.contrib.humanize.templatetags import humanize

# Create your models here.


def imgFile(instance, filename):
    return '/'.join(['images', str(instance.name), filename])


class User(AbstractUser):
    bio = models.TextField(max_length=500, blank=True, null=True)
    avatar = models.ImageField(blank=True, null=True, default='avatar.svg')
    address = models.EmailField(null=True, blank=True)

    def __str__(self):
        return self.username


class Room(models.Model):
    host = models.ForeignKey(User, related_name='host_rooms', on_delete=models.SET_NULL, null=True)
    topic = models.CharField(max_length=100)
    participants  = models.ManyToManyField(User, related_name='participated_rooms', blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.topic


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created']

    def __str__(self):
        return self.content

    def time_ago(self):
        return humanize.naturaltime(self.created)