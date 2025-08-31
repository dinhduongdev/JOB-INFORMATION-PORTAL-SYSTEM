from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import JobPost
from proxies.s3.utils import delete_object
from user.permissions import IsAdminOrOwnerEmployer, IsApplicant

from .models import CV, Application
from .permissions import (
    HasApplicantProfile,
    OwnerOfApplicantProfilePath,
)
from .serializers import (
    ApplicationWriteSerializer,
    ApplicationReadSerializer,
    CVSerializer,
)
from .filters import ApplicationFilter


class CVViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
):
    serializer_class = CVSerializer

    def get_queryset(self):
        applicant_id = self.kwargs.get("applicant_id")
        return CV.objects.filter(applicant=applicant_id)

    def get_permissions(self):
        PERMISSION_MAP = {
            "create": [
                IsAuthenticated,
                IsApplicant,
                HasApplicantProfile,
                OwnerOfApplicantProfilePath,
            ],
            "list": [
                IsAuthenticated,
                IsApplicant,
                HasApplicantProfile,
                OwnerOfApplicantProfilePath,
            ],
            "retrieve": [IsAuthenticated],
            "destroy": [
                IsAuthenticated,
                IsApplicant,
                HasApplicantProfile,
                OwnerOfApplicantProfilePath,
            ],
        }
        permissions = PERMISSION_MAP.get(self.action)
        return [permission() for permission in permissions]

    def perform_destroy(self, instance):
        delete_object(instance.link)
        return super().perform_destroy(instance)


class ApplicationViewSet(viewsets.ModelViewSet):
    filterset_class = ApplicationFilter
    ordering_fields = ["applied_at"]

    def get_queryset(self):
        base = Application.objects.all().select_related(
            "job_post", "applicant", "cv", "job_post__employer"
        )

        user = self.request.user
        if user.is_staff or user.is_superuser or getattr(user, "role", None) == "ADMIN":
            return base

        if user.is_applicant:
            return base.filter(applicant=user.applicant_profile)

        if user.is_employer:
            return base.filter(job_post__employer=user.employer_profile)

        return base.none()

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ApplicationReadSerializer
        elif self.action in ["my_applications"]:
            return ApplicationReadSerializer
        return ApplicationWriteSerializer

    def get_permissions(self):
        BASE_PERMISSIONS = [IsAuthenticated]
        PERMISSION_MAP = {
            "list": [],
            "retrieve": [],
            "create": [IsApplicant],
            "update": [IsApplicant],
            "partial_update": [IsApplicant],
            "destroy": [IsApplicant],
            "my_applications": [IsApplicant]
        }

        permission_classes = BASE_PERMISSIONS + PERMISSION_MAP.get(self.action)
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=["get"], url_path="my-applications")
    def my_applications(self, request):
        user = request.user

        applications = self.get_queryset().filter(
            applicant=user.applicant_profile
        ).select_related("job_post")

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
