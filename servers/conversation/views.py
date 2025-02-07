


from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from conversation.models import Conversation, ConversationMessage
from conversation.serializers import ConversationSerializer, ConversationMessageSerializer
from userAuthe.models import Project

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def conversation_list(request):
    if request.method == 'GET':
        conversations = Conversation.objects.all()
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        project_id = request.data.get('project')
        project = Project.objects.get(id=project_id)
        serializer = ConversationSerializer(data=request.data)
        if serializer.is_valid():
            conversation = serializer.save(project=project)
            conversation.members.add(request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def conversation_detail(request, pk):
    try:
        conversation = Conversation.objects.get(pk=pk)
    except Conversation.DoesNotExist:
        return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ConversationSerializer(conversation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def conversation_message_list(request):
    if request.method == 'GET':
        conversation_id = request.query_params.get('conversation', None)
        messages = ConversationMessage.objects.filter(conversation_id=conversation_id) if conversation_id else ConversationMessage.objects.all()
        serializer = ConversationMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        conversation_id = request.data.get('conversation')
        conversation = Conversation.objects.get(id=conversation_id)
        serializer = ConversationMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(conversation=conversation, created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def conversation_message_detail(request, pk):
    try:
        message = ConversationMessage.objects.get(pk=pk)
    except ConversationMessage.DoesNotExist:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ConversationMessageSerializer(message)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ConversationMessageSerializer(message, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
