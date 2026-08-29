from django.db import models

from apps.companies.models import Company
from apps.projects.models import Project
from apps.technologies.models import Technology


class Experience(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="experiences")
    employment_type = models.CharField(max_length=50, default="full-time")
    location = models.CharField(max_length=255, blank=True)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, default="present")
    current_position = models.BooleanField(default=False, db_index=True)
    featured = models.BooleanField(default=True, db_index=True)
    mission = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    executive_overview = models.TextField(blank=True)
    highlights = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    focus_areas = models.JSONField(default=list, blank=True)
    tech_groups = models.JSONField(default=dict, blank=True)
    challenges = models.JSONField(default=list, blank=True)  # List of {problem, solution, impact}
    metrics = models.JSONField(default=list, blank=True)  # List of {label, value}
    team = models.CharField(max_length=255, blank=True)
    ownership = models.TextField(blank=True)
    lessons_learned = models.JSONField(default=list, blank=True)
    architecture_diagram = models.URLField(max_length=1024, blank=True)
    technologies = models.ManyToManyField(Technology, related_name="experiences", blank=True)
    related_projects = models.ManyToManyField(Project, related_name="experiences", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.title} at {self.company.name}"
