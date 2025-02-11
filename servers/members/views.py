from django.shortcuts import render

# Create your views here.

        
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from userAuthe.models import StudentProject, StudentLead,ProjectMembers
from userAuthe.serializers import ProjectSerializer, StudentLeadSerializer,UserSerializer,StudentMemberSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ProjectParticipants
from .serializers import ProjectParticipantsSerializer




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_project_members(request):
    data = request.data  # Ensure this is a dictionary
    participants_data = data.get('participants', [])  # Extract participants

    if not isinstance(participants_data, list):
        return Response({"error": "Expected a list of participants"}, status=status.HTTP_400_BAD_REQUEST)

    created_members = []
    errors = []

    for participant in participants_data:
        # Validate and create user
        user_serializer = UserSerializer(data=participant)
        if user_serializer.is_valid():
            user = user_serializer.save()
            participant['user'] = user.id  # Assign the created user ID to the participant



        # Validate and create member
        member_serializer = ProjectParticipantsSerializer(data=participant, context={'request': request})
        if member_serializer.is_valid():
            member = member_serializer.save()
            created_members.append(member)
        else:
            errors.append(member_serializer.errors)

    if errors:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

    return Response(
        {"message": f"{len(created_members)} project members added successfully"},
        status=status.HTTP_201_CREATED
    )


#   VIEW MEMBERS      # 
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView
from userAuthe.models import StudentProject, StudentLead,ProjectMembers

class ProjectStudentDetailView(RetrieveAPIView):
    queryset = ProjectParticipants.objects.all()
    serializer_class = ProjectParticipantsSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract user_id from URL

        try:
            # Get student lead by user_id
            student_lead = StudentLead.objects.get(user_id=user_id)
            
            # Get project created by this student
            member = ProjectParticipants.objects.filter(user_id=user_id)

            # Serialize project data
            member_data = ProjectParticipantsSerializer(member, many=True).data

            # Combine student lead details with project list
            response_data = {
                "student_lead": StudentLeadSerializer(student_lead).data,
                "members": member_data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Participants not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





