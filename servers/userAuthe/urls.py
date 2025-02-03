

from django.urls import path
from . import views
from .views import MyTokenObtainPairView, UserRegisterView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


from django.urls import path
from .views import student_lead_detail, create_project, supervisor_students



urlpatterns = [
    path('', views.getRoutes),

    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



    path('student/profile/', student_lead_detail, name='student-profile'),
    path('student/project/', create_project, name='create-project'),
    path('supervisor/students/', supervisor_students, name='supervisor-students'),


    path('create-profile/', views.CreateProfileView.as_view(), name='create-profile'),
]