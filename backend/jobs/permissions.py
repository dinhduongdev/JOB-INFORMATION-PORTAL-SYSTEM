from rest_framework.permissions import BasePermission
from user.models import Role


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.role == Role.ADMIN


class IsEmployerOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == Role.EMPLOYER

    def has_object_permission(self, request, view, obj):
        return obj.employerProfile == request.user.employerProfile