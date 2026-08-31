from rest_framework import permissions, viewsets

from apps.experiences.models import Experience
from apps.experiences.serializers import ExperienceSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = (
            Experience.objects.all()
            .select_related("company")
            .prefetch_related("technologies", "related_projects", "related_projects__tech_stack")
        )
        is_staff = bool(
            self.request.user
            and self.request.user.is_authenticated
            and self.request.user.is_staff
        )
        if not is_staff:
            queryset = queryset.filter(is_published=True)
        return queryset
