from rest_framework.routers import DefaultRouter

from apps.skills.views import SkillViewSet

router = DefaultRouter()
router.register(r"", SkillViewSet, basename="skill")

urlpatterns = router.urls
