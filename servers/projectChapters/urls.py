
from django.urls import path
from  . import views





urlpatterns = [
     path("create/", views.add_project_chapters, name="create_members"),
     path("view/<int:user_id>/", views.ProjectChaptersDetailView.as_view(), name="view_members"),
]
