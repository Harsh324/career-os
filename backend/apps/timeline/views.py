from django.http import Http404
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from apps.timeline.models import TimelineEvent
from apps.timeline.projection import build_timeline_projection
from apps.timeline.serializers import TimelineEntrySerializer, TimelineEventSerializer


class TimelineEventViewSet(viewsets.ModelViewSet):
    serializer_class = TimelineEventSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        is_staff = bool(user and user.is_authenticated and user.is_staff)
        qs = TimelineEvent.objects.all()
        if not is_staff:
            qs = qs.filter(is_published=True)
        return qs

    def list(self, request, *args, **kwargs):
        user = request.user
        is_staff = bool(user and user.is_authenticated and user.is_staff)

        category = request.query_params.get("category")
        source_type = request.query_params.get("source_type")

        milestone_param = request.query_params.get("milestone")
        is_milestone = None
        if milestone_param is not None:
            if milestone_param.lower() in ["true", "1"]:
                is_milestone = True
            elif milestone_param.lower() in ["false", "0"]:
                is_milestone = False

        published_param = request.query_params.get("published")
        published = None
        if is_staff and published_param is not None:
            if published_param.lower() in ["true", "1"]:
                published = True
            elif published_param.lower() in ["false", "0"]:
                published = False

        projected = build_timeline_projection(
            is_staff=is_staff,
            category=category,
            is_milestone=is_milestone,
            source_type=source_type,
            published=published,
        )

        serializer = TimelineEntrySerializer(projected, many=True, context={"request": request})
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        user = request.user
        is_staff = bool(user and user.is_authenticated and user.is_staff)

        # 1. Try to fetch from persisted Manual Milestones (TimelineEvent)
        try:
            instance = TimelineEvent.objects.get(slug=slug)
            if not is_staff and not instance.is_published:
                raise Http404("Timeline event not found.")
            serializer = TimelineEventSerializer(instance, context={"request": request})
            return Response(serializer.data)
        except TimelineEvent.DoesNotExist:
            pass

        # 2. Try to resolve from projected timeline
        projected = build_timeline_projection(is_staff=is_staff)
        matching = next(
            (
                item
                for item in projected
                if item["slug"] == slug
                or item.get("source_slug") == slug
                or item.get("id") == slug
            ),
            None,
        )

        if matching:
            serializer = TimelineEntrySerializer(matching, context={"request": request})
            return Response(serializer.data)

        raise Http404("Timeline entry not found.")

    def update(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        if not TimelineEvent.objects.filter(slug=slug).exists():
            return Response(
                {
                    "error": (
                        "Derived timeline entries are read-only projections. "
                        "To modify this item, edit its canonical source directly."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        if not TimelineEvent.objects.filter(slug=slug).exists():
            return Response(
                {
                    "error": (
                        "Derived timeline entries are read-only projections. "
                        "To modify this item, edit its canonical source directly."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        slug = kwargs.get("slug")
        if not TimelineEvent.objects.filter(slug=slug).exists():
            return Response(
                {
                    "error": (
                        "Derived timeline entries are read-only projections. "
                        "To delete this item, remove or unpublish its canonical source record."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)
