from rest_framework import permissions, viewsets

from apps.certifications.models import Certification
from apps.certifications.serializers import CertificationSerializer


class CertificationViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        is_staff = user and user.is_authenticated and user.is_staff

        qs = Certification.objects.prefetch_related(
            "related_skills",
            "related_technologies",
            "related_experiences__company",
            "related_projects",
        )

        if not is_staff:
            qs = qs.filter(is_published=True)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

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
