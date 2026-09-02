from django.db import models
from django.utils.text import slugify

from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.skills.models import Skill
from apps.technologies.models import Technology


class Certification(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    issuer = models.CharField(max_length=255)
    credential_id = models.CharField(max_length=255, blank=True)
    credential_url = models.URLField(blank=True)
    issue_date = models.CharField(max_length=50)
    expiry_date = models.CharField(max_length=50, blank=True)
    does_not_expire = models.BooleanField(default=False)
    verification_status = models.CharField(
        max_length=50,
        default="verified",
        choices=[
            ("verified", "Verified"),
            ("in_progress", "In Progress"),
            ("expired", "Expired"),
        ],
        blank=True,
    )
    category = models.CharField(max_length=100, default="Cloud & Infrastructure", blank=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    badge = models.URLField(max_length=1024, blank=True)
    badge_file = models.ImageField(upload_to="certifications/badges/", blank=True, null=True)

    # Connected Evidence Graph
    related_skills = models.ManyToManyField(Skill, related_name="certifications", blank=True)
    related_technologies = models.ManyToManyField(
        Technology, related_name="certifications", blank=True
    )
    related_experiences = models.ManyToManyField(
        Experience, related_name="certifications", blank=True
    )
    related_projects = models.ManyToManyField(Project, related_name="certifications", blank=True)

    # Private Career Intelligence (Staff-Only)
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-issue_date", "name"]

    def __str__(self):
        return f"{self.name} - {self.issuer}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "cert"
            slug = base_slug
            counter = 1
            while Certification.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
