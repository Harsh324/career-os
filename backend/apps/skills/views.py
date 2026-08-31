from rest_framework import permissions, viewsets

from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        is_staff = user and user.is_authenticated and user.is_staff

        qs = Skill.objects.prefetch_related(
            "technologies",
            "related_experiences__company",
            "related_projects",
            "certifications",
        )

        if not is_staff:
            qs = qs.filter(is_published=True)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category__iexact=category)

        is_core = self.request.query_params.get("is_core")
        if is_core is not None:
            if is_core.lower() in ["true", "1"]:
                qs = qs.filter(is_core=True)
            elif is_core.lower() in ["false", "0"]:
                qs = qs.filter(is_core=False)

        proficiency = self.request.query_params.get("proficiency")
        if proficiency:
            qs = qs.filter(proficiency__iexact=proficiency)

        return qs
