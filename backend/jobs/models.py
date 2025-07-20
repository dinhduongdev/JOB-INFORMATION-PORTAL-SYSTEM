from django.db import models

from user.models import EmployerProfile, Title, Skill


class Expertise(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.name}"


class Salary(models.Model):
    class Currency(models.TextChoices):
        VND = 'VND', 'VND'
        USD = 'USD', 'USD'
        OTHER = 'OTHER', 'Other'

    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, choices=Currency.choices, default=Currency.VND)
    display_text = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        if self.currency == self.Currency.OTHER:
            return self.display_text or "Thỏa thuận"
        return f"{self.amount:,} {self.currency}"


class JobPost(models.Model):
    employer = models.ForeignKey(
        EmployerProfile, on_delete=models.CASCADE, related_name="job_posts"
    )
    name = models.CharField(max_length=255, null=False)
    expertise = models.ForeignKey(
        Expertise,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name="job_posts",
    )
    titles = models.ManyToManyField(Title, blank=True, related_name="job_posts")
    skills = models.ManyToManyField(Skill, blank=True, related_name='job_posts')
    location = models.CharField(max_length=255)
    requirements = models.TextField()
    salary = models.OneToOneField(
        Salary,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="job_posts",
    )
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
