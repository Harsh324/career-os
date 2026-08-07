from django.contrib import admin
from apps.projects.models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "featured", "repository", "created_at")
    list_filter = ("status", "featured")
    search_fields = ("title", "summary", "description")
    prepopulated_fields = {"slug": ("title",)}
