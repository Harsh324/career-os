from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

api_v1_patterns = [
    path("auth/", include("apps.accounts.urls")),
    path("companies/", include("apps.companies.urls")),
    path("technologies/", include("apps.technologies.urls")),
    path("skills/", include("apps.skills.urls")),
    path("projects/", include("apps.projects.urls")),
    path("experience/", include("apps.experiences.urls")),
    path("blog/", include("apps.blog.urls")),
    path("timeline/", include("apps.timeline.urls")),
    path("education/", include("apps.education.urls")),
    path("certifications/", include("apps.certifications.urls")),
    path("media/", include("apps.media_assets.urls")),
    path("seo/", include("apps.seo.urls")),
    path("settings/", include("apps.site_settings.urls")),
    path("assistant/", include("apps.ai_assistant.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    # API v1
    path("api/v1/", include((api_v1_patterns, "v1"))),
    # OpenAPI / Swagger Docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
