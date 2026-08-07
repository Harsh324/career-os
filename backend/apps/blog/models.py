from django.db import models

from apps.experiences.models import Experience
from apps.projects.models import Project


class BlogPost(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    summary = models.TextField()
    content = models.TextField()
    featured_image = models.URLField(max_length=1024, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="published")
    published_at = models.DateTimeField(null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    series = models.CharField(max_length=255, blank=True)
    related_projects = models.ManyToManyField(Project, related_name="blog_posts", blank=True)
    related_experiences = models.ManyToManyField(Experience, related_name="blog_posts", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title
