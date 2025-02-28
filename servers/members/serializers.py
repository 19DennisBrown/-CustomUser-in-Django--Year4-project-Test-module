


from rest_framework import serializers
from userAuthe.models import User, Supervisor, StudentLead, StudentProject, ProjectMembers
from .models import ProjectParticipants
from userAuthe.serializers import UserSerializer




# Project MEmbers
class ProjectParticipantsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # project = ProjectSerializer(read_only=True)

    class Meta:
        model = ProjectParticipants
        fields = ['id','user', 'first_name', 'last_name', 'admision_no', 'programme', 'mail']

    def create(self, validated_data):
        user = self.context['request'].user
        # Assuming 'project' is passed in the request data as 'project_id' or similar field
        project = validated_data.get('project')  # Get project from validated data

        # Create the participant instance without using 'defaults'
        participant = ProjectParticipants.objects.create(
            user=user,
            # project=project,  # If project is part of validated_data
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            admision_no=validated_data.get('admision_no', ''),
            programme=validated_data.get('programme', ''),
            mail=validated_data.get('mail', ''),
        )

        return participant





