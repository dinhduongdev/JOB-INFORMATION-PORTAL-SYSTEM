from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from user.models import User, ApplicantProfile
from jobs.models import JobPost
from applications.models import CV, Application



class CVViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Tạo user applicant
        self.user = User.objects.create_user(
            username="applicant1", password="pass123", is_applicant=True
        )
        self.applicant_profile = ApplicantProfile.objects.create(user=self.user)

        self.client.login(username="applicant1", password="pass123")

        self.cv_url = reverse("cv-list", kwargs={"applicant_id": self.applicant_profile.id})

    def test_create_cv(self):
        data = {"link": "https://example.com/cv.pdf", "applicant": self.applicant_profile.id}
        response = self.client.post(self.cv_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CV.objects.count(), 1)

    def test_list_cv(self):
        CV.objects.create(applicant=self.applicant_profile, link="https://cv1.com")
        response = self.client.get(self.cv_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)



class ApplicationViewSetTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Applicant
        self.user = User.objects.create_user(
            username="applicant2", password="pass123", is_applicant=True
        )
        self.applicant_profile = ApplicantProfile.objects.create(user=self.user)

        # Employer & Job
        self.employer = User.objects.create_user(
            username="employer1", password="pass123", is_employer=True
        )
        self.job_post = JobPost.objects.create(
            title="Backend Developer",
            description="Job description",
            employer=self.employer.employer_profile,
        )

        # CV
        self.cv = CV.objects.create(applicant=self.applicant_profile, link="https://cvtest.com")

        self.client.login(username="applicant2", password="pass123")
        self.application_url = reverse("application-list")

    def test_create_application(self):
        data = {
            "applicant": self.applicant_profile.id,
            "job_post": self.job_post.id,
            "cv": self.cv.id,
            "cover_letter": "I am very interested",
        }
        response = self.client.post(self.application_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), 1)

    def test_unique_application_constraint(self):
        Application.objects.create(
            applicant=self.applicant_profile, job_post=self.job_post, cv=self.cv
        )
        data = {
            "applicant": self.applicant_profile.id,
            "job_post": self.job_post.id,
            "cv": self.cv.id,
        }
        response = self.client.post(self.application_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_my_applications(self):
        Application.objects.create(
            applicant=self.applicant_profile, job_post=self.job_post, cv=self.cv
        )
        url = reverse("application-my-applications")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)



