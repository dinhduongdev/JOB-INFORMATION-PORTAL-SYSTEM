from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from proxies.s3.avatars import list_user_avatar_keys

from .models import Role, User


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
