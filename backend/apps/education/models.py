from django.db import models

class Education(models.Model):
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    location = models.CharField(max_length=255, blank=True)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50)
    grade = models.CharField(max_length=50, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    relevant_courses = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Education Records"
        ordering = ["-end_date"]

    def __str__(self):
        return f"{self.degree} at {self.institution}"
