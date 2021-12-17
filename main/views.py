from django.core.checks import messages
from django.http.response import HttpResponse
from django.shortcuts import render

import base64

# Create your views here.


def imageView(request, filename):
    context = {}
    context['image'] = f'images/{filename}/'

    return render(request, 'main/img-show.html', context)


def index(request):
    return render(request, 'main/index.html')


def room(request, room_name):
    return render(request, 'main/room.html', {
        'room_name': room_name
    })