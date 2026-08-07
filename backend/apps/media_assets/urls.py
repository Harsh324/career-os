from rest_framework.routers import DefaultRouter

from apps.media_assets.views import MediaAssetViewSet

router = DefaultRouter()
router.register(r"", MediaAssetViewSet, basename="mediaasset")

urlpatterns = router.urls
