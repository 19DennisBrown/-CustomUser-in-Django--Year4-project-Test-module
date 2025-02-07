

from django.urls import path
from conversation import views

urlpatterns = [
    path('conversations/', views.conversation_list, name='conversation-list'),
    path('conversations/<int:pk>/', views.conversation_detail, name='conversation-detail'),
    path('messages/', views.conversation_message_list, name='conversation-message-list'),
    path('messages/<int:pk>/', views.conversation_message_detail, name='conversation-message-detail'),
]
