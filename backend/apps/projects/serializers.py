from rest_framework import serializers

from apps.projects.models import Project
from apps.technologies.serializers import TechnologySerializer


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack_detail = TechnologySerializer(source="tech_stack", many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"
