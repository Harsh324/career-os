from rest_framework import permissions, viewsets

from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related("tech_stack")
    serializer_class = ProjectSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        queryset = Project.objects.all().prefetch_related("tech_stack")
        is_staff = bool(
            self.request.user
            and self.request.user.is_authenticated
            and self.request.user.is_staff
        )
        if not is_staff:
            queryset = queryset.filter(is_published=True)

        featured = self.request.query_params.get("featured")
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() in ("true", "1"))

        project_type = self.request.query_params.get("project_type")
        if project_type:
            queryset = queryset.filter(project_type=project_type)

        return queryset
