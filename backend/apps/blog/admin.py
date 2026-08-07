from django.contrib import admin
from apps.blog.models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "published_at", "series")
    list_filter = ("status", "series")
    search_fields = ("title", "summary", "content")
    prepopulated_fields = {"slug": ("title",)}
