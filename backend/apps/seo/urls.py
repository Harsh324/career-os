from rest_framework.routers import DefaultRouter
from apps.seo.views import SEOMetadataViewSet

router = DefaultRouter()
router.register(r"", SEOMetadataViewSet, basename="seo")

urlpatterns = router.urls
