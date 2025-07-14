from rest_framework import serializers

from .models import User

class UserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar', 'role', 'is_active']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['full_name'] = f"{instance.first_name} {instance.last_name}"
        representation['role_display'] = instance.get_role_display()
        return representation

    def validate_password(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Password must be at least 3 characters long.")
        return value


class UserCreateSerializer(UserBaseSerializer):
    password = serializers.CharField(write_only=True, min_length=3)

    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields + ['password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }

    # def create(self, validated_data):
    #     user = User(
    #         email=validated_data['email'],
    #         first_name=validated_data.get('first_name', ''),
    #         last_name=validated_data.get('last_name', ''),
    #         avatar=validated_data.get('avatar', None),
    #         role=validated_data.get('role', User.Role.EMPLOYEE),
    #         is_active=validated_data.get('is_active', False)
    #     )
    #     user.set_password(validated_data['password'])
    #     user.save()
    #     return user
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(UserBaseSerializer):
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta(UserBaseSerializer.Meta):
        fields = UserBaseSerializer.Meta.fields + ['current_password', 'new_password', 'confirm_password']
        extra_kwargs = {
            'email': {'required': True, 'allow_blank': False},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'avatar': {'required': False, 'allow_blank': True},
            'role': {'required': False, 'allow_blank': True},
            'is_active': {'required': False, 'allow_null': True}
        }

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        current_password = self.initial_data.get("current_password")
        if value and not current_password:
            raise serializers.ValidationError("New password cannot be set without current password.")

        value = super().validate_password(value)
        return value

    def update(self, instance, validated_data):
        if 'new_password' in validated_data:
            new_password = validated_data.pop('new_password')
            instance.set_password(new_password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        return super().update(instance, validated_data)