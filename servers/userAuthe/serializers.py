
from rest_framework import serializers
from .models import User, Supervisor, StudentLead, Project, StudentMember



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='student')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def validate_username(self, value):
        """Ensure the username is unique."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username is already taken.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



class SupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = '__all__'


class StudentLeadSerializer(serializers.ModelSerializer):
    supervisor = SupervisorSerializer(read_only=True)

    class Meta:
        model = StudentLead
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class StudentMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentMember
        fields = '__all__'
