from rest_framework import serializers

from apps.companies.serializers import CompanySerializer
from apps.experiences.models import Experience
from apps.projects.serializers import ProjectSerializer
from apps.technologies.serializers import TechnologySerializer


class ExperienceSerializer(serializers.ModelSerializer):
    company_detail = CompanySerializer(source="company", read_only=True)
    technologies_detail = TechnologySerializer(source="technologies", many=True, read_only=True)
    related_projects_detail = ProjectSerializer(
        source="related_projects", many=True, read_only=True
    )

    class Meta:
        model = Experience
        fields = "__all__"
