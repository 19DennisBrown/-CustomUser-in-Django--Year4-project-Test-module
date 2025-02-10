





from django.urls import path
from conversation.views import (
    start_conversation,
    send_message,
    get_conversation_messages,
    list_user_conversations
)

urlpatterns = [
    path("start/", start_conversation, name="start_conversation"),
    path("send/", send_message, name="send_message"),
    path("messages/<int:conversation_id>/", get_conversation_messages, name="get_conversation_messages"),
    path("list/", list_user_conversations, name="list_user_conversations"),
]
