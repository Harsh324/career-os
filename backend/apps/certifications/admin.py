from django.contrib import admin
from apps.certifications.models import Certification

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ("name", "issuer", "issue_date", "expiry_date", "credential_url")
    search_fields = ("name", "issuer")
    prepopulated_fields = {"slug": ("name",)}
