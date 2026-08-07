from rest_framework import serializers
from apps.blog.models import BlogPost
from apps.experiences.serializers import ExperienceSerializer
from apps.projects.serializers import ProjectSerializer

class BlogPostSerializer(serializers.ModelSerializer):
    related_projects_detail = ProjectSerializer(source="related_projects", many=True, read_only=True)
    related_experiences_detail = ExperienceSerializer(source="related_experiences", many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = "__all__"
