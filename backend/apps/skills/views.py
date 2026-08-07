from rest_framework import viewsets, permissions
from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer

class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all().prefetch_related("technologies")
    serializer_class = SkillSerializer
    lookup_field = "slug"
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
