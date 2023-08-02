import json
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer , AsyncWebsocketConsumer
import threading
import time
import asyncio


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print("websocket connect: " + str(threading.get_native_id()))

        await self.accept()

    async def disconnect(self, close_code):

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        print("websocket disconnect: " + str(threading.get_native_id()))


    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'method': text_data_json['method'],
                'id': text_data_json['id'],
                'user': text_data_json['user'],
                'room': text_data_json['room'],
                'content': text_data_json['content'],
                'updated': text_data_json['updated'],
                'created': text_data_json['created'],
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        print("websocket chat_message: " + str(threading.get_native_id()))
        # await asyncio.sleep(20)
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'method': event['method'],
            'id': event['id'],
            'user': event['user'],
            'room': event['room'],
            'content': event['content'],
            'updated': event['updated'],
            'created': event['created'],
        }))


# class ChatConsumer(WebsocketConsumer):
#     def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = 'chat_%s' % self.room_name

#         # Join room group
#         async_to_sync(self.channel_layer.group_add)(
#             self.room_group_name,
#             self.channel_name
#         )

#         self.accept()

#     def disconnect(self, close_code):
#         # Leave room group
#         async_to_sync(self.channel_layer.group_discard)(
#             self.room_group_name,
#             self.channel_name
#         )

#     # Receive message from WebSocket
#     def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         # Send message to room group
#         async_to_sync(self.channel_layer.group_send)(
#             self.room_group_name,
#             {
#                 'type': 'chat_message',
#                 'message': message
#             }
#         )

#     # Receive message from room group
#     def chat_message(self, event):
#         message = event['message']

#         # Send message to WebSocket
#         self.send(text_data=json.dumps({
#             'message': message
#         }))
