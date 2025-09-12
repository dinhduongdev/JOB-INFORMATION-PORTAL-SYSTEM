from django.contrib import admin
from .models import Expertise, JobPost, Salary

admin.site.register(JobPost)
admin.site.register(Expertise)
admin.site.register(Salary)
