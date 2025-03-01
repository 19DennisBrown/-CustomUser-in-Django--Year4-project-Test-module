from rest_framework import serializers

from userAuthe.models import User, Supervisor, StudentLead, StudentProject, ProjectMembers
from userAuthe.serializers import UserSerializer
from .models import ProjectChapters

# Project Chapters

class ProjectChaptersSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProjectChapters
        fields = ['id', 'user', 'chapter_name', 'chapter_title', 'date_created']

    def create(self, validated_data):
        user = self.context['request'].user
        chapter = ProjectChapters.objects.create(
            user=user,
            chapter_name=validated_data.get('chapter_name', ""),
            chapter_title=validated_data.get('chapter_title', ""),
        )
        return chapter

    def update(self, instance, validated_data):
        # Update the instance with validated data
        instance.chapter_name = validated_data.get('chapter_name', instance.chapter_name)
        instance.chapter_title = validated_data.get('chapter_title', instance.chapter_title)
        instance.save()
        return instance