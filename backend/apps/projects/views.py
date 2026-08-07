from rest_framework import viewsets, permissions
from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().prefetch_related("tech_stack")
    serializer_class = ProjectSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        featured = self.request.query_params.get("featured")
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() in ("true", "1"))
        return queryset
