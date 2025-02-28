from django.db import models

from userAuthe.models import User, StudentProject
# Create your models here.



class ProjectChapters(models.Model):
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        chapter_name = models.CharField(max_length=10)
        chapter_title = models.CharField(max_length = 100)
        date_created = models.DateTimeField(auto_now_add = True)

        def __str__(self):
                return f"{self.chapter_name} :-: {self.chapter_title} "

