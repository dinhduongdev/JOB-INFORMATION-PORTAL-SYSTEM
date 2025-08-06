from django.utils import timezone

from user.models import Title, Skill
from user.serializers import TitleSerializer, SkillSerializer, EmployerProfileSerializer
from .models import JobPost, Expertise, Salary
from rest_framework import serializers


class ExpertiseSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=100,
        required=True,
        allow_blank=False,
    )

    class Meta:
        model = Expertise
        fields = ['id', 'name']
        read_only_fields = ['id']

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Name cannot be empty.")

        if Expertise.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("An expertise with this name already exists.")

        return value

    def create(self, validated_data):
        validated_data['name'] = validated_data['name'].strip()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'name' in validated_data:
            validated_data['name'] = validated_data['name'].strip()
        return super().update(instance, validated_data)


class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['amount', 'currency', 'display_text']

    def validate(self, data):
        currency = data.get('currency')
        if currency == Salary.Currency.OTHER:
            if not data.get('display_text'):
                raise serializers.ValidationError("Display text is required for OTHER salary type.")
        else:
            if not data.get('amount'):
                raise serializers.ValidationError("Amount is required for VND/USD salary.")
        return data


class JobPostWriteSerializer(serializers.ModelSerializer):
    expertise_id = serializers.PrimaryKeyRelatedField(
        queryset=Expertise.objects.all(),
        source='expertise',
        required=False,
        allow_null=True
    )
    title_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Title.objects.all(),
        source='titles',
        required=False
    )
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        source='skills',
        required=False
    )
    salary = SalarySerializer()

    class Meta:
        model = JobPost
        fields = [
            'id',
            "name",
            'expertise_id',
            'title_ids',
            'skill_ids',
            'location',
            'requirements',
            'salary',
            'description',
            'due_date',
            'is_active',
        ]
        read_only_fields = ['id']

    def create(self, validated_data):
        salary_data = validated_data.pop('salary')
        salary = Salary.objects.create(**salary_data)
        validated_data['salary'] = salary

        job_post = super().create(validated_data)
        return job_post

    def update(self, instance, validated_data):
        if 'salary' in validated_data:
            salary_data = validated_data.pop('salary')
            if instance.salary:
                for attr, value in salary_data.items():
                    setattr(instance.salary, attr, value)
                instance.salary.save()
            else:
                instance.salary = Salary.objects.create(**salary_data)

        return super().update(instance, validated_data)

    def validate(self, data):
        if not data.get('description', '').strip():
            raise serializers.ValidationError({"description": "Description cannot be empty."})

        if data.get('due_date') and data['due_date'] < timezone.now():
            raise serializers.ValidationError({"due_date": "Due date must be in the future."})

        return data


class JobPostReadSerializer(serializers.ModelSerializer):
    expertise = ExpertiseSerializer()
    titles = TitleSerializer(many=True)
    skills = SkillSerializer(many=True)
    employer = EmployerProfileSerializer()
    salary = SalarySerializer()
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPost
        fields = [
            'id',
            "name",
            'employer',
            'expertise',
            'titles',
            'skills',
            'location',
            'requirements',
            'salary',
            'description',
            'created_at',
            'due_date',
            'is_active',
            "application_count",
        ]
        read_only_fields = fields

    def get_application_count(self, obj):
        return obj.applications.count()