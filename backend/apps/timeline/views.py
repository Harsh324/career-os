from rest_framework import permissions, viewsets

from apps.timeline.models import TimelineEvent
from apps.timeline.serializers import TimelineEventSerializer


class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
