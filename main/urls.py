from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    # path('images/<str:filename>/', views.imageView),
    path('chat/', views.index, name='index'),
    path('chat/<str:room_name>/', views.room, name='room'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
