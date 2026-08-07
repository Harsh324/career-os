from django.contrib import admin
from apps.skills.models import Skill

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "years", "experience_level", "order")
    list_filter = ("category", "experience_level")
    search_fields = ("name", "category", "description")
    prepopulated_fields = {"slug": ("name",)}
