




from rest_framework import serializers
from userAuthe.models import User, Supervisor, StudentLead, StudentProject, ProjectMembers
from members.models import ProjectParticipants
from .models import ChatMessage






from rest_framework import serializers
from userAuthe.models import StudentProject, StudentLead, Supervisor
from .models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    # You can choose to include any extra fields that are required for the response.
    student_lead = serializers.PrimaryKeyRelatedField(queryset=StudentLead.objects.all())
    supervisor = serializers.PrimaryKeyRelatedField(queryset=Supervisor.objects.all())

    class Meta:
        model = ChatMessage
        fields = ['id', 'student_lead', 'supervisor', 'content', 'created_at', 'modified_at']

    def create(self, validated_data):
        """
        Custom create method to create a ChatMessage.
        You can add custom logic here, like validation or automatic assignment of fields.
        """
        # If needed, you can adjust the creation logic here
        chat_message = ChatMessage.objects.create(**validated_data)
        return chat_message
