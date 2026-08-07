from rest_framework import viewsets, permissions
from apps.seo.models import SEOMetadata
from apps.seo.serializers import SEOMetadataSerializer

class SEOMetadataViewSet(viewsets.ModelViewSet):
    queryset = SEOMetadata.objects.all()
    serializer_class = SEOMetadataSerializer
    lookup_field = "page_identifier"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
