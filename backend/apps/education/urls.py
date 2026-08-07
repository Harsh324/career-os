from rest_framework.routers import DefaultRouter

from apps.education.views import EducationViewSet

router = DefaultRouter()
router.register(r"", EducationViewSet, basename="education")

urlpatterns = router.urls
