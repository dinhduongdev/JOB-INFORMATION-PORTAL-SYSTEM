from rest_framework import serializers
from django.conf import settings
from proxies.s3.document import generate_document_key, upload_document
from proxies.s3.settings import ALLOWED_DOCUMENT_EXTENSIONS, DOCUMENT_MAX_SIZE

from .models import CV


class CurrentApplicantProfile:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context["request"].user.applicant_profile

    def __repr__(self):
        return "%s()" % self.__class__.__name__


class CVSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=True)
    applicant = serializers.HiddenField(default=CurrentApplicantProfile())
    link = serializers.SerializerMethodField()

    class Meta:
        model = CV
        fields = ["id", "link", "applicant", "file", "uploaded_at"]

    def get_link(self, obj):
        return f'https://{settings.CLOUDFRONT_DOMAIN}/{obj.link}'

    def validate_file(self, value):
        if not value.name.endswith(ALLOWED_DOCUMENT_EXTENSIONS):
            raise serializers.ValidationError("Unsupported file type.")

        if value.size > DOCUMENT_MAX_SIZE:
            raise serializers.ValidationError(
                f"File size exceeds the maximum limit of {DOCUMENT_MAX_SIZE} bytes."
            )
        return value

    def create(self, validated_data):
        file = validated_data.pop("file")
        file_extension = file.name.split(".")[-1]
        key = generate_document_key(
            profile_id=validated_data["applicant"].id,
            file_extension=file_extension,
        )
        validated_data["link"] = key
        upload_document(
            key=key,
            file_content=file.read(),
        )
        return CV.objects.create(**validated_data)
