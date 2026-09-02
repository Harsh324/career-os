import json

from rest_framework import serializers

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.media_assets.models import MediaAsset
from apps.projects.models import Project
from apps.skills.models import Skill


class MediaProjectSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "slug", "project_type", "status"]


class MediaExperienceSummarySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True, default="")

    class Meta:
        model = Experience
        fields = [
            "id",
            "title",
            "slug",
            "company_name",
            "start_date",
            "end_date",
            "current_position",
        ]


class MediaCertificationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ["id", "name", "slug", "issuer", "issue_date"]


class MediaEducationSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "institution", "degree", "slug"]


class MediaSkillSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "slug", "category"]


class MediaAssetSerializer(serializers.ModelSerializer):
    """
    Canonical Serializer for Media Assets.
    Includes computed URLs, dimensions, nested entity summaries,
    and automatic staff-only field masking.
    """

    slug = serializers.SlugField(required=False, allow_blank=True)
    file_url = serializers.SerializerMethodField()
    is_image = serializers.BooleanField(read_only=True)
    is_document = serializers.BooleanField(read_only=True)

    # Primary key related fields for write operations
    related_projects = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), many=True, required=False
    )
    related_experiences = serializers.PrimaryKeyRelatedField(
        queryset=Experience.objects.all(), many=True, required=False
    )
    related_certifications = serializers.PrimaryKeyRelatedField(
        queryset=Certification.objects.all(), many=True, required=False
    )
    related_education = serializers.PrimaryKeyRelatedField(
        queryset=Education.objects.all(), many=True, required=False
    )
    related_skills = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), many=True, required=False
    )

    # Nested read-only relationship summaries
    related_projects_detail = MediaProjectSummarySerializer(
        source="related_projects", many=True, read_only=True
    )
    related_experiences_detail = MediaExperienceSummarySerializer(
        source="related_experiences", many=True, read_only=True
    )
    related_certifications_detail = MediaCertificationSummarySerializer(
        source="related_certifications", many=True, read_only=True
    )
    related_education_detail = MediaEducationSummarySerializer(
        source="related_education", many=True, read_only=True
    )
    related_skills_detail = MediaSkillSummarySerializer(
        source="related_skills", many=True, read_only=True
    )

    class Meta:
        model = MediaAsset
        fields = [
            "id",
            "title",
            "slug",
            "asset_type",
            "file",
            "file_url",
            "external_url",
            "original_filename",
            "mime_type",
            "file_size",
            "width",
            "height",
            "is_image",
            "is_document",
            "alt_text",
            "caption",
            "description",
            "tags",
            "is_published",
            "is_featured",
            "display_order",
            "related_projects",
            "related_projects_detail",
            "related_experiences",
            "related_experiences_detail",
            "related_certifications",
            "related_certifications_detail",
            "related_education",
            "related_education_detail",
            "related_skills",
            "related_skills_detail",
            "target_roles",
            "internal_notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "file_size",
            "width",
            "height",
            "mime_type",
            "original_filename",
        ]

    def to_internal_value(self, data):
        # Handle QueryDict from multipart form data
        if hasattr(data, "getlist"):
            mutable_data = {}
            for key in data.keys():
                if key in [
                    "related_projects",
                    "related_experiences",
                    "related_certifications",
                    "related_education",
                    "related_skills",
                ]:
                    items = data.getlist(key)
                    if (
                        len(items) == 1
                        and isinstance(items[0], str)
                        and items[0].startswith("[")
                    ):
                        try:
                            mutable_data[key] = json.loads(items[0])
                        except Exception:
                            mutable_data[key] = items
                    else:
                        mutable_data[key] = items
                elif key in ["tags", "target_roles"]:
                    items = data.getlist(key)
                    if (
                        len(items) == 1
                        and isinstance(items[0], str)
                        and items[0].startswith("[")
                    ):
                        try:
                            mutable_data[key] = json.loads(items[0])
                        except Exception:
                            mutable_data[key] = items
                    else:
                        mutable_data[key] = items
                else:
                    mutable_data[key] = data.get(key)
            return super().to_internal_value(mutable_data)

        # Standard dict handling
        mutable_data = data.copy() if hasattr(data, "copy") else dict(data)
        for field_name in [
            "tags",
            "target_roles",
            "related_projects",
            "related_experiences",
            "related_certifications",
            "related_education",
            "related_skills",
        ]:
            val = mutable_data.get(field_name)
            if isinstance(val, str):
                val = val.strip()
                if val.startswith("[") and val.endswith("]"):
                    try:
                        mutable_data[field_name] = json.loads(val)
                    except Exception:
                        pass
        return super().to_internal_value(mutable_data)

    def get_file_url(self, obj: MediaAsset) -> str:
        request = self.context.get("request")
        if obj.file and hasattr(obj.file, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        if obj.external_url:
            return obj.external_url
        return ""

    def to_representation(self, instance: MediaAsset):
        ret = super().to_representation(instance)
        request = self.context.get("request")
        is_staff = bool(request and request.user and request.user.is_staff)

        # Dynamic private intelligence field masking for non-staff
        if not is_staff:
            ret.pop("target_roles", None)
            ret.pop("internal_notes", None)

        return ret
