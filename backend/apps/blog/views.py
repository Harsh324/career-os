from rest_framework import viewsets, permissions
from apps.blog.models import BlogPost
from apps.blog.serializers import BlogPostSerializer

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all().prefetch_related("related_projects", "related_experiences")
    serializer_class = BlogPostSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(status="published")
        return queryset
