from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('supervisor', 'Supervisor'),
        ('student', 'Student'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return self.username

class Supervisor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    department = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = "Supervisor"

    def save(self, *args, **kwargs):
        self.user.role = 'supervisor'  # Ensure role is always 'supervisor'
        self.user.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.user.username

class StudentLead(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    supervisor = models.ForeignKey(Supervisor, on_delete=models.CASCADE, related_name="students", null=True, blank=True)

    class Meta:
        verbose_name = "Student Lead"

    def save(self, *args, **kwargs):
        self.user.role = 'student'  # Ensure role is always 'student'
        self.user.save()
        super().save(*args, **kwargs)

    def __str__(self):
         return self.user.username

class Project(models.Model):
    student_lead = models.OneToOneField(StudentLead, on_delete=models.CASCADE, related_name="project", null=True, blank=True)
    title = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.title

class StudentMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="members", null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
