import uuid
import os
from django.db import models

def get_upload_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join("uploads", instance.media_type, filename)

class MediaAsset(models.Model):
    MEDIA_TYPES = (
        ("company_logo", "Company Logo"),
        ("screenshot", "Screenshot"),
        ("architecture_diagram", "Architecture Diagram"),
        ("resume", "Resume"),
        ("certificate", "Certificate"),
        ("profile_image", "Profile Image"),
        ("opengraph_image", "OpenGraph Image"),
        ("other", "Other Asset"),
    )

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=get_upload_path)
    media_type = models.CharField(max_length=50, choices=MEDIA_TYPES, default="other")
    original_filename = models.CharField(max_length=255, blank=True)
    file_size = models.IntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.media_type})"

    def save(self, *args, **kwargs):
        if self.file and not self.original_filename:
            self.original_filename = self.file.name
        super().save(*args, **kwargs)
