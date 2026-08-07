from rest_framework import viewsets, permissions
from apps.media_assets.models import MediaAsset
from apps.media_assets.serializers import MediaAssetSerializer

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        media_type = self.request.query_params.get("type")
        if media_type:
            queryset = queryset.filter(media_type=media_type)
        return queryset
