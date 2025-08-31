from django.http import HttpRequest
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated

from proxies.s3.avatars import get_random_default_avatar_key
from user.models import User
from utils.response import api_response

from user import dao, models, permissions
from user.serializers import UserBaseSerializer, UserCreateSerializer, SkillSerializer, WorkExperienceSerializer, \
    EmployerProfileSerializer, ApplicantProfileUpdateSerializer, ApplicantProfileReadSerializer, UserUpdateSerializer
from user.tasks import send_account_activation_email


class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == "register":
            return UserCreateSerializer
        return UserBaseSerializer

    def send_activation_email(self, user, request: HttpRequest):
        send_account_activation_email.delay(
            url_path=request.build_absolute_uri("/api/v1/auth/activate/"),
            user_data=UserBaseSerializer(user).data,
            token=user.create_token(),
        )

    @action(methods=["post"], detail=False, url_path="register")
    def register(self, request):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        self.send_activation_email(serializer.instance, request)

        return api_response(
            data=None,
            status=status.HTTP_201_CREATED,
            message="User registered successfully. Please check your email to activate your account.",
        )

    @action(detail=False, methods=["get"], url_path="activate/(?P<token>.+)")
    def verify_activation_token(self, request: HttpRequest, token: str):
        user = dao.get_inactive_user_from_token_or_404(token)

        user.is_active = True
        user.avatar = get_random_default_avatar_key()
        if user.is_employer:
            user.employer_profile = models.EmployerProfile.objects.create(
                user=user,
            )
        if user.is_applicant:
            user.employee_profile = models.ApplicantProfile.objects.create(
                user=user,
            )
        user.save()

        return api_response(
            message="Account activated successfully.",
            status=status.HTTP_200_OK,
        )


