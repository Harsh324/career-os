from django.contrib import admin

from apps.timeline.models import TimelineEvent


@admin.register(TimelineEvent)
class TimelineEventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "category", "icon", "order")
    list_filter = ("category",)
    search_fields = ("title", "subtitle", "description")
    prepopulated_fields = {"slug": ("title",)}
