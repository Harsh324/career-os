from rest_framework import serializers

from apps.seo.models import SEOMetadata


class SEOMetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMetadata
        fields = "__all__"
