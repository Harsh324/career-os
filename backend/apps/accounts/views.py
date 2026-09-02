from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.serializers import UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """Obtain JWT access and refresh token pair."""


class CustomTokenRefreshView(TokenRefreshView):
    """Refresh JWT access token."""


class MeView(APIView):
    """Return currently authenticated user info."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """Acknowledge logout and invalidate client session."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class DashboardOverviewStatsView(APIView):
    """Return authoritative career data counts and system status for the dashboard overview."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.certifications.models import Certification
        from apps.education.models import Education
        from apps.experiences.models import Experience
        from apps.media_assets.models import MediaAsset
        from apps.projects.models import Project
        from apps.site_settings.models import SiteSettings
        from apps.skills.models import Skill
        from apps.timeline.models import TimelineEvent

        settings_obj = SiteSettings.objects.first()

        data = {
            "system_status": "operational",
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "is_staff": request.user.is_staff,
                "is_superuser": request.user.is_superuser,
            },
            "counts": {
                "experiences": Experience.objects.count(),
                "projects": Project.objects.count(),
                "featured_projects": Project.objects.filter(featured=True).count(),
                "skills": Skill.objects.count(),
                "certifications": Certification.objects.count(),
                "education": Education.objects.count(),
                "timeline_events": TimelineEvent.objects.count(),
                "media_assets": MediaAsset.objects.count(),
            },
            "site_settings": {
                "name": settings_obj.name if settings_obj else "Harsh Tripathi",
                "title": settings_obj.title if settings_obj else "Backend & Cloud Engineer",
                "location": settings_obj.location if settings_obj else "",
                "updated_at": (
                    settings_obj.updated_at.isoformat()
                    if settings_obj and getattr(settings_obj, "updated_at", None)
                    else None
                ),
            },
        }
        return Response(data, status=status.HTTP_200_OK)
