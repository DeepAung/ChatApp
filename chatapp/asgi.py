
import os, django
from django.core.asgi import get_asgi_application
from django.core.wsgi import get_wsgi_application

from channels.http import AsgiHandler
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from main.routing import websocket_urlpatterns



os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chatapp.settings')
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(), 
 
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})