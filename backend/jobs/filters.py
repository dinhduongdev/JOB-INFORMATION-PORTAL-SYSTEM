from rest_framework.exceptions import ValidationError

from .models import JobPost
from django_filters import rest_framework as filters
from django_filters import BaseInFilter, NumberFilter

class NumberInFilter(BaseInFilter, NumberFilter):
    pass

class JobPostFilter(filters.FilterSet):
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    is_active = filters.BooleanFilter()
    expertise = filters.NumberFilter(field_name='expertise__id')
    expertise_name = filters.CharFilter(field_name='expertise__name', lookup_expr='icontains')
    title = NumberInFilter(field_name='title__id', lookup_expr='in')
    skills = NumberInFilter(field_name='skills__id', lookup_expr='in')
    due_date = filters.DateFromToRangeFilter()

    salary_currency = filters.CharFilter(field_name='salary__currency')
    salary_amount_gte = filters.NumberFilter(field_name='salary__amount', lookup_expr='gte')
    salary_amount_lte = filters.NumberFilter(field_name='salary__amount', lookup_expr='lte')

    class Meta:
        model = JobPost
        fields = [
            'location',
            'is_active',
            'expertise',
            'expertise_name',
            'title',
            'skills',
            'due_date',
            'salary_currency',
            'salary_amount_gte',
            'salary_amount_lte',
        ]

    def __init__(self, data=None, queryset=None, *, request=None, prefix=None):
        super().__init__(data, queryset, request=request, prefix=prefix)

        amount_filter_keys = ['salary_amount_gte', 'salary_amount_lte']
        amount_filters_present = any(key in self.data for key in amount_filter_keys)
        currency_present = 'salary_currency' in self.data

        if amount_filters_present and not currency_present:
            raise ValidationError({
                'salary_currency': 'Filtering by salary requires specifying the currency (salary_currency).'
            })
