
from django.urls import path
from  . import views





urlpatterns = [
     path("create/", views.add_project_chapters, name="create_members"),
     path("view/<int:user_id>/", views.ProjectChaptersDetailView.as_view(), name="view_members"),
     path('delete/<int:chapter_id>/', views.delete_project_chapter, name='delete_project_chapter'),
     path('update/<int:chapter_id>/', views.update_project_chapter, name='update_project_chapter'),

     path('one_chapter/view/<int:chapter_id>/', views.get_specific_chapter, name='get_specific_chapter'),
]
