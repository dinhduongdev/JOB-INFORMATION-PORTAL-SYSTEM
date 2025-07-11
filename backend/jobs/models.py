from django.db import models

from user.models import EmployerProfile, Title


class Expertise(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name}"


class JobPost(models.Model):
    employerProfile = models.ForeignKey(
        EmployerProfile, on_delete=models.CASCADE, related_name="job_posts"
    )
    expertise = models.ForeignKey(
        Expertise,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="job_posts",
    )
    title = models.ManyToManyField(Title, blank=True, related_name="job_posts")
    location = models.CharField(max_length=255)
    requirements = models.TextField()
    salary = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
