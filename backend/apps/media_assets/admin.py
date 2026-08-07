from django.contrib import admin
from apps.media_assets.models import MediaAsset

@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = ("title", "media_type", "original_filename", "created_at")
    list_filter = ("media_type",)
    search_fields = ("title", "original_filename")
