


# conversation/serializers.py

from rest_framework import serializers
from conversation.models import Conversation, ConversationMessage
from userAuthe.models import User, Project

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title']

class ConversationSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'project', 'members', 'created_at', 'modified_at']

class ConversationMessageSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = ConversationMessage
        fields = ['id', 'conversation', 'content', 'created_at', 'created_by']

    def create(self, validated_data):
        # Automatically set the created_by field to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)