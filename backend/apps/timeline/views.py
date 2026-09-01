from rest_framework import permissions, viewsets

from apps.timeline.models import TimelineEvent
from apps.timeline.serializers import TimelineEventSerializer


class TimelineEventViewSet(viewsets.ModelViewSet):
    serializer_class = TimelineEventSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        is_staff = user and user.is_authenticated and user.is_staff

        qs = TimelineEvent.objects.all()

        if not is_staff:
            qs = qs.filter(is_published=True)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        is_milestone = self.request.query_params.get("milestone")
        if is_milestone is not None:
            if is_milestone.lower() in ["true", "1"]:
                qs = qs.filter(is_milestone=True)
            elif is_milestone.lower() in ["false", "0"]:
                qs = qs.filter(is_milestone=False)

        is_published = self.request.query_params.get("published")
        if is_published is not None and is_staff:
            if is_published.lower() in ["true", "1"]:
                qs = qs.filter(is_published=True)
            elif is_published.lower() in ["false", "0"]:
                qs = qs.filter(is_published=False)

        return qs
