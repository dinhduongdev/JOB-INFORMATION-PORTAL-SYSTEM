

from rest_framework.test import APITestCase
from django.urls import reverse
from user.models import User, EmployerProfile
from jobs.models import JobPost, Expertise, Salary
from django.test import TestCase
from jobs.models import Expertise, Salary
from django.utils import timezone
from user.models import User, EmployerProfile
from jobs.models import JobPost, Expertise, Salary

class ExpertiseModelTests(TestCase):
    def test_create_expertise(self):
        expertise = Expertise.objects.create(name="Backend Development")
        self.assertEqual(str(expertise), "Backend Development")


class SalaryModelTests(TestCase):
    def test_salary_vnd(self):
        salary = Salary.objects.create(amount=10000000, currency=Salary.Currency.VND)
        self.assertIn("VND", str(salary))

    def test_salary_other(self):
        salary = Salary.objects.create(currency=Salary.Currency.OTHER, display_text="Thỏa thuận")
        self.assertEqual(str(salary), "Thỏa thuận")


class JobPostModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="employer@example.com", password="test123", role="Employer")
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name="Tech Corp")
        self.expertise = Expertise.objects.create(name="Data Science")
        self.salary = Salary.objects.create(amount=2000, currency=Salary.Currency.USD)

    def test_create_job_post(self):
        job = JobPost.objects.create(
            employer=self.employer_profile,
            name="Data Scientist",
            expertise=self.expertise,
            location="Hà Nội",
            requirements="Python, ML, DL",
            salary=self.salary,
            description="Mô tả công việc...",
            due_date=timezone.now() + timezone.timedelta(days=30)
        )
        self.assertEqual(job.name, "Data Scientist")
        self.assertTrue(job.is_active)
        self.assertEqual(job.expertise.name, "Data Science")



from rest_framework.test import APITestCase
from rest_framework import status
from jobs.models import Expertise
from django.urls import reverse


class ExpertiseAPITests(APITestCase):
    def test_create_expertise(self):
        url = reverse("expertise-list")  # tên route theo router
        response = self.client.post(url, {"name": "Frontend"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Expertise.objects.filter(name="Frontend").exists())

    def test_list_expertise(self):
        Expertise.objects.create(name="Backend")
        url = reverse("expertise-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)



class JobPostAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="employer@example.com", password="test123", role="Employer")
        self.employer_profile = EmployerProfile.objects.create(user=self.user, company_name="Tech Corp")
        self.client.force_authenticate(user=self.user)

        self.expertise = Expertise.objects.create(name="AI")
        self.salary = Salary.objects.create(amount=3000, currency=Salary.Currency.USD)

    def test_create_job_post(self):
        url = reverse("jobpost-list")
        data = {
            "name": "AI Engineer",
            "expertise": self.expertise.id,
            "location": "HCM",
            "requirements": "TensorFlow, PyTorch",
            "salary": self.salary.id,
            "description": "Chi tiết công việc",
            "due_date": (timezone.now() + timezone.timedelta(days=20)).isoformat()
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(JobPost.objects.filter(name="AI Engineer").exists())

    def test_list_job_posts(self):
        JobPost.objects.create(
            employer=self.employer_profile,
            name="Backend Dev",
            expertise=self.expertise,
            location="HCM",
            requirements="Django",
            salary=self.salary,
            description="Chi tiết công việc",
            due_date=timezone.now() + timezone.timedelta(days=20),
        )
        url = reverse("jobpost-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["data"]), 1)  # do api_response bọc data

