from .models import JobPost, Expertise, Salary
from rest_framework import serializers
# from user.serializers import TitleSerializer, SkillSerializer, EmployerSerializer


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


class JobPostSerializer(serializers.ModelSerializer):
    expertise = ExpertiseSerializer(required=False)
    salary = SalarySerializer()
    # title = TitleSerializer(many=True, required=False)
    # skills = SkillSerializer(many=True, required=False)
    # employerProfile = EmployerSerializer(read_only=True)

    class Meta:
        model = JobPost
        fields = [
            'id',
            'employerProfile',
            'expertise',
            'title',
            'skills',
            'location',
            'requirements',
            'salary',
            'description',
            'created_at',
            'due_date',
            'is_active',
        ]
        read_only_fields = ['id', 'created_at', 'employerProfile']

    def create(self, validated_data):
        expertise_data = validated_data.pop('expertise', None)
        salary_data = validated_data.pop('salary', None)

        # Handle Salary
        salary = None
        if salary_data:
            salary = Salary.objects.create(**salary_data)
            validated_data['salary'] = salary

        # Create JobPost
        job_post = JobPost.objects.create(**validated_data)

        # Handle Expertise
        if expertise_data:
            expertise, _ = Expertise.objects.get_or_create(**expertise_data)
            job_post.expertise = expertise
            job_post.save()

        return job_post

    def update(self, instance, validated_data):
        expertise_data = validated_data.pop('expertise', None)
        salary_data = validated_data.pop('salary', None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Handle Expertise update
        if expertise_data:
            expertise, _ = Expertise.objects.get_or_create(**expertise_data)
            instance.expertise = expertise

        # Handle Salary update
        if salary_data:
            if instance.salary:
                for attr, value in salary_data.items():
                    setattr(instance.salary, attr, value)
                instance.salary.save()
            else:
                instance.salary = Salary.objects.create(**salary_data)

        instance.save()
        return instance

    def validate_salary(self, value):
        """Delegates validation to nested SalarySerializer"""
        serializer = SalarySerializer(data=value)
        serializer.is_valid(raise_exception=True)
        return value

    def validate_location(self, value):
        if not value.strip():
            raise serializers.ValidationError("Location must not be empty.")
        return value.strip()