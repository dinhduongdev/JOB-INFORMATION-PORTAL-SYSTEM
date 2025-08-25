from django.shortcuts import render
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import AllowAny

from jobs.filters import JobPostFilter
from utils.response import api_response
from jobs.models import Expertise, JobPost
from jobs.serializers import ExpertiseSerializer, JobPostReadSerializer, JobPostWriteSerializer
from jobs.permissions import IsAdmin, IsEmployerOwner
from user.permissions import IsEmployer, IsApplicant


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
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = JobPostFilter
    search_fields = [
        "name",
        'expertise__name',
        'skills__name',
        'titles__name',
        'location',
        'requirements',
        'description',
        'employer__company_name',
    ]

    def get_serializer_class(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return JobPostReadSerializer
        return JobPostWriteSerializer

    def get_queryset(self):
        queryset = JobPost.objects.select_related(
            'employer',
            'expertise',
            'salary'
        ).prefetch_related(
            'titles',
            'skills'
        )

        user = self.request.user
        if user.is_authenticated and hasattr(user, 'role') and user.role == 'EMPLOYER':
            return queryset.filter(employer=user.employer_profile)
        return queryset

    # def get_permissions(self):
    #     if self.action in ['create', 'update', 'partial_update', 'destroy']:
    #         return [IsEmployerOwner()]
    #     elif self.action in [ 'my_posts']:
    #         return [IsEmployer()]
    #     return [AllowAny()]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user.employer_profile)

    def perform_update(self, serializer):
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        self.check_object_permissions(request, instance)

        # if instance.is_active:
        #     return api_response(
        #         status=status.HTTP_400_BAD_REQUEST,
        #         message="You must deactivate the job post before deleting it.",
        #         data={'is_active': instance.is_active}
        #     )

        self.perform_destroy(instance)
        return api_response(
            status=status.HTTP_200_OK,
            message="Job post deleted successfully.",
            data={'deleted_at': timezone.now()}
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status=status.HTTP_200_OK,
            message="Job posts retrieved successfully",
            data=serializer.data
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(
            status=status.HTTP_200_OK,
            message="Job post retrieved successfully",
            data=serializer.data
        )

    @action(detail=False, methods=['get'], url_path="my-posts")
    def my_posts(self, request):
        queryset = self.filter_queryset(
            self.get_queryset().filter(employer=request.user.employer_profile)
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return api_response(
            status=status.HTTP_200_OK,
            message="Your job posts retrieved successfully",
            data=serializer.data
        )


