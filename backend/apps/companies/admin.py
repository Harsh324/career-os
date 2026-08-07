from django.contrib import admin

from apps.companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "industry", "headquarters", "company_size", "website")
    search_fields = ("name", "industry", "headquarters", "description")
    prepopulated_fields = {"slug": ("name",)}
