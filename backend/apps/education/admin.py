from django.contrib import admin

from apps.education.models import Education


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("institution", "degree", "field_of_study", "start_date", "end_date")
    search_fields = ("institution", "degree", "field_of_study")
    prepopulated_fields = {"slug": ("institution", "degree")}
