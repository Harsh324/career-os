from django.db import models
from django.utils.text import slugify


class TimelineEvent(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    date = models.CharField(max_length=50)  # e.g. "Dec 2020", "Jul 2023 – May 2024"
    category = models.CharField(
        max_length=100, default="Career"
    )  # Education, Career, Certification, Milestone
    icon = models.CharField(max_length=50, default="Briefcase")  # Lucide icon name
    link = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    is_milestone = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    # Private Career Intelligence (Staff-Only)
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-date", "title"]

    def __str__(self):
        return f"{self.date} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "timeline-event"
            slug = base_slug
            counter = 1
            while TimelineEvent.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
