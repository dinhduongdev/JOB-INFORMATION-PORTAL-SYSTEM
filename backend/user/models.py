from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from itsdangerous import URLSafeTimedSerializer

from django.conf import settings


class MyUserManager(BaseUserManager):
    def create_user(self, email: str, password: str, **extra_fields):
        if not email:
            raise ValueError(_("Users must have an email address"))

        user: User = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        user = self.create_user(email=email, password=password, **extra_fields)
        return user


class Role(models.TextChoices):
    EMPLOYER = "Employer"
    EMPLOYEE = "Employee"


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    # avatar field is key of a s3 object
    avatar = models.CharField(max_length=255, blank=False, null=True)
    is_active = models.BooleanField(default=False)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.EMPLOYEE,
        blank=False,
        null=False,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = MyUserManager()

    @property
    def is_employer(self):
        return self.role == Role.EMPLOYER
    
    @property
    def is_employee(self):
        return self.role == Role.EMPLOYEE

    @property
    def avatar_url(self):
        return f"https://{settings.CLOUDFRONT_DOMAIN}/{self.avatar}"

    def create_token(self, salt=settings.ACTIVATION_TOKEN_SALT):
        s = URLSafeTimedSerializer(settings.SECRET_KEY, salt=salt)
        return s.dumps({"pk": self.pk})

    def __str__(self):
        return f"{self.email}|{self.get_full_name()}"
