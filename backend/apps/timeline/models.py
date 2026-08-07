from django.db import models

class TimelineEvent(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    date = models.CharField(max_length=50)  # e.g. "2023", "July 2023"
    category = models.CharField(max_length=100)  # e.g. "Education", "Career", "Certification"
    icon = models.CharField(max_length=50, default="Briefcase")  # Lucide icon name
    link = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-date"]

    def __str__(self):
        return f"{self.date} - {self.title}"
