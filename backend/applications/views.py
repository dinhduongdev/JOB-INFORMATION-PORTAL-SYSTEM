from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CV
from .permissions import HasApplicantProfile, IsApplicant, OwnerOfApplicantProfilePath
from .serializers import CVSerializer


class CVViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
):
    serializer_class = CVSerializer
    pagination_class = None  

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
