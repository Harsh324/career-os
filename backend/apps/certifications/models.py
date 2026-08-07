from django.db import models

from apps.skills.models import Skill


class Certification(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    issuer = models.CharField(max_length=255)
    credential_url = models.URLField(blank=True)
    issue_date = models.CharField(max_length=50)
    expiry_date = models.CharField(max_length=50, blank=True)
    badge = models.URLField(max_length=1024, blank=True)
    badge_file = models.ImageField(upload_to="certifications/badges/", blank=True, null=True)
    related_skills = models.ManyToManyField(Skill, related_name="certifications", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return f"{self.name} - {self.issuer}"
