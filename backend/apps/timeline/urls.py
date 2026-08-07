from rest_framework.routers import DefaultRouter
from apps.timeline.views import TimelineEventViewSet

router = DefaultRouter()
router.register(r"", TimelineEventViewSet, basename="timeline")

urlpatterns = router.urls
