from django.db import models

from apps.technologies.models import Technology


class Skill(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    years = models.IntegerField(default=1)
    experience_level = models.CharField(max_length=50, default="Advanced")
    technologies = models.ManyToManyField(Technology, related_name="skills", blank=True)
    order = models.IntegerField(default=0)
    is_core = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"
