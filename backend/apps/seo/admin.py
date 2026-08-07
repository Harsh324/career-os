from django.contrib import admin

from apps.seo.models import SEOMetadata


@admin.register(SEOMetadata)
class SEOMetadataAdmin(admin.ModelAdmin):
    list_display = ("page_identifier", "title", "robots")
    search_fields = ("page_identifier", "title", "description")
