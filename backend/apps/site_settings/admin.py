from django.contrib import admin
from apps.site_settings.models import SiteSettings

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("name", "title", "email", "location", "github_url")
