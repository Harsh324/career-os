from django.db import models
from django.utils.text import slugify

from apps.technologies.models import Technology


class Project(models.Model):
    PROJECT_TYPE_CHOICES = [
        ("application", "Application / Product"),
        ("infrastructure", "Infrastructure & Homelab"),
        ("platform", "Platform & Tooling"),
        ("open_source", "Open Source Library"),
        ("experiment", "Research & Experiment"),
    ]

    STATUS_CHOICES = [
        ("in_development", "In Development"),
        ("active", "Active"),
        ("deployed", "Deployed"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    project_type = models.CharField(
        max_length=50, choices=PROJECT_TYPE_CHOICES, default="application"
    )
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="active")
    is_published = models.BooleanField(default=True, db_index=True)
    featured = models.BooleanField(default=False, db_index=True)
    order = models.IntegerField(default=0)

    summary = models.TextField()
    description = models.TextField(blank=True)
    problem = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    technical_outcome = models.TextField(blank=True)
    architecture = models.TextField(blank=True)

    timeline = models.CharField(max_length=100, blank=True)
    repository = models.URLField(blank=True)
    demo = models.URLField(blank=True)
    docs_url = models.URLField(blank=True)

    tech_stack = models.ManyToManyField(Technology, related_name="projects", blank=True)
    architecture_flow = models.JSONField(default=list, blank=True)
    key_features = models.JSONField(default=list, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    screenshots = models.JSONField(default=list, blank=True)
    architecture_images = models.JSONField(default=list, blank=True)
    lessons_learned = models.JSONField(default=list, blank=True)
    roadmap = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-featured", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "project"
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
