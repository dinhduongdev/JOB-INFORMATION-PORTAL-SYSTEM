from django.urls import path, include
from rest_framework.routers import DefaultRouter
from user.views import (
    AuthViewSet,
    EmployerProfileViewSet,
    ApplicantProfileViewSet,
    SkillViewSet,
    TitleViewSet,
    WorkExperienceViewSet)


router = DefaultRouter()

# Import your viewsets here
router.register(r"v1/auth", AuthViewSet, basename="auth")
router.register(r"v1/employer-profile", EmployerProfileViewSet, basename="employer-profile")
router.register(r"v1/applicant-profile", ApplicantProfileViewSet, basename="applicant-profile")
router.register(r"v1/skills", SkillViewSet, basename="skills")
router.register(r"v1/titles", TitleViewSet, basename="titles")
router.register(r"v1/work-experience", WorkExperienceViewSet, basename="work-experience")


urlpatterns = [
    path("", include(router.urls)),
]
