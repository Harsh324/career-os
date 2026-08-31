from rest_framework import permissions, viewsets

from apps.experiences.models import Experience
from apps.experiences.serializers import ExperienceSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = (
            Experience.objects.all()
            .select_related("company")
            .prefetch_related("technologies", "related_projects", "related_projects__tech_stack")
        )
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_published=True)
        return queryset
