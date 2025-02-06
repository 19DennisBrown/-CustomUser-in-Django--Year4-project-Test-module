
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



# class SupervisorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Supervisor
#         fields = '__all__'


# class StudentLeadSerializer(serializers.ModelSerializer):
#     supervisor = SupervisorSerializer(read_only=True)

#     class Meta:
#         model = StudentLead
#         fields = '__all__'




# User Serializer (Optional - if you need basic user data)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        

# Supervisor Profile Serializer
class SupervisorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details in response

    class Meta:
        model = Supervisor
        fields = ['user_id', 'user', 'first_name', 'last_name', 'department']

    def create(self, validated_data):
        user = self.context['request'].user


        supervisor, created = Supervisor.objects.update_or_create(
            user=user,
            defaults={
                "first_name": validated_data.get("first_name", ""),
                "last_name": validated_data.get("last_name", ""),
                "department": validated_data.get("department", ""),
            },
        )
        return supervisor
    


# Student Lead Profile Serializer
class StudentLeadSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    supervisor = SupervisorSerializer(read_only=True)

    class Meta:
        model = StudentLead
        fields = ['user_id', 'user', 'first_name', 'last_name', 'programme', 'supervisor']

    def create(self, validated_data):
        user = self.context['request'].user
        supervisor = self.context['supervisor']  # Retrieved from view

        # Check if the StudentLead already exists
        student_lead, created = StudentLead.objects.update_or_create(
            user=user,  # Unique constraint ensures there's only one per user
            defaults={
                "supervisor": supervisor,
                "first_name": validated_data.get("first_name", ""),
                "last_name": validated_data.get("last_name", ""),
                "programme": validated_data.get("programme", ""),
            },
        )

        return student_lead






class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class StudentMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentMember
        fields = '__all__'