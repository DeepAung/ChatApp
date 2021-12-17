from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views

from . import views

urlpatterns = [
    path('', views.getRoutes),
    # comment_part ----------------------------- #
    path('token/', views.CustomTokenObtainPairView.as_view()),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view()),
    # comment_part ----------------------------- #
    path("create-user/", views.createUser),
    path("list-user/<int:pk>/", views.listUser),
    path("update-user/", views.updateUser),
    path("delete-user/<int:pk>/", views.deleteUser),
    path("get-user/<int:pk>/", views.getUser),
    # comment_part ----------------------------- #
    path("create-room/", views.createRoom),
    path("list-room/", views.listRoom),
    path("detail-room/<int:pk>/", views.detailRoom),
    path("update-room/<int:pk>/", views.updateRoom),
    path("delete-room/<int:pk>/", views.deleteRoom),
    path("join-room/<int:pk>/", views.joinRoom),
    path("leave-room/<int:pk>/", views.leaveRoom),
    # comment_part ----------------------------- #
    path("create-message/", views.createMessage),
    path("list-message/<int:pk>/", views.listMessage),
    path("update-message/<int:pk>/", views.updateMessage),
    path("delete-message/<int:pk>/", views.deleteMessage),
    # comment_part ----------------------------- #
    # path('login/', views.login_user),
    # path('logout/', views.logout_user)
]
