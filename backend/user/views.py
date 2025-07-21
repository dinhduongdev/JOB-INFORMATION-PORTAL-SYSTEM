from django.http import HttpRequest
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated

from proxies.s3.avatars import get_random_default_avatar_key
from utils.response import api_response

from user import dao, models, permissions
from user.serializers import UserBaseSerializer, UserCreateSerializer, SkillSerializer, WorkExperienceSerializer, \
    EmployerProfileSerializer, ApplicantProfileUpdateSerializer, ApplicantProfileReadSerializer
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


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


class TitleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Title.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


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
            return [permissions.IsAdminOrOwnerApplicantOrEmployerOfApplicant]

        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsApplicant]

        return [permissions.IsAuthenticated]

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








