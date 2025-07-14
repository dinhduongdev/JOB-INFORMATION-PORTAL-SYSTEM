from celery.bin.control import status
from django.http import HttpRequest
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .serializers import UserCreateSerializer, UserBaseSerializer
from utils.response import api_response
from . import dao
from .tasks import send_account_activation_email as se


# Create your views here.
class AuthViewSet(viewsets.GenericViewSet):

    def get_permissions(self):
        if self.action in ['register', 'verify_access_token', 'verify_activation_token']:
            return [AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "register":
            return UserCreateSerializer
        return UserBaseSerializer

    def send_activation_email(self, user, request: HttpRequest):
        se.delay(
            url_path=request.build_absolute_uri("/api/v1/auth/activate/"),
            user_data=UserBaseSerializer(user).data,
            token=user.create_token(),
        )

    @action(methods=['post'], detail=False, url_path='register')
    def register(self, request):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        self.send_activation_email(serializer.instance, request)


        return api_response(
            data=None,
            status=status.HTTP_201_CREATED,
            message="User registered successfully. Please check your email to activate your account."
        )

    @action(methods=['post'], detail=False, url_path='login')
    def login(self, request):
        pass

    @action(methods=['post'], detail=False, url_path='verify')
    def verify_access_token(self, request):
        token = request.data.get('token')
        access_token = dao.get_unexpired_access_token(token)

        if not access_token:
            return api_response(
                status=status.HTTP_401_UNAUTHORIZED,
                message="Invalid or expired access token."
            )

        return api_response(
            status=status.HTTP_200_OK,
            message="Access token is valid."
        )

    @action(detail=False, methods=["get"], url_path="activate/(?P<token>.+)")
    def verify_activation_token(self, request: HttpRequest, token: str = None):
        user = dao.get_inactive_user_from_token(token)

        user.is_active = True
        user.save()

        return api_response(
           message="Account activated successfully.",
            status=status.HTTP_200_OK,
        )




