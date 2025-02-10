from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from conversation.models import Conversation, ConversationMessage
from userAuthe.models import StudentProject, User
from conversation.serializers import ConversationSerializer, ConversationMessageSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    """
    Start a conversation between a Student Lead and Supervisor.
    """
    user = request.user  
    project_id = request.data.get("project_id")

    if not project_id:
        return Response({"error": "Project ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        project = StudentProject.objects.get(id=project_id)
    except StudentProject.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the user is part of the project (Student Lead or Supervisor)
    if project.user != user and project.supervisor.user != user:
        return Response({"error": "You are not authorized to start this conversation"}, status=status.HTTP_403_FORBIDDEN)

    # Get or create conversation
    conversation, created = Conversation.objects.get_or_create(project=project)
    
    # Ensure both members (Student Lead & Supervisor) are part of the conversation
    conversation.members.add(project.user, project.supervisor.user)

    serializer = ConversationSerializer(conversation)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """
    Send a message in an existing conversation.
    """
    user = request.user  
    conversation_id = request.data.get("conversation_id")
    content = request.data.get("content")

    if not conversation_id or not content:
        return Response({"error": "Conversation ID and content are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the user is part of the conversation
    if user not in conversation.members.all():
        return Response({"error": "You are not part of this conversation"}, status=status.HTTP_403_FORBIDDEN)

    # Create message
    message = ConversationMessage.objects.create(
        conversation=conversation,
        content=content,
        created_by=user
    )

    serializer = ConversationMessageSerializer(message)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation_messages(request, conversation_id):
    """
    Retrieve all messages in a conversation.
    """
    user = request.user  

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"error": "Conversation not found"}, status=status.HTTP_404_NOT_FOUND)

    # Ensure the user is part of the conversation
    if user not in conversation.members.all():
        return Response({"error": "You are not part of this conversation"}, status=status.HTTP_403_FORBIDDEN)

    # Get all messages
    messages = conversation.messages.all().order_by("created_at")
    serializer = ConversationMessageSerializer(messages, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_conversations(request):
    """
    List all conversations where the user is a member.
    """
    user = request.user  
    conversations = Conversation.objects.filter(members=user)
    serializer = ConversationSerializer(conversations, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)
