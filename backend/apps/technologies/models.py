from django.db import models

class Technology(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    logo = models.URLField(max_length=1024, blank=True)
    logo_file = models.ImageField(upload_to="technologies/logos/", blank=True, null=True)
    website = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Technologies"
        ordering = ["name"]

    def __str__(self):
        return self.name
