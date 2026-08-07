from django.db import models
from apps.technologies.models import Technology

class Project(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    summary = models.TextField()
    description = models.TextField(blank=True)
    problem = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    architecture = models.TextField(blank=True)
    lessons_learned = models.JSONField(default=list, blank=True)
    tech_stack = models.ManyToManyField(Technology, related_name="projects", blank=True)
    status = models.CharField(max_length=50, default="active")
    repository = models.URLField(blank=True)
    demo = models.URLField(blank=True)
    screenshots = models.JSONField(default=list, blank=True)
    architecture_images = models.JSONField(default=list, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    roadmap = models.JSONField(default=list, blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-featured", "-created_at"]

    def __str__(self):
        return self.title
