from rest_framework.routers import DefaultRouter
from apps.certifications.views import CertificationViewSet

router = DefaultRouter()
router.register(r"", CertificationViewSet, basename="certification")

urlpatterns = router.urls
