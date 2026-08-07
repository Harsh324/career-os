from rest_framework.routers import DefaultRouter
from apps.blog.views import BlogPostViewSet

router = DefaultRouter()
router.register(r"", BlogPostViewSet, basename="blog")

urlpatterns = router.urls