class UserViewSet(viewsets.ViewSet):
    """
    ViewSet for user profile updates only
    Supported actions:
    - update_my_profile: PUT/PATCH /api/users/me/ (authenticated users)
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer

    def get_permissions(self):
        if self.action in ["update_my_profile"]:
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=["get"], url_path="me")
    def get_my_profile(self, request: HttpRequest):
        """
        Get authenticated user's profile

        Responses:
        ----------
        200 OK:
        {
            "id": "integer",
            "email": "string",
            "first_name": "string",
            "last_name": "string",
            "avatar": "string",
            "role": "string",
            "is_active": "boolean"
        }

        401 Unauthorized:
        {
            "detail": "Authentication credentials were not provided."
        }
        """
        user = request.user
        serializer = self.serializer_class(user, context={"request": request})

        response_data = {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar": user.avatar,
            "role": user.role,
            "is_active": user.is_active
        }

        return api_response(data=response_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["put", "patch"], url_path="me")
    def update_my_profile(self, request: HttpRequest):
        """
    Update authenticated user's profile
    Supports partial update (PATCH) and full update (PUT)
    Password update requires current_password, new_password and confirm_password

    Parameters:
    -----------
    Request Body (application/json):
    {
        "first_name": "string",          # Optional
        "last_name": "string",           # Optional
        "avatar": "string",              # Optional - avatar key
        "current_password": "string",    # Required when changing password
        "new_password": "string",        # Required when changing password
        "confirm_password": "string"     # Required when changing password
    }

    Responses:
    ----------
    200 OK:
    {
        "id": "integer",
        "email": "string",
        "first_name": "string",
        "last_name": "string",
        "avatar": "string",
        "role": "string",
        "is_active": "boolean",
        "message": "string"
    }

    400 Bad Request:
    {
        "error": {
            "current_password": ["Current password is incorrect."],
            "new_password": ["This password is too common."]
        }
    }

    401 Unauthorized:
    {
        "detail": "Authentication credentials were not provided."
    }

    Example Requests:
    ----------------
    1. Update basic info:
    PATCH /api/users/me/
    {
        "first_name": "John",
        "last_name": "Doe"
    }

    2. Change password:
    PUT /api/users/me/
    {
        "current_password": "old@123",
        "new_password": "new@123",
        "confirm_password": "new@123"
    }
    """
        try:
            user = request.user
            serializer = self.serializer_class(
                user,
                data=request.data,
                partial=request.method == "PATCH",
                context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            updated_user = serializer.save()

            response_data = {
                "id": updated_user.id,
                "email": updated_user.email,
                "first_name": updated_user.first_name,
                "last_name": updated_user.last_name,
                "avatar": updated_user.avatar,
                "role": updated_user.role,
                "is_active": updated_user.is_active,
                "message": "User profile updated successfully"
            }

            return api_response(data=response_data, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            raise NotFound("User not found")
        except ValidationError as e:
            return api_response(
                message={"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return api_response(
                message={"An error occurred during update"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class TitleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Title.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class ApplicantProfileViewSet(viewsets.ViewSet):
    queryset = models.ApplicantProfile.objects.all()

    def get_permissions(self):
        if self.action in ["retrieve", "list"]:
            return [permissions.IsAdminOrOwnerApplicantOrEmployerOfApplicant()]
        elif self.action in ["get_my_profile", "update_my_profile"]:
            return [permissions.IsApplicant()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ["update_my_profile"]:
            return ApplicantProfileUpdateSerializer
        return ApplicantProfileReadSerializer

    def get_queryset(self):
        return models.ApplicantProfile.objects.all().select_related('user').prefetch_related('skills', 'work_experiences')

    def get_object(self, pk):
        try:
            return self.get_queryset().get(pk=pk)
        except models.ApplicantProfile.DoesNotExist:
            raise api_response(message="Applicant profile not found.", status=status.HTTP_404_NOT_FOUND)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(queryset, many=True, context={"request": request})
        return api_response(data=serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request: HttpRequest, pk=None):
        profile = self.get_object(pk)
        serializer = self.get_serializer_class()(
            profile,
            context={"request": request}
        )
        return api_response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"], url_path="me")
    def get_my_profile(self, request: HttpRequest):
        try:
            profile = request.user.applicant_profile
            serializer = self.get_serializer_class()(
                profile,
                context={"request": request}
            )
            return api_response(
                data=serializer.data,
                status=status.HTTP_200_OK,
                message="Your applicant profile retrieved successfully."
            )
        except models.ApplicantProfile.DoesNotExist:
            return api_response(
                data=None,
                status=status.HTTP_404_NOT_FOUND,
                message="Applicant profile not found."
            )

    @action(detail=False, methods=["put", "patch"], url_path="me/update")
    def update_my_profile(self, request: HttpRequest):
        try:
            profile = request.user.applicant_profile
            serializer = self.get_serializer_class()(
                profile,
                data=request.data,
                partial=request.method == "PATCH",
                context={"request": request}
            )
            serializer.is_valid(raise_exception=True)
            updated_profile = serializer.save()

            response_serializer = ApplicantProfileReadSerializer(
                updated_profile,
                context={"request": request}
            )

            return api_response(
                data=response_serializer.data,
                status=status.HTTP_200_OK,
                message="Applicant profile updated successfully."
            )
        except models.ApplicantProfile.DoesNotExist:
            return api_response(
                data=None,
                status=status.HTTP_404_NOT_FOUND,
                message="Applicant profile not found."
            )


class EmployerProfileViewSet(viewsets.ModelViewSet):
    queryset = models.EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer

    def get_permissions(self):
        if self.action in ["retrieve", " list"]:
            return [permissions.IsAdminOrOwnerApplicantOrEmployerOfApplicant]

        elif self.action in ["create", "update", "partial_update"]:
            return [permissions.IsEmployer]

        elif self.action == "destroy":
            return [permissions.IsAdmin]

        return [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="me")
    def get_my_profile(self, request: HttpRequest):
        serializer = self.get_serializer(
            request.user.employer_profile, context={"request": request}
        )
        return api_response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            message="Employer profile retrieved successfully.",
        )

    @action(detail=False, methods=["post"], url_path="me")
    def create_my_profile(self, request: HttpRequest):
        serializer = self.get_serializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return api_response(
            data=self.get_serializer(profile).data,
            status=status.HTTP_201_CREATED,
            message="Employer profile created successfully.",
        )

    @action(detail=False, methods=["put", "patch"], url_path="me")
    def update_my_profile(self, request: HttpRequest):
        profile = request.user.employer_profile
        serializer = self.get_serializer(
            profile,
            data=request.data,
            partial=request.method == "PATCH",
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        profile = serializer.save()

        return api_response(
            data=self.get_serializer(profile).data,
            status=status.HTTP_200_OK,
            message="Employer profile updated successfully.",
        )


class WorkExperienceViewSet(viewsets.ModelViewSet):
    queryset = models.WorkExperience.objects.all()
    serializer_class = WorkExperienceSerializer

    def get_permissions(self):
        if self.action in ["retrieve", "list"]:
            return [permissions.IsAdminOrOwnerApplicantOrEmployerOfApplicant()]

        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsApplicant()]

        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=["get"], url_path="me")
    def get_my_work_experience(self, request: HttpRequest, pk=None):
        profile = request.user.applicant_profile
        work_experience = profile.work_experience.filter(id=pk).first()

        if not work_experience:
            return api_response(
                data=None,
                status=status.HTTP_404_NOT_FOUND,
                message="Work experience not found."
            )

        serializer = self.get_serializer(work_experience, context={"request": request})
        return api_response(
            data=serializer.data,
            status=status.HTTP_200_OK,
            message="Work experience retrieved successfully."
        )

    @action(detail=False, methods=["post"], url_path="me")
    def create_my_work_experience(self, request: HttpRequest):
        applicant = request.user.applicant_profile
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(applicant=applicant)

        return api_response(
            data=serializer.data,
            status=status.HTTP_201_CREATED,
            message="Work experience created successfully."
        )








