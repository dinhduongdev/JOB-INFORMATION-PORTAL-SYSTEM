from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from itsdangerous import URLSafeTimedSerializer

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

        user = self.create_user(
            email=email, password=password, role=Role.ADMIN, **extra_fields
        )
        return user


class Role(models.TextChoices):
    EMPLOYER = "Employer"
    APPLICANT = "Applicant"
    ADMIN = "Admin"


class User(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    # avatar field is key of a s3 object
    avatar = models.CharField(max_length=255, blank=False, null=True)
    is_active = models.BooleanField(default=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.APPLICANT,
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
    def is_applicant(self):
        return self.role == Role.APPLICANT

    @property
    def avatar_url(self):
        return f"https://{settings.CLOUDFRONT_DOMAIN}/{self.avatar}"

    def create_token(self, salt=settings.ACTIVATION_TOKEN_SALT):
        s = URLSafeTimedSerializer(settings.SECRET_KEY, salt=salt)
        return s.dumps({"pk": self.pk})

    def __str__(self):
        return f"{self.email}|{self.get_full_name()}"


class ApplicantProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="applicant_profile"
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    skills = models.ManyToManyField(
        "Skill",
        through="ApplicantSkill",
        blank=True,
        related_name="applicant_profiles"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    birth_date = models.DateField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.email}"


class Title(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name}"


class WorkExperience(models.Model):
    applicant = models.ForeignKey(
        ApplicantProfile, on_delete=models.CASCADE, related_name="work_experiences"
    )
    company_name = models.CharField(max_length=255)
    title = models.ForeignKey(Title, on_delete=models.SET_NULL, blank=True, null=True, related_name="work_experiences")
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["applicant", "company_name", "title"],
                name="unique_company_title_per_applicant"
            )
        ]

    def __str__(self):
        return (
            f"{self.title} at {self.company_name} ({self.start_date} - {self.end_date})"
        )


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name}"


class ApplicantSkill(models.Model):
    applicant = models.ForeignKey(ApplicantProfile, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("applicant", "skill")

    def __str__(self):
        return f"{self.applicant} - {self.skill}"


class EmployerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="employer_profile"
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    company_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.email} - {self.company_name}"
