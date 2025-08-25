from django.contrib.postgres.search import SearchVector
from django.db.models import Avg, Q
from django_filters import CharFilter, NumberFilter
from django_filters.rest_framework import FilterSet

from . import models


class ApplicationFilter(FilterSet):
    kw = CharFilter(method="filter_keyword")

    def filter_keyword(self, queryset, name, value):
        if not value:
            return queryset
        search_vector = SearchVector(
            "job_post__name",
            "job_post__skills__name",
            "job_post__titles__name",
            "job_post__employer__company_name",
            "job_post__location",
            "applicant__user__first_name",
            "applicant__user__last_name",
        )
        return queryset.annotate(search=search_vector).filter(search=value)

    class Meta:
        model = models.Application
        fields = {
            "job_post": ["exact"],
            "applicant": ["exact"],
            "created_at": ["exact", "lt", "gt"],
        }
