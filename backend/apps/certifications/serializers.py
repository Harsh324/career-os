from rest_framework import serializers
from apps.certifications.models import Certification
from apps.skills.serializers import SkillSerializer

class CertificationSerializer(serializers.ModelSerializer):
    related_skills_detail = SkillSerializer(source="related_skills", many=True, read_only=True)

    class Meta:
        model = Certification
        fields = "__all__"
