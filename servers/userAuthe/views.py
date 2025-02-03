


from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from rest_framework.permissions import AllowAny



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['role'] = user.role  # Add the user's role

        return token
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/user/register',
        '/user/token',
        '/user/token/refresh',
    ]

    return Response(routes)


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Registration successful!",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,  # Include role in response
                }
            }, status=201)

        print("Serializer errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=400)



# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getPlan(request):
#     user = request.user
#     plans = Plan.objects.filter( user = user)
#     serializer = PlanSerializer(plans, many=True)
#     return Response(serializer.data)




from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Supervisor, StudentLead, Project
from .serializers import StudentLeadSerializer, ProjectSerializer

# 🧑‍🎓 StudentLead Detail View
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_lead_detail(request):
    """
    Retrieve the details of the logged-in StudentLead (profile).
    """
    if request.user.role != 'student':
        return Response({"error": "You are not authorized to view this page."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = StudentLeadSerializer(request.user)
    return Response(serializer.data)

# 📅 Project Create View
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    """
    Allow a StudentLead to create a new project and assign themselves to it.
    """
    if request.user.role != 'student':
        return Response({"error": "You are not authorized to create a project."}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(student_lead=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# 👩‍🏫 Supervisor - View All StudentLeads Assigned to Them
@api_view(['GET'])
def supervisor_students(request):

    if request.user.role != 'supervisor':
        return Response({"error": "You are not authorized to view this list."}, status=status.HTTP_403_FORBIDDEN)
    
    student_leads = StudentLead.objects.filter(supervisor__user__username=request.user.username)
    student_leads = StudentLead.objects.all()
    serializer = StudentLeadSerializer(student_leads, many=True)
    return Response(serializer.data)








# views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import StudentLead, Supervisor, User
from .serializers import SupervisorProfileSerializer, StudentLeadProfileSerializer

class CreateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # Log the data being received
        print("Received data:", data)

        # If user is a supervisor, handle supervisor profile creation
        if user.role == 'supervisor':
            # Check if the supervisor profile already exists
            if hasattr(user, 'supervisor'):
                return Response({"detail": "Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

            supervisor_data = {
                'user': user.id,
                'department': data.get('department', '')  # Ensure department is sent
            }

            if not supervisor_data['department']:  # Ensure department is provided
                return Response({"detail": "Department is required for Supervisor profile."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = SupervisorProfileSerializer(data=supervisor_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # If user is a student, handle student profile creation
        elif user.role == 'student':
            # Check if the student lead profile already exists
            if hasattr(user, 'studentlead'):
                return Response({"detail": "Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)

            student_lead_data = {
                'user': user.id,
                'supervisor': data.get('supervisor', None)  # Ensure supervisor ID is provided
            }

            if not student_lead_data['supervisor']:  # Ensure supervisor is provided
                return Response({"detail": "Supervisor is required for Student Lead profile."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = StudentLeadProfileSerializer(data=student_lead_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)
