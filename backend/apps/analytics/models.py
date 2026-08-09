import uuid

from django.db import models


class VisitorSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session_key = models.CharField(max_length=64, db_index=True)
    ip_hash = models.CharField(max_length=64, blank=True, default="")
    user_agent = models.TextField(blank=True, default="")
    device_type = models.CharField(max_length=32, default="desktop", db_index=True)
    browser = models.CharField(max_length=64, blank=True, default="")
    os_name = models.CharField(max_length=64, blank=True, default="")
    country = models.CharField(max_length=64, blank=True, default="Unknown", db_index=True)
    referrer = models.TextField(blank=True, default="")
    ref_code = models.CharField(max_length=100, blank=True, default="", db_index=True)
    page_view_count = models.PositiveIntegerField(default=1)
    first_seen = models.DateTimeField(auto_now_add=True, db_index=True)
    last_seen = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-last_seen"]
        verbose_name = "Visitor Session"
        verbose_name_plural = "Visitor Sessions"

    def __str__(self):
        campaign = f" [{self.ref_code}]" if self.ref_code else ""
        return f"Session {self.session_key[:8]}{campaign} - {self.device_type} ({self.country})"


class EventLog(models.Model):
    EVENT_TYPE_CHOICES = [
        ("page_view", "Page View"),
        ("download_pdf", "Download PDF Resume"),
        ("export_json", "Export JSON Resume"),
        ("print_resume", "Print Web Resume"),
        ("select_role", "Target Role Filtered"),
        ("expand_arch", "Project Arch Expanded"),
        ("ask_ai", "AI Copilot Query"),
        ("verify_cert", "AWS Certification Verified"),
        ("custom", "Custom Interaction"),
    ]

    id = models.BigAutoField(primary_key=True)
    session = models.ForeignKey(
        VisitorSession,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="events",
    )
    event_type = models.CharField(
        max_length=32,
        choices=EVENT_TYPE_CHOICES,
        default="page_view",
        db_index=True,
    )
    path = models.CharField(max_length=255, default="/", db_index=True)
    event_target = models.CharField(max_length=255, blank=True, default="")
    event_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Telemetry Event"
        verbose_name_plural = "Telemetry Events"

    def __str__(self):
        return f"{self.get_event_type_display()} on {self.path} at {self.created_at.strftime('%H:%M:%S')}"
