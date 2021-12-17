from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
    path('images/<str:filename>/', views.imageView),
    path('chat/', views.index, name='index'),
    path('chat/<str:room_name>/', views.room, name='room'),
]
