from django.db import models
from django.utils.text import slugify

from apps.companies.models import Company
from apps.projects.models import Project
from apps.technologies.models import Technology

MONTH_MAP = {
    "jan": "01",
    "feb": "02",
    "mar": "03",
    "apr": "04",
    "may": "05",
    "jun": "06",
    "jul": "07",
    "aug": "08",
    "sep": "09",
    "oct": "10",
    "nov": "11",
    "dec": "12",
}


def derive_start_year_month(start_date: str) -> str:
    """
    Derives canonical YYYY-MM string from human presentation string.
    Examples:
      'Oct 2024' -> '2024-10'
      'Jul 2023' -> '2023-07'
      '2024-10'  -> '2024-10'
      '2024'     -> '2024-01'
    """
    if not start_date:
        return ""
    clean = start_date.strip().lower().replace(",", "")
    parts = clean.split()
    if len(parts) == 1 and "-" in parts[0]:
        return parts[0]
    if len(parts) == 2:
        if parts[0][:3] in MONTH_MAP and parts[1].isdigit():
            month = MONTH_MAP[parts[0][:3]]
            year = parts[1]
            return f"{year}-{month}"
        elif parts[1][:3] in MONTH_MAP and parts[0].isdigit():
            month = MONTH_MAP[parts[1][:3]]
            year = parts[0]
            return f"{year}-{month}"
    elif len(parts) == 1 and parts[0].isdigit() and len(parts[0]) == 4:
        return f"{parts[0]}-01"
    return ""


class Experience(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ("full-time", "Full-time"),
        ("part-time", "Part-time"),
        ("internship", "Internship"),
        ("contract", "Contract"),
        ("freelance", "Freelance"),
    ]

    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT, related_name="experiences")
    employment_type = models.CharField(
        max_length=50, choices=EMPLOYMENT_TYPE_CHOICES, default="full-time"
    )
    location = models.CharField(max_length=255, blank=True)

    # Chronology & Status
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, default="Present", blank=True)
    start_year_month = models.CharField(max_length=7, blank=True, db_index=True)
    current_position = models.BooleanField(default=False, db_index=True)
    is_published = models.BooleanField(default=True, db_index=True)
    featured = models.BooleanField(default=True, db_index=True)

    # Public Narrative
    mission = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    executive_overview = models.TextField(blank=True)

    # Public / Private Structured Evidence & Accomplishments
    highlights = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    focus_areas = models.JSONField(default=list, blank=True)
    tech_groups = models.JSONField(default=dict, blank=True)
    challenges = models.JSONField(default=list, blank=True)  # List of {problem, solution, impact}
    metrics = models.JSONField(default=list, blank=True)  # List of {label, value}

    # Public Ownership & Scope
    team = models.CharField(max_length=255, blank=True)
    ownership = models.TextField(blank=True)
    lessons_learned = models.JSONField(default=list, blank=True)
    architecture_diagram = models.URLField(max_length=1024, blank=True)

    # Relational Associations
    technologies = models.ManyToManyField(Technology, related_name="experiences", blank=True)
    related_projects = models.ManyToManyField(Project, related_name="experiences", blank=True)

    # Private Career Intelligence
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-current_position", "-start_year_month", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.company.name}")
            slug = base_slug
            counter = 1
            while Experience.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # Derive start_year_month from start_date if not set or start_date changed
        derived_sym = derive_start_year_month(self.start_date)
        if derived_sym:
            self.start_year_month = derived_sym

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} at {self.company.name}"
