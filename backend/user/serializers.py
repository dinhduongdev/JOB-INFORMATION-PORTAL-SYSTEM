from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from proxies.s3.avatars import list_user_avatar_keys

from .models import Role, User, ApplicantProfile, EmployerProfile, Skill, Title, WorkExperience


class UserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "role",
            "is_active",
        ]

    def to_representation(self, instance):
        custom_fields = {
            "full_name": f"{instance.first_name} {instance.last_name}",
            "role_display": instance.get_role_display(),
        }
        representation = super().to_representation(instance) | custom_fields
        return representation

    def validate_password(self, value):
        validate_password(value)
        return value


class UserCreateSerializer(UserBaseSerializer):
    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields + ["password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True, "allow_blank": False},
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
        }

    def validate_role(self, value):
        # Only superuser can create admin users
        if value == Role.ADMIN and not self.context["request"].user.is_superuser:
            raise serializers.ValidationError("Cannot create admin users")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(UserBaseSerializer):
    current_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    new_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )
    confirm_password = serializers.CharField(
        write_only=True, required=False, allow_blank=True
    )

    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields + [
            "current_password",
            "new_password",
            "confirm_password",
            "avatar",
        ]
        extra_kwargs = {
            "email": {"required": True, "allow_blank": False},
            "first_name": {"required": False, "allow_blank": True},
            "last_name": {"required": False, "allow_blank": True},
            "avatar": {"required": False, "allow_blank": False, "write_only": True},
            "role": {"required": False, "allow_blank": True},
            "is_active": {"required": False, "allow_null": True},
        }

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        current_password = self.initial_data.get("current_password")
        if value and not current_password:
            raise serializers.ValidationError(
                "New password cannot be set without current password."
            )

        value = super().validate_password(value)
        return value

    def validate_avatar(self, new_avatar_key):
        """
        Check if the new avatar key is in the list of user's avatar keys (upload was successful)
        """
        user = self.context["request"].user

        if user.avatar == new_avatar_key:
            return new_avatar_key

        if new_avatar_key not in list_user_avatar_keys(user.pk):
            raise serializers.ValidationError("Invalid avatar key.")
        return new_avatar_key

    def update(self, instance, validated_data):
        if "new_password" in validated_data:
            new_password = validated_data.pop("new_password")
            instance.set_password(new_password)

        # for attr, value in validated_data.items():
        #     setattr(instance, attr, value)

        return super().update(instance, validated_data)


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Skill name cannot be empty.")
        return value


class TitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Title
        fields = ["id", "name"]
        read_only_fields = ["id"]

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Title name cannot be empty.")
        return value


class WorkExperienceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = ["id", "company_name", "title", "start_date", "end_date"]


class ApplicantProfileReadSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    work_experiences = WorkExperienceShortSerializer(many=True, read_only=True)

    class Meta:
        model = ApplicantProfile
        fields = [
            "id",
            "user",
            "phone_number",
            "description",
            "skills",
            "work_experiences",
            "created_at",
            "updated_at",
        ]


class ApplicantProfileUpdateSerializer(serializers.ModelSerializer):
    skill_ids = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source='skills'
    )
    work_experience_ids = serializers.PrimaryKeyRelatedField(
        queryset=WorkExperience.objects.all(),
        write_only=True,
        many=True,
        required=False,
        source='work_experiences'
    )

    class Meta:
        model = ApplicantProfile
        fields = [
            "phone_number",
            "description",
            "skill_ids",
            "work_experience_ids",
        ]
        extra_kwargs = {
            "phone_number": {"required": False, "allow_blank": True},
            "description": {"required": False, "allow_blank": True},
        }

    def update(self, instance, validated_data):
        skills = validated_data.pop('skills', None)
        if skills is not None:
            instance.skills.set(skills)

        work_experiences = validated_data.pop('work_experiences', None)
        if work_experiences is not None:
            instance.work_experiences.set(work_experiences)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# class ApplicantProfileSerializer(serializers.ModelSerializer):
#     user = serializers.PrimaryKeyRelatedField(read_only=True)
#     skills = SkillSerializer(many=True, required=False)
#     skill_ids = serializers.PrimaryKeyRelatedField(
#         queryset=Skill.objects.all(), write_only=True, many=True,required=False
#     )
#     work_experiences =  WorkExperienceShortSerializer(many=True, read_only=True)
#     class Meta:
#         model = ApplicantProfile
#         fields = [
#             "id",
#             "user",
#             "phone_number",
#             "description",
#             "skills",
#             "skill_ids",
#             "work_experiences",
#             "created_at",
#             "updated_at",
#         ]
#         read_only_fields = ["id", "user", "skills", "created_at", "updated_at"]
#         extra_kwargs = {
#             "phone_number": {"required": False, "allow_blank": True},
#             "description": {"required": False},
#         }
#
#     def create(self, validated_data):
#         user = self.context["request"].user
#         skill_ids = validated_data.pop("skill_ids", [])
#
#         if ApplicantProfile.objects.filter(user=user).exists():
#             raise serializers.ValidationError("Applicant profile already exists for this user.")
#
#         profile = ApplicantProfile.objects.create(user=user, **validated_data)
#         if skill_ids:
#             profile.skills.set(skill_ids)
#
#         return profile
#
#     def update(self, instance, validated_date):
#         skill_ids = validated_date.pop("skill_ids", [])
#
#         for attr, vallue in validated_date.items():
#             setattr(instance, attr, vallue)
#
#         instance.save()
#
#         if skill_ids is not None:
#             instance.skills.set(skill_ids)
#
#         return instance


class EmployerProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = EmployerProfile
        fields = [
            "id",
            "user",
            "phone_number",
            "company_name",
            "company_description",
        ]
        read_only_fields = ["id", "user"]
        extra_kwargs = {
            "phone_number": {"required": False, "allow_blank": True},
            "company_name": {"required": False, "allow_blank": True},
            "company_description": {"required": False},
        }

    def create(self, validated_data):
        user = self.context["request"].user

        if EmployerProfile.objects.filter(user=user).exists():
            raise serializers.ValidationError("Employer profile already exists for this user.")

        return EmployerProfile.objects.create(user=user, **validated_data)


class WorkExperienceSerializer(serializers.ModelSerializer):
    applicant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WorkExperience
        fields = [
            "id",
            "applicant",
            "company_name",
            "title",
            "start_date",
            "end_date",
            "description",
        ]
        read_only_fields = ["id", "applicant"]
        extra_kwargs = {
            "company_name": {"required": True, "allow_blank": False},
            "title": {"required": False, "allow_null": True},
            "start_date": {"required": True, "allow_null": False},
            "end_date": {"required": False, "allow_null": True},
            "description": {"required": False},
        }

    def create(self, validated_data):
        user = self.context["request"].user
        applicant = getattr(user, "applicant_profile", None)

        if not applicant:
            raise serializers.ValidationError("Applicant profile does not exist for this user.")

        return WorkExperience.objects.create(applicant=applicant, **validated_data)


