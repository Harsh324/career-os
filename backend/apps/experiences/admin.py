from django.contrib import admin
from apps.experiences.models import Experience

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "employment_type", "start_date", "end_date", "current_position")
    list_filter = ("company", "employment_type", "current_position")
    search_fields = ("title", "summary", "mission")
    prepopulated_fields = {"slug": ("title", "company")}
