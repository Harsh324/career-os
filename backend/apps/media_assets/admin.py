from django.contrib import admin

from apps.media_assets.models import MediaAsset


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "slug",
        "asset_type",
        "is_published",
        "is_featured",
        "file_size",
        "mime_type",
        "created_at",
    )
    list_filter = ("asset_type", "is_published", "is_featured")
    search_fields = ("title", "slug", "original_filename", "description", "alt_text")
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = (
        "related_projects",
        "related_experiences",
        "related_certifications",
        "related_education",
        "related_skills",
    )
