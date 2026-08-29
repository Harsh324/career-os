from rest_framework import permissions, viewsets

from apps.education.models import Education
from apps.education.serializers import EducationSerializer


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
