from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from applications.models import Application
from user.models import Role, ApplicantProfile


class IsAdminOrReadOnly(BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    Non-admin users can only read objects.
    """

    def has_permission(self, request: Request, view) -> bool:
        # Allow read-only access for non-admin users
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        # Allow write access only for admin users
        return request.user and request.user.is_staff


class IsAdmin(BasePermission):
    """
    Custom permission to allow only users with the 'Admin' role to access certain views.
    """

    def has_permission(self, request: Request, view) -> bool:
        # Check if the user is authenticated and has the 'Admin' role
        return request.user and request.user.is_authenticated and request.user.role == Role.ADMIN


class IsApplicant(BasePermission):
    """
    Custom permission to allow only users with the 'Employee' role to access certain views.
    """

    def has_permission(self, request: Request, view) -> bool:
        # Check if the user is authenticated and has the 'Applicant' role
        return request.user and request.user.is_authenticated and request.user.role == Role.APPLICANT


class IsEmployer(BasePermission):
    """
    Custom permission to allow only users with the 'Employer' role to access certain views.
    """

    def has_permission(self, request: Request, view) -> bool:
        # Check if the user is authenticated and has the 'Employer' role
        return request.user and request.user.is_authenticated and request.user.role == Role.EMPLOYER


class IsOwnerApplicant(BasePermission):
    """
    Custom permission to allow only the owner of an applicant profile to access it.
    """

    def has_object_permission(self, request: Request, view, obj) -> bool:
        return hasattr(request.user, "applicant_profile") and obj.applicant == request.user.applicant_profile


class IsOwnerEmployer(BasePermission):
    """
    Custom permission to allow only the owner of an employer profile to access it.
    """

    def has_object_permission(self, request: Request, view, obj) -> bool:
        return hasattr(request.user, "employer_profile") and obj.employer == request.user.employer_profile


class IsAdminOrOwnerApplicant(BasePermission):
    """
    Custom permission to allow only admins or the owner of an applicant profile to access it.
    """

    def has_object_permission(self, request: Request, view, obj) -> bool:
        return request.user.is_staff or (hasattr(request.user, "applicant_profile") and obj.applicant == request.user.applicant_profile)


class IsAdminOrOwnerEmployer(BasePermission):
    """
    Custom permission to allow only admins or the owner of an employer profile to access it.
    """

    def has_object_permission(self, request: Request, view, obj) -> bool:
        return request.user.is_staff or (hasattr(request.user, "employer_profile") and obj.employer == request.user.employer_profile)


class IsAdminOrOwnerApplicantOrEmployerOfApplicant(BasePermission):
    def has_object_permission(self, request: Request, view, obj) -> bool:
        user = request.user

        if user.is_staff and user.role == Role.ADMIN:
            return True

        applicant = None
        if isinstance(obj, ApplicantProfile):
            applicant = obj
        elif hasattr(obj, "applicant"):
            applicant = obj.applicant

        # Applicant chính chủ
        if hasattr(user, "applicant_profile") and applicant == user.applicant_profile:
            return True

        if hasattr(user, "employer_profile"):
            return Application.objects.filter(
                applicant=applicant,
                job_post__employer=user.employer_profile
            ).exists()

        return False