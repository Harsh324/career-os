from rest_framework.routers import DefaultRouter
from apps.technologies.views import TechnologyViewSet

router = DefaultRouter()
router.register(r"", TechnologyViewSet, basename="technology")

urlpatterns = router.urls
