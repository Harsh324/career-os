from rest_framework.routers import DefaultRouter
from apps.experiences.views import ExperienceViewSet

router = DefaultRouter()
router.register(r"", ExperienceViewSet, basename="experience")

urlpatterns = router.urls
