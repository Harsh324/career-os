from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.site_settings.models import SiteSettings
from apps.site_settings.serializers import SiteSettingsSerializer
from apps.skills.models import Skill


class SiteSettingsView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            settings_obj = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(settings_obj, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            settings_obj = SiteSettings.objects.create()
        serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JsonResumeView(APIView):
    """
    GET /api/v1/settings/json-resume/
    Exposes canonical portfolio data following the open JSON Resume Standard (https://jsonresume.org/).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = SiteSettings.objects.first()
        experiences = Experience.objects.select_related("company").prefetch_related("technologies").all()
        skills = Skill.objects.all()
        certs = Certification.objects.all()
        education = Education.objects.all()
        projects = Project.objects.prefetch_related("tech_stack").all()

        profiles = []
        if settings:
            if settings.github_url:
                github_user = settings.github_url.rstrip("/").split("/")[-1]
                profiles.append({"network": "GitHub", "username": github_user, "url": settings.github_url})
            if settings.linkedin_url:
                linkedin_user = settings.linkedin_url.rstrip("/").split("/")[-1]
                profiles.append({"network": "LinkedIn", "username": linkedin_user, "url": settings.linkedin_url})

        name = settings.name if settings else ""
        label = settings.title if settings else ""
        email = settings.email if settings else ""
        summary = settings.summary if settings else ""
        city = settings.location.split(",")[0].strip() if settings and settings.location else ""
        country_code = "JP" if "Japan" in (settings.location if settings else "") else ""

        json_resume = {
            "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
            "basics": {
                "name": name,
                "label": label,
                "email": email,
                "summary": summary,
                "location": {
                    "city": city,
                    "countryCode": country_code,
                },
                "profiles": profiles,
            },
            "work": [
                {
                    "name": exp.company.name if exp.company else "",
                    "position": exp.title,
                    "location": exp.location,
                    "startDate": str(exp.start_date),
                    "endDate": str(exp.end_date) if exp.end_date else "Present",
                    "summary": exp.summary,
                    "highlights": exp.highlights or [],
                }
                for exp in experiences
            ],
            "certificates": [
                {
                    "name": c.name,
                    "date": str(c.issue_date),
                    "issuer": c.issuer,
                    "url": c.credential_url or "",
                }
                for c in certs
            ],
            "education": [
                {
                    "institution": edu.institution,
                    "area": edu.field_of_study,
                    "studyType": edu.degree,
                    "startDate": str(edu.start_date),
                    "endDate": str(edu.end_date),
                    "score": edu.grade,
                }
                for edu in education
            ],
            "skills": [
                {
                    "name": s.name,
                    "level": s.experience_level,
                    "keywords": [s.category],
                }
                for s in skills
            ],
            "projects": [
                {
                    "name": p.title,
                    "description": p.summary,
                    "url": p.repository or "",
                    "keywords": [t.name for t in p.tech_stack.all()],
                }
                for p in projects
            ],
        }

        return Response(json_resume, status=status.HTTP_200_OK)
