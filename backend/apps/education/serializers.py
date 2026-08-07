from rest_framework import serializers

from apps.education.models import Education


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"
