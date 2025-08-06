from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import JobPost
from .models import CV, Application
from .permissions import HasApplicantProfile, IsApplicant, OwnerOfApplicantProfilePath
from .serializers import CVSerializer, ApplicationReadSerializer, ApplicationWithApplicantSerializer
from user.permissions import IsApplicant, IsAdminOrOwnerEmployer


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
            "create": [IsAuthenticated, IsApplicant, HasApplicantProfile, OwnerOfApplicantProfilePath],
            "list": [IsAuthenticated, IsApplicant, HasApplicantProfile, OwnerOfApplicantProfilePath],
            "retrieve": [IsAuthenticated],
            "destroy": [IsAuthenticated, IsApplicant, HasApplicantProfile, OwnerOfApplicantProfilePath],
        }
        permissions = PERMISSION_MAP.get(self.action)
        return [permission() for permission in permissions]


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()

    def get_serializer(self, *args, **kwargs):
        if self.action in ['by_job']:
            return ApplicationWithApplicantSerializer(*args, **kwargs)
        elif self.action in ['my_applications']:
            return ApplicationReadSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)

    def get_permissions(self):
        if self.action in ['my_applications']:
            return [IsApplicant()]
        elif self.action in ['by_job']:
            return [IsAdminOrOwnerEmployer()]
        else:
            return [IsAuthenticated]

    @action(detail=False, methods=["get"], url_path='my-applications')
    def my_applications(self, request):
        user = request.user

        applications = self.queryset.filter(applicant=user.applicant_profile).select_related("job_post")
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by_job/(?P<job_id>[^/.]+)')
    def by_job(self, request, job_id=None):
        """
        GET /api/applications/by_job/{job_id}/
        Trả về danh sách các ứng cử viên đã apply vào job có id là job_id
        """
        job = get_object_or_404(JobPost, id=job_id)

        applications = self.queryset.filter(job_post=job)

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
