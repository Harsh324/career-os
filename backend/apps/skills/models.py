from django.db import models
from django.utils.text import slugify

from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.technologies.models import Technology


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("Backend Engineering", "Backend Engineering"),
        ("Cloud & Infrastructure", "Cloud & Infrastructure"),
        ("Architecture & Distributed Systems", "Architecture & Distributed Systems"),
        ("Databases & Caching", "Databases & Caching"),
        ("AI & Data", "AI & Data"),
        ("DevOps & CI/CD", "DevOps & CI/CD"),
        ("Supporting Technologies", "Supporting Technologies"),
    ]

    PROFICIENCY_CHOICES = [
        ("expert", "Expert / Staff Level"),
        ("advanced", "Advanced / Production Proficient"),
        ("proficient", "Proficient / Working Knowledge"),
        ("familiar", "Familiar / Basic"),
        ("learning", "Active Learning / Exploring"),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default="Backend Engineering")
    proficiency = models.CharField(max_length=50, choices=PROFICIENCY_CHOICES, default="advanced")
    years = models.DecimalField(max_digits=4, decimal_places=1, default=1.0)
    experience_level = models.CharField(max_length=50, default="Advanced", blank=True)
    is_core = models.BooleanField(default=False, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)
    order = models.IntegerField(default=0)

    # Narrative & Capability Scope
    description = models.TextField(blank=True)
    evidence_context = models.TextField(blank=True)

    # Relational Evidence Graph
    technologies = models.ManyToManyField(Technology, related_name="skills", blank=True)
    related_experiences = models.ManyToManyField(Experience, related_name="related_skills", blank=True)
    related_projects = models.ManyToManyField(Project, related_name="related_skills", blank=True)

    # Private Career Intelligence
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Skill.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        if not self.experience_level and self.proficiency:
            self.experience_level = self.get_proficiency_display()
        super().save(*args, **kwargs)
