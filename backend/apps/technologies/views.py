from rest_framework import permissions, viewsets

from apps.technologies.models import Technology
from apps.technologies.serializers import TechnologySerializer


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
