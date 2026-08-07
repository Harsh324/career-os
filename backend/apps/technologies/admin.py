from django.contrib import admin

from apps.technologies.models import Technology


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "website")
    search_fields = ("name", "category", "description")
    prepopulated_fields = {"slug": ("name",)}
