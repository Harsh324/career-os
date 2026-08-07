from django.urls import path
from apps.site_settings.views import SiteSettingsView, JsonResumeView

urlpatterns = [
    path("", SiteSettingsView.as_view(), name="site_settings"),
    path("json-resume/", JsonResumeView.as_view(), name="json_resume"),
]
