from django.http import HttpRequest
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

from proxies.s3.avatars import get_random_default_avatar_key
from utils.response import api_response

from . import dao, models
from .serializers import UserBaseSerializer, UserCreateSerializer
from .tasks import send_account_activation_email


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
        if user.is_employee:
            user.employee_profile = models.ApplicantProfile.objects.create(
                user=user,
            )
        user.save()

        return api_response(
            message="Account activated successfully.",
            status=status.HTTP_200_OK,
        )
