from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
    path('', views.getRoutes),
    # comment_part ----------------------------- #
    path('token/', views.CustomTokenObtainPairView.as_view()),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view()),
    # comment_part ----------------------------- #
    path('users/', views.UserList.as_view()),
    path("users/<int:pk>/", views.UserDetail.as_view()),
    # comment_part ----------------------------- #
    path("rooms/", views.RoomList.as_view()),
    path("rooms/<int:pk>/", views.RoomDetail.as_view()),
    path('rooms/<int:pk>/users/', views.listUserInRoom),
    path('rooms/<int:pk>/messages/', views.listMessageInRoom),
    path("rooms/<int:pk>/join/", views.joinRoom),
    path("rooms/<int:pk>/leave/", views.leaveRoom),
    # comment_part ----------------------------- #
    path("messages/", views.MessageList.as_view()),
    path("messages/<int:pk>/", views.MessageDetail.as_view()),
    # comment_part ----------------------------- #
]
