from django.db import models
from django.utils.text import slugify


class Company(models.Model):
    name = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=255, unique=True)
    logo = models.URLField(max_length=1024, blank=True)
    logo_file = models.ImageField(upload_to="companies/logos/", blank=True, null=True)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    careers = models.URLField(blank=True)
    industry = models.CharField(max_length=255, blank=True)
    company_size = models.CharField(max_length=100, blank=True)
    headquarters = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    founded = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Company.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
