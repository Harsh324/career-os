from rest_framework import serializers

from apps.timeline.models import TimelineEvent


class TimelineEntrySerializer(serializers.Serializer):
    """
    Serializer for projected timeline entries computed from canonical models
    (Experience, Education, Certification) and persisted manual milestones.
    """

    id = serializers.CharField()
    slug = serializers.CharField()
    source_type = serializers.CharField()
    source_id = serializers.IntegerField(required=False, allow_null=True)
    source_slug = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField()
    subtitle = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    date = serializers.CharField()
    date_sort = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField()
    icon = serializers.CharField()
    link = serializers.CharField(required=False, allow_blank=True)
    is_milestone = serializers.BooleanField(default=False)
    is_published = serializers.BooleanField(default=True)
    order = serializers.IntegerField(default=0)

    # Private Career Intelligence (Staff-Only)
    target_roles = serializers.ListField(
        child=serializers.CharField(), required=False, allow_empty=True
    )
    internal_notes = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.CharField(required=False, allow_null=True)
    updated_at = serializers.CharField(required=False, allow_null=True)


class TimelineEventSerializer(serializers.ModelSerializer):
    """
    ModelSerializer for persisted Manual Milestone (TimelineEvent) records.
    """

    slug = serializers.SlugField(required=False, allow_blank=True)
    source_type = serializers.SerializerMethodField()

    class Meta:
        model = TimelineEvent
        fields = "__all__"

    def get_source_type(self, obj) -> str:
        return "manual_milestone"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        is_admin = bool(
            request
            and request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )

        if not is_admin:
            # Mask private career intelligence for non-staff / public visitors
            data.pop("internal_notes", None)
            data.pop("target_roles", None)

        return data
