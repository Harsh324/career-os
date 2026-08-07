from rest_framework import serializers
from apps.skills.models import Skill
from apps.technologies.serializers import TechnologySerializer

class SkillSerializer(serializers.ModelSerializer):
    technologies_detail = TechnologySerializer(source="technologies", many=True, read_only=True)

    class Meta:
        model = Skill
        fields = "__all__"
