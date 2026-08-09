from rest_framework import serializers

from .models import EventLog, VisitorSession


class AnalyticsEventCreateSerializer(serializers.Serializer):
    session_key = serializers.CharField(max_length=64, required=True)
    event_type = serializers.CharField(max_length=32, default="page_view")
    path = serializers.CharField(max_length=255, default="/")
    event_target = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    event_data = serializers.JSONField(required=False, default=dict)
    referrer = serializers.CharField(required=False, allow_blank=True, default="")
    ref_code = serializers.CharField(required=False, allow_blank=True, default="")


class EventLogSerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(source="get_event_type_display", read_only=True)

    class Meta:
        model = EventLog
        fields = [
            "id",
            "session",
            "event_type",
            "event_type_display",
            "path",
            "event_target",
            "event_data",
            "created_at",
        ]


class VisitorSessionSerializer(serializers.ModelSerializer):
    events_count = serializers.IntegerField(source="events.count", read_only=True)

    class Meta:
        model = VisitorSession
        fields = [
            "id",
            "session_key",
            "ip_hash",
            "device_type",
            "browser",
            "os_name",
            "country",
            "referrer",
            "ref_code",
            "page_view_count",
            "events_count",
            "first_seen",
            "last_seen",
        ]
