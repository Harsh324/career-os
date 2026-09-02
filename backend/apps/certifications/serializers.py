from rest_framework import serializers

from apps.certifications.models import Certification
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer
from apps.technologies.models import Technology
from apps.technologies.serializers import TechnologySerializer


class CertificationSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    # Primary key related fields for write operations
    related_skills = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), many=True, required=False
    )
    related_technologies = serializers.PrimaryKeyRelatedField(
        queryset=Technology.objects.all(), many=True, required=False
    )
    related_experiences = serializers.PrimaryKeyRelatedField(
        queryset=Experience.objects.all(), many=True, required=False
    )
    related_projects = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(), many=True, required=False
    )

    # Rich nested detail fields for presentation
    related_skills_detail = SkillSerializer(source="related_skills", many=True, read_only=True)
    related_technologies_detail = TechnologySerializer(
        source="related_technologies", many=True, read_only=True
    )
    related_experiences_detail = serializers.SerializerMethodField()
    related_projects_detail = serializers.SerializerMethodField()

    class Meta:
        model = Certification
        fields = "__all__"

    def get_related_experiences_detail(self, obj):
        return [
            {
                "id": exp.id,
                "title": exp.title,
                "company_name": exp.company.name if exp.company else "",
                "start_date": exp.start_date,
                "end_date": exp.end_date,
                "current_position": exp.current_position,
                "slug": exp.slug,
            }
            for exp in obj.related_experiences.all()
        ]

    def get_related_projects_detail(self, obj):
        return [
            {
                "id": proj.id,
                "title": proj.title,
                "slug": proj.slug,
                "project_type": getattr(proj, "project_type", "application"),
                "status": proj.status,
            }
            for proj in obj.related_projects.all()
        ]

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

        return data
