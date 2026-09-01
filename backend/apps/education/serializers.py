from rest_framework import serializers

from apps.education.models import Education


class EducationSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Education
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        is_admin = bool(
            request
            and request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )

        if not is_admin:
            # Mask private career intelligence for non-staff / public visitors
            data.pop("internal_notes", None)
            data.pop("target_roles", None)

        return data
