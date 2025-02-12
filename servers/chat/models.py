





from django.db import models
from userAuthe.models import StudentProject, StudentLead, Supervisor


class ChatMessage(models.Model):
    student_lead = models.ForeignKey(StudentLead, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(Supervisor, related_name='chat_messages', on_delete=models.CASCADE)  
    content = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-modified_at',)
