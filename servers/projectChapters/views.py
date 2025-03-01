from django.shortcuts import render

# Create your views here.

        
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import RetrieveAPIView
from userAuthe.models import StudentProject, StudentLead,ProjectMembers
from userAuthe.serializers import ProjectSerializer, StudentLeadSerializer,UserSerializer,StudentMemberSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status



from rest_framework.permissions import IsAuthenticated
from .models import ProjectChapters
from .serializers import ProjectChaptersSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_project_chapters(request):
        data = request.data
        chapters_data = data.get('chapters', [])

        if not isinstance(chapters_data, list):
                return Response({"error": "Expected a list of chapters"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_chapters = []
        errors = []

        for chapter in chapters_data:
                # validate and create
                user_serializer = UserSerializer(data=chapter)

                if user_serializer.is_valid():
                    user = user_serializer.save()
                    chapter['user'] = user.id  # Assign the created user ID to the chapter
                
                        # Validate and create Chapter
                chapter_serializer = ProjectChaptersSerializer(data=chapter, context={'request': request})
                if chapter_serializer.is_valid():
                    member = chapter_serializer.save()
                    created_chapters.append(member)
                else:
                    errors.append(chapter_serializer.errors)

        if errors:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response(
                {"message": f"{len(created_chapters)} project chapters added successfully"},
                status=status.HTTP_201_CREATED
            )



 
#   VIEW CHAPTERS      # 

class ProjectChaptersDetailView(RetrieveAPIView):
    queryset = ProjectChapters.objects.all()
    serializer_class = ProjectChaptersSerializer
    lookup_field = "user_id"

    def retrieve(self, request, *args, **kwargs):
        user_id = self.kwargs.get("user_id")  # Extract user_id from URL

        try:
            # Get student lead by user_id
            student_lead = StudentLead.objects.get(user_id=user_id)
            
            # Get project created by this student
            chapter = ProjectChapters.objects.filter(user_id=user_id)

            # Serialize project data
            chapter_data = ProjectChaptersSerializer(chapter, many=True).data

            # Combine student lead details with project list
            response_data = {
                "student_lead": StudentLeadSerializer(student_lead).data,
                "chapters": chapter_data
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return Response({"error": "Chapters not found"}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
#  ONE CHAPTER.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ProjectChapters
from .serializers import ProjectChaptersSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specific_chapter(request, chapter_id):
    try:
        # Fetch the chapter by ID
        chapter = ProjectChapters.objects.get(id=chapter_id)
        
        # Check if the requesting user owns the chapter
        if chapter.user != request.user:
            return Response(
                {"error": "You do not have permission to view this chapter."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Serialize the chapter data
        serializer = ProjectChaptersSerializer(chapter)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except ProjectChapters.DoesNotExist:
        return Response(
            {"error": "Project chapter not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


        



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from .models import ProjectChapters

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project_chapter(request, chapter_id):
    try:
        # Fetch the chapter by ID
        chapter = ProjectChapters.objects.get(id=chapter_id)
        
        # Check if the requesting user owns the chapter
        if chapter.user != request.user:
            raise PermissionDenied("You do not have permission to delete this chapter.")
        
        # Delete the chapter
        chapter.delete()
        
        return Response(
            {"message": "Project chapter deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    except ProjectChapters.DoesNotExist:
        return Response(
            {"error": "Project chapter not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except PermissionDenied as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_403_FORBIDDEN
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import PermissionDenied
from .models import ProjectChapters
from .serializers import ProjectChaptersSerializer

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project_chapter(request, chapter_id):
    try:
        # Fetch the chapter by ID
        chapter = ProjectChapters.objects.get(id=chapter_id)
        
        # Check if the requesting user owns the chapter
        if chapter.user != request.user:
            raise PermissionDenied("You do not have permission to update this chapter.")
        
        # Update the chapter
        serializer = ProjectChaptersSerializer(chapter, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ProjectChapters.DoesNotExist:
        return Response(
            {"error": "Project chapter not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except PermissionDenied as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_403_FORBIDDEN
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )