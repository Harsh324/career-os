from django.db.models import Q
from rest_framework import permissions, viewsets

from apps.media_assets.models import MediaAsset
from apps.media_assets.serializers import MediaAssetSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff members to edit media assets.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class MediaAssetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing, retrieving, creating, updating, and deleting Media Assets.
    Enforces draft isolation for public users and rich filtering capabilities.
    """

    queryset = (
        MediaAsset.objects.prefetch_related(
            "related_projects",
            "related_experiences",
            "related_experiences__company",
            "related_certifications",
            "related_education",
            "related_skills",
        )
        .all()
        .distinct()
    )
    serializer_class = MediaAssetSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        is_staff = bool(user and user.is_staff)

        # 1. Draft Isolation for non-staff
        if not is_staff:
            qs = qs.filter(is_published=True)
        else:
            published_param = self.request.query_params.get("is_published")
            if published_param is not None:
                if published_param.lower() in ["true", "1"]:
                    qs = qs.filter(is_published=True)
                elif published_param.lower() in ["false", "0"]:
                    qs = qs.filter(is_published=False)

        # 2. Asset Type Filter
        asset_type = self.request.query_params.get("asset_type") or self.request.query_params.get(
            "type"
        )
        if asset_type and asset_type.lower() != "all":
            qs = qs.filter(asset_type=asset_type)

        # 3. Featured Filter
        featured = self.request.query_params.get("featured") or self.request.query_params.get(
            "is_featured"
        )
        if featured is not None:
            if featured.lower() in ["true", "1"]:
                qs = qs.filter(is_featured=True)
            elif featured.lower() in ["false", "0"]:
                qs = qs.filter(is_featured=False)

        # 4. Associated Entity Filter
        project_param = self.request.query_params.get("project")
        if project_param:
            if project_param.isdigit():
                qs = qs.filter(related_projects__id=int(project_param))
            else:
                qs = qs.filter(related_projects__slug=project_param)

        experience_param = self.request.query_params.get("experience")
        if experience_param:
            if experience_param.isdigit():
                qs = qs.filter(related_experiences__id=int(experience_param))
            else:
                qs = qs.filter(related_experiences__slug=experience_param)

        certification_param = self.request.query_params.get("certification")
        if certification_param:
            if certification_param.isdigit():
                qs = qs.filter(related_certifications__id=int(certification_param))
            else:
                qs = qs.filter(related_certifications__slug=certification_param)

        # 5. Search Query (Search by title, original_filename, alt_text, caption, description)
        search = self.request.query_params.get("search") or self.request.query_params.get("q")
        if search:
            search = search.strip()
            qs = qs.filter(
                Q(title__icontains=search)
                | Q(original_filename__icontains=search)
                | Q(alt_text__icontains=search)
                | Q(caption__icontains=search)
                | Q(description__icontains=search)
            )

        return qs
