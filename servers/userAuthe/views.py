


from django.http import JsonResponse, HttpResponse
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





# Correct way to create a Supervisor and its Profile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Supervisor
from .serializers import UserSerializer, SupervisorSerializer

class CreateSupervisorAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the incoming user data from the request
        supervisor_data = request.data
        
        # Validate and create the user
        supervisor_serializer = UserSerializer(data=supervisor_data)
        if supervisor_serializer.is_valid():
            user = supervisor_serializer.save()

        supervisor_serializer = SupervisorSerializer(
            data=supervisor_data, context={'request': request}
        )

            # Validate and create the supervisor profile
        if supervisor_serializer.is_valid():
            supervisor_serializer.save()
            return Response({"message": "Supervisor created successfully!"}, status=status.HTTP_201_CREATED)
    
    # If the user serializer is invalid, return errors
        return Response(supervisor_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import StudentLead, Supervisor
from .serializers import StudentLeadSerializer

class CreateStudentLeadAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Get incoming data for StudentLead profile
        student_lead_data = request.data
        
        # Ensure that the supervisor is passed to the view
        supervisor_id = student_lead_data.get('supervisor')
        if supervisor_id:
            try:
                supervisor = Supervisor.objects.get(user_id=supervisor_id)
            except Supervisor.DoesNotExist:
                return Response({"error": "Supervisor not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Supervisor is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize the StudentLeadSerializer with the incoming data and supervisor
        student_lead_serializer = StudentLeadSerializer(
            data=student_lead_data,
            context={'request': request, 'supervisor': supervisor}
        )
        
        if student_lead_serializer.is_valid():
            # Create and save the StudentLead profile
            student_lead_serializer.save()
            return Response({"message": "StudentLead profile created successfully!"}, status=status.HTTP_201_CREATED)
        
        return Response(student_lead_serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from django.http import JsonResponse
from .models import Supervisor, StudentLead  # Assuming you store users in this model

def list_supervisors(request):
    supervisors = Supervisor.objects.filter().values("user_id", "first_name", "last_name", "department")
    return JsonResponse(list(supervisors), safe=False)

def list_studentlead(request):
    supervisors = StudentLead.objects.filter().values("user_id", "first_name", "last_name", "programme")
    return JsonResponse(list(supervisors), safe=False)

# Individual Student data
from rest_framework.generics import RetrieveAPIView
from .models import StudentLead
from .serializers import StudentLeadSerializer

class StudentLeadDetailView(RetrieveAPIView):
    queryset = StudentLead.objects.all()
    serializer_class = StudentLeadSerializer
    lookup_field = "user_id"
class SupervisorDetailView(RetrieveAPIView):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer
    lookup_field = "user_id"