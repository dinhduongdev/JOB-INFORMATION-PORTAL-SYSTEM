from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny

from jobs.filters import JobPostFilter
from utils.response import api_response
from jobs.models import Expertise, JobPost
from jobs.serializers import ExpertiseSerializer, JobPostSerializer
from jobs.permissions import IsAdmin, IsEmployerOwner


# Create your views here.
class ExpertiseViewSet(viewsets.ModelViewSet):
    queryset = Expertise.objects.all()
    serializer_class = ExpertiseSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # return [IsAdmin]
            return [AllowAny()] # Temporarily allowing all actions for testing
        return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(name=serializer.validated_data['name'].strip())

    def perform_update(self, serializer):
        serializer.save(name=serializer.validated_data['name'].strip())


class JobPostViewSet(viewsets.ModelViewSet):
    serializer_class = JobPostSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = JobPostFilter
    search_fields = [
        'expertise__name',
        'skills__name',
        'title__name',
        'location',
        'requirements',
        'description',
        'employerProfile__company_name',
    ]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'EMPLOYER':
            return JobPost.objects.filter(employerProfile=user.employerProfile)
        return JobPost.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEmployerOwner()]
        return [AllowAny()]

    def perform_create(self, serializer):
        expertise_data = self.request.data.get('expertise')
        if expertise_data:
            expertise, _ = Expertise.objects.get_or_create(name=expertise_data.get('name', '').strip())
            serializer.save(expertise=expertise, employerProfile=self.request.user.employerProfile)
        else:
            serializer.save(employerProfile=self.request.user.employerProfile)

    def perform_update(self, serializer):
        expertise_data = self.request.data.get('expertise')
        if expertise_data:
            expertise, _ = Expertise.objects.get_or_create(name=expertise_data.get('name', '').strip())
            serializer.save(expertise=expertise)
        else:
            serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.is_active:
            return api_response(
                status=status.HTTP_400_BAD_REQUEST,
                message="You must deactivate the job post before deleting it."
            )
        self.perform_destroy(instance)
        return api_response(
            status=status.HTTP_200_OK,
            message="Job post deleted successfully."
        )








