from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import (
    ExpertiseViewSet,
    JobPostViewSet, JobPostApplicantsViewSet
)

router = DefaultRouter()

# Import your viewsets here
router.register(r'v1/expertise', ExpertiseViewSet, basename="expertise")
router.register(r'v1/job-posts', JobPostViewSet, basename="job-posts")
router.register(r'v1/jobposts', JobPostApplicantsViewSet, basename='jobpost')


urlpatterns = [
    path("", include(router.urls)),
]