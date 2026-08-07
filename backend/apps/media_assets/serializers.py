from rest_framework import serializers
from apps.media_assets.models import MediaAsset

class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = "__all__"

    def get_file_url(self, obj):
        request = self.context.get("request")
        if obj.file and hasattr(obj.file, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return ""
