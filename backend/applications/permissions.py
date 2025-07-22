from rest_framework import permissions


class IsApplicant(permissions.BasePermission):
    message = "You must be an applicant to access this resource."
    def has_permission(self, request, view):
        return request.user.is_applicant


class HasApplicantProfile(permissions.BasePermission):
    message = "You must have an applicant profile to access this resource."
    def has_permission(self, request, view):
        return hasattr(request.user, "applicant_profile")


class OwnerOfApplicantProfilePath(permissions.BasePermission):
    message = "You do not have permission to access this applicant profile."
    def has_permission(self, request, view):
        applicant_id = int(view.kwargs.get("applicant_id"))
        return request.user.applicant_profile.id == applicant_id
