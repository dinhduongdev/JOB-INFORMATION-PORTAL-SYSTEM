from django.db import models

from jobs.models import JobPost
from user.models import ApplicantProfile


class CV(models.Model):
    applicant = models.ForeignKey(
        ApplicantProfile, on_delete=models.CASCADE, related_name="cvs"
    )
    link = models.URLField(max_length=200, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Application(models.Model):
    applicant = models.ForeignKey(
        ApplicantProfile, on_delete=models.CASCADE, related_name="applications"
    )
    job_post = models.ForeignKey(
        JobPost, on_delete=models.CASCADE, related_name="applications"
    )
    cover_letter = models.TextField(blank=True, null=True)
    cv = models.ForeignKey(
        CV,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="applications",
    )
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["applicant", "job_post"],
                name="unique_application_per_job_post",
            )
        ]
