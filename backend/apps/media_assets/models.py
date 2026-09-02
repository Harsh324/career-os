import mimetypes
import os
import uuid

from django.db import models
from django.utils.text import slugify
from PIL import Image

from apps.certifications.models import Certification
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.skills.models import Skill


def get_media_upload_path(instance, filename: str) -> str:
    """
    Generates a deterministic and collision-safe upload path for media assets:
    uploads/{asset_type}/{slug}_{uuid8}.{ext}
    """
    ext = filename.split(".")[-1].lower() if "." in filename else "bin"
    slug_part = instance.slug or slugify(instance.title) or "asset"
    unique_id = uuid.uuid4().hex[:8]
    asset_folder = instance.asset_type or "other"
    return os.path.join("uploads", asset_folder, f"{slug_part}_{unique_id}.{ext}")


# Backward compatibility alias for 0001_initial migration
get_upload_path = get_media_upload_path


class MediaAsset(models.Model):
    """
    Canonical Media Asset representation in PostgreSQL.
    Manages visual, document, and media metadata linked to Career OS entities.
    """

    ASSET_TYPE_CHOICES = [
        ("profile", "Profile Image / Avatar"),
        ("project_image", "Project Screenshot / Visual"),
        ("project_logo", "Project Logo / Icon"),
        ("architecture_diagram", "Architecture / System Diagram"),
        ("certification", "Certification Badge / Credential"),
        ("education", "Education / Degree / Diploma"),
        ("company_logo", "Company Logo"),
        ("resume", "Resume / CV Document"),
        ("document", "Technical Document / Whitepaper"),
        ("social_preview", "Social Preview / OpenGraph Card"),
        ("other", "Other Asset"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    asset_type = models.CharField(
        max_length=50,
        choices=ASSET_TYPE_CHOICES,
        default="project_image",
        db_index=True,
    )

    file = models.FileField(upload_to=get_media_upload_path, blank=True, null=True)
    external_url = models.URLField(max_length=1024, blank=True)
    original_filename = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=100, blank=True)
    file_size = models.BigIntegerField(default=0)
    width = models.PositiveIntegerField(null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)

    # Accessibility & Presentation Metadata
    alt_text = models.CharField(
        max_length=500,
        blank=True,
        help_text="Descriptive alternative text for accessibility (required for public images).",
    )
    caption = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)

    # Publication & Ordering
    is_published = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    display_order = models.IntegerField(default=0)

    # Canonical Entity Associations
    related_projects = models.ManyToManyField(
        Project,
        related_name="media_assets",
        blank=True,
    )
    related_experiences = models.ManyToManyField(
        Experience,
        related_name="media_assets",
        blank=True,
    )
    related_certifications = models.ManyToManyField(
        Certification,
        related_name="media_assets",
        blank=True,
    )
    related_education = models.ManyToManyField(
        Education,
        related_name="media_assets",
        blank=True,
    )
    related_skills = models.ManyToManyField(
        Skill,
        related_name="media_assets",
        blank=True,
    )

    # Staff-only Career Intelligence
    target_roles = models.JSONField(default=list, blank=True)
    internal_notes = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-is_featured", "-created_at"]
        verbose_name = "Media Asset"
        verbose_name_plural = "Media Assets"

    def __str__(self) -> str:
        return f"{self.title} ({self.get_asset_type_display()})"

    @property
    def is_image(self) -> bool:
        if self.mime_type and self.mime_type.startswith("image/"):
            return True
        if self.original_filename:
            return self.original_filename.lower().endswith(
                (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif")
            )
        return False

    @property
    def is_document(self) -> bool:
        if self.mime_type and (
            self.mime_type.startswith("application/pdf")
            or "word" in self.mime_type
            or "text" in self.mime_type
        ):
            return True
        if self.original_filename:
            return self.original_filename.lower().endswith((".pdf", ".doc", ".docx", ".txt", ".md"))
        return self.asset_type in ["resume", "document", "education"]

    def save(self, *args, **kwargs):
        # 1. Deterministic Slug Generation
        if not self.slug:
            base_slug = slugify(self.title) or "media-asset"
            slug = base_slug
            counter = 1
            while MediaAsset.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        # 2. Extract File Metadata
        if self.file:
            if not self.original_filename:
                self.original_filename = os.path.basename(self.file.name)

            try:
                if hasattr(self.file, "size") and self.file.size:
                    self.file_size = self.file.size
            except Exception:
                pass

            if not self.mime_type:
                guessed_type, _ = mimetypes.guess_type(self.original_filename or self.file.name)
                if guessed_type:
                    self.mime_type = guessed_type

            # Extract image dimensions safely using Pillow
            if (
                self.mime_type.startswith("image/")
                or (
                    self.original_filename
                    and self.original_filename.lower().endswith(
                        (".png", ".jpg", ".jpeg", ".webp", ".gif")
                    )
                )
            ) and not (self.original_filename and self.original_filename.lower().endswith(".svg")):
                try:
                    self.file.seek(0)
                    with Image.open(self.file) as img:
                        self.width, self.height = img.size
                        if not self.mime_type and hasattr(img, "format") and img.format:
                            self.mime_type = Image.MIME.get(img.format, "image/png")
                    self.file.seek(0)
                except Exception:
                    pass

        super().save(*args, **kwargs)
