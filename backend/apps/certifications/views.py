from rest_framework import permissions, viewsets

from apps.certifications.models import Certification
from apps.certifications.serializers import CertificationSerializer


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all().prefetch_related("related_skills")
    serializer_class = CertificationSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
