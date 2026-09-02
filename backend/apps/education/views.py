from rest_framework import permissions, viewsets

from apps.education.models import Education
from apps.education.serializers import EducationSerializer


class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        is_staff = user and user.is_authenticated and user.is_staff

        qs = Education.objects.all()

        if not is_staff:
            qs = qs.filter(is_published=True)

        is_featured = self.request.query_params.get("featured")
        if is_featured is not None:
            if is_featured.lower() in ["true", "1"]:
                qs = qs.filter(is_featured=True)
            elif is_featured.lower() in ["false", "0"]:
                qs = qs.filter(is_featured=False)

        is_published = self.request.query_params.get("published")
        if is_published is not None and is_staff:
            if is_published.lower() in ["true", "1"]:
                qs = qs.filter(is_published=True)
            elif is_published.lower() in ["false", "0"]:
                qs = qs.filter(is_published=False)

        return qs
