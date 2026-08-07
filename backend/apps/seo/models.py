from django.db import models

class SEOMetadata(models.Model):
    page_identifier = models.CharField(max_length=100, unique=True, help_text="e.g. 'home', 'experience', 'projects', 'skills'")
    title = models.CharField(max_length=255)
    description = models.TextField()
    keywords = models.JSONField(default=list, blank=True)
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.TextField(blank=True)
    og_image = models.URLField(max_length=1024, blank=True)
    twitter_card = models.CharField(max_length=50, default="summary_large_image")
    canonical_url = models.URLField(blank=True)
    robots = models.CharField(max_length=100, default="index, follow")
    structured_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SEO Metadata"
        verbose_name_plural = "SEO Metadata Records"

    def __str__(self):
        return f"SEO for {self.page_identifier}"
