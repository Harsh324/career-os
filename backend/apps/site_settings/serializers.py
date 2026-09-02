from rest_framework import serializers

from apps.site_settings.models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for SiteSettings with context-aware field visibility and explicit validation.
    Anonymous public requests receive public presentation fields only.
    Authenticated staff/admin requests receive full career management fields (including target_roles).
    """

    class Meta:
        model = SiteSettings
        fields = [
            "id",
            "name",
            "title",
            "email",
            "location",
            "tagline",
            "summary",
            "engineering_focus",
            "open_to_work",
            "target_roles",
            "avatar_url",
            "resume_url",
            "github_url",
            "linkedin_url",
            "twitter_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "resume_url",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Professional name cannot be blank.")
        return value.strip()

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Professional title cannot be blank.")
        return value.strip()

    def validate_engineering_focus(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Engineering focus must be a list of strings.")
        cleaned = [str(item).strip() for item in value if str(item).strip()]
        return cleaned

    def validate_target_roles(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Target roles must be a list of strings.")
        cleaned = [str(item).strip() for item in value if str(item).strip()]
        return cleaned

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        # Hide private career preferences from anonymous public consumers
        is_admin = (
            request
            and hasattr(request, "user")
            and request.user.is_authenticated
            and request.user.is_staff
        )
        if not is_admin:
            data.pop("target_roles", None)
        return data
