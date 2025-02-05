from django.contrib import admin
from .models import StudentLead, StudentMember, Supervisor, Project
# Register your models here.


admin.site.register(StudentMember)
admin.site.register(StudentLead)
admin.site.register(Supervisor)
admin.site.register(Project)

