from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserManagerTests(TestCase):
    def test_create_user_with_email(self):
        user = User.objects.create_user(email="test@example.com", password="password123")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("password123"))


class SuperUserTests(TestCase):
    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email="admin@example.com", password="admin123"
        )
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)
        self.assertEqual(admin_user.role, "Admin")


from .models import ApplicantProfile

class ApplicantProfileTests(TestCase):
    def test_create_applicant_profile(self):
        user = User.objects.create_user(email="applicant@example.com", password="test123")
        profile = ApplicantProfile.objects.create(user=user, phone_number="0123456789")
        self.assertEqual(profile.user.email, "applicant@example.com")
        self.assertEqual(profile.phone_number, "0123456789")



from django.db.utils import IntegrityError
from .models import ApplicantProfile, WorkExperience, Title

class WorkExperienceTests(TestCase):
    def test_unique_constraint_on_work_experience(self):
        user = User.objects.create_user(email="applicant2@example.com", password="test123")
        profile = ApplicantProfile.objects.create(user=user)
        title = Title.objects.create(name="Software Engineer")

        WorkExperience.objects.create(
            applicant=profile,
            company_name="ABC Corp",
            title=title,
            start_date="2020-01-01"
        )

        with self.assertRaises(IntegrityError):
            WorkExperience.objects.create(
                applicant=profile,
                company_name="ABC Corp",
                title=title,
                start_date="2021-01-01"
            )
