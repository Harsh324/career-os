from django.db import models

class SiteSettings(models.Model):
    name = models.CharField(max_length=255, default="Harsh Tripathi")
    title = models.CharField(max_length=255, default="Backend & Cloud Engineer")
    email = models.EmailField(default="tripathiharsh324@gmail.com")
    location = models.CharField(max_length=255, default="India")
    tagline = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    avatar_url = models.URLField(max_length=1024, blank=True)
    resume_url = models.URLField(max_length=1024, blank=True)
    resume_file = models.FileField(upload_to="resumes/", blank=True, null=True)
    github_url = models.URLField(default="https://github.com/Harsh324")
    linkedin_url = models.URLField(default="https://linkedin.com/in/harsh324")
    twitter_url = models.URLField(default="https://x.com/harsh324")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return f"Portfolio Config - {self.name}"
