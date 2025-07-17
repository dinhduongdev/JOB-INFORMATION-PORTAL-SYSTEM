from django.urls import path, include
from rest_framework.routers import DefaultRouter
from jobs.views import (
    ExpertiseViewSet,
    JobPostViewSet
)

router = DefaultRouter()

# Import your viewsets here
router.register(r'v1/expertise', ExpertiseViewSet, basename="expertise")
router.register(r'v1/job-posts', JobPostViewSet, basename="job-posts")


urlpatterns = [
    path("", include(router.urls)),
]