from rest_framework import permissions, viewsets

from apps.experiences.models import Experience
from apps.experiences.serializers import ExperienceSerializer


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Experience.objects.all()
        .select_related("company")
        .prefetch_related("technologies", "related_projects", "related_projects__tech_stack")
    )
    serializer_class = ExperienceSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
