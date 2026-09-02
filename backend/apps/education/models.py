from django.db import models
from django.utils.text import slugify


class Education(models.Model):
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50)
    currently_studying = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    achievements = models.JSONField(default=list, blank=True)
    relevant_courses = models.JSONField(default=list, blank=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=True)
    order = models.IntegerField(default=0)

    # Private Career Intelligence (Staff-Only)
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Education Records"
        ordering = ["order", "-end_date", "institution"]

    def __str__(self):
        return f"{self.degree} at {self.institution}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.degree}-{self.institution}") or "edu"
            slug = base_slug
            counter = 1
            while Education.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)
