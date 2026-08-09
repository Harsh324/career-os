from django.contrib import admin

from .models import EventLog, VisitorSession


class EventInline(admin.TabularInline):
    model = EventLog
    extra = 0
    readonly_fields = ["event_type", "path", "event_target", "event_data", "created_at"]
    can_delete = False


@admin.register(VisitorSession)
class VisitorSessionAdmin(admin.ModelAdmin):
    list_display = [
        "session_key_short",
        "ref_code",
        "device_type",
        "browser",
        "os_name",
        "country",
        "page_view_count",
        "first_seen",
        "last_seen",
    ]
    list_filter = ["ref_code", "device_type", "browser", "country", "first_seen"]
    search_fields = ["session_key", "ref_code", "ip_hash", "referrer", "user_agent"]
    readonly_fields = [
        "id",
        "session_key",
        "ip_hash",
        "user_agent",
        "device_type",
        "browser",
        "os_name",
        "country",
        "referrer",
        "ref_code",
        "page_view_count",
        "first_seen",
        "last_seen",
    ]
    inlines = [EventInline]

    @admin.display(description="Session Key")
    def session_key_short(self, obj):
        return f"{obj.session_key[:12]}..."


@admin.register(EventLog)
class EventLogAdmin(admin.ModelAdmin):
    list_display = [
        "created_at",
        "event_type",
        "path",
        "event_target",
        "session_ref",
    ]
    list_filter = ["event_type", "path", "created_at"]
    search_fields = ["path", "event_target", "event_data", "session__ref_code"]
    readonly_fields = ["session", "event_type", "path", "event_target", "event_data", "created_at"]

    @admin.display(description="Recruiter Ref")
    def session_ref(self, obj):
        if obj.session and obj.session.ref_code:
            return f"🎯 {obj.session.ref_code}"
        return "-"
