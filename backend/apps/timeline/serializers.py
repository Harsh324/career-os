from rest_framework import serializers

from apps.timeline.models import TimelineEvent


class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = "__all__"
