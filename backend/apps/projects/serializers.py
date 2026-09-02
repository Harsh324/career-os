from rest_framework import serializers

from apps.projects.models import Project
from apps.technologies.models import Technology
from apps.technologies.serializers import TechnologySerializer


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack = serializers.PrimaryKeyRelatedField(
        queryset=Technology.objects.all(), many=True, required=False
    )
    tech_stack_detail = TechnologySerializer(source="tech_stack", many=True, read_only=True)
    slug = serializers.SlugField(required=False)

    class Meta:
        model = Project
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        is_admin = bool(
            request and request.user and request.user.is_authenticated and request.user.is_staff
        )

        if not is_admin:
            # Mask private career intelligence for non-staff / public visitors
            data.pop("internal_notes", None)
            data.pop("target_roles", None)

            # Filter highlights to only public ones
            if "highlights" in data and isinstance(data["highlights"], list):
                public_highlights = []
                for item in data["highlights"]:
                    if isinstance(item, dict):
                        if item.get("is_public", True):
                            public_highlights.append(item)
                    elif isinstance(item, str):
                        public_highlights.append(item)
                data["highlights"] = public_highlights

        return data
