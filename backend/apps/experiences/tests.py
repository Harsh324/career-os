from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.companies.models import Company
from apps.experiences.models import Experience, derive_start_year_month
from apps.technologies.models import Technology

User = get_user_model()


class ExperienceModelTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(
            name="SMS DataTech",
            slug="sms-datatech",
            description="Leading cloud and backend engineering solutions.",
        )

    def test_derive_start_year_month(self):
        self.assertEqual(derive_start_year_month("Oct 2024"), "2024-10")
        self.assertEqual(derive_start_year_month("October 2024"), "2024-10")
        self.assertEqual(derive_start_year_month("Jul 2023"), "2023-07")
        self.assertEqual(derive_start_year_month("2024-10"), "2024-10")
        self.assertEqual(derive_start_year_month("2024"), "2024-01")
        self.assertEqual(derive_start_year_month(""), "")

    def test_experience_chronological_ordering(self):
        # Create earlier internship
        exp_intern = Experience.objects.create(
            title="Software Engineer Intern",
            company=self.company,
            start_date="Jul 2023",
            end_date="May 2024",
            current_position=False,
        )
        # Create full-time past role
        exp_past = Experience.objects.create(
            title="Junior Backend Engineer",
            company=self.company,
            start_date="Jun 2024",
            end_date="Sep 2024",
            current_position=False,
        )
        # Create current role
        exp_current = Experience.objects.create(
            title="Software Engineer (Backend and Cloud)",
            company=self.company,
            start_date="Oct 2024",
            end_date="Present",
            current_position=True,
        )

        experiences = list(Experience.objects.all())
        self.assertEqual(experiences[0].id, exp_current.id)
        self.assertEqual(experiences[1].id, exp_past.id)
        self.assertEqual(experiences[2].id, exp_intern.id)


class ExperienceAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="admin", email="admin@career-os.dev", password="adminpassword123"
        )
        self.non_staff_user = User.objects.create_user(
            username="visitor",
            email="visitor@example.com",
            password="visitorpassword123",
            is_staff=False,
        )
        self.company = Company.objects.create(
            name="SMS DataTech",
            slug="sms-datatech",
            description="Leading cloud and backend engineering solutions.",
        )
        self.tech_python = Technology.objects.create(
            name="Python", slug="python", category="Languages"
        )
        self.tech_django = Technology.objects.create(
            name="Django", slug="django", category="Backend"
        )

        self.published_exp = Experience.objects.create(
            title="Software Engineer (Backend and Cloud)",
            company=self.company,
            start_date="Oct 2024",
            end_date="Present",
            current_position=True,
            is_published=True,
            summary="Building scalable backend systems.",
            highlights=[
                {
                    "id": "ach-1",
                    "text": "Public contribution bullet",
                    "is_public": True,
                    "target_roles": ["Backend Engineering"],
                    "order": 0,
                },
                {
                    "id": "ach-2",
                    "text": "Private internal bullet",
                    "is_public": False,
                    "target_roles": ["Backend Engineering"],
                    "order": 1,
                },
            ],
            target_roles=["Backend Engineering", "Cloud Architecture"],
            internal_notes="Private interview stories and architectural trade-offs.",
        )
        self.published_exp.technologies.add(self.tech_python, self.tech_django)

        self.draft_exp = Experience.objects.create(
            title="Unpublished Draft Experience",
            company=self.company,
            start_date="Jan 2023",
            end_date="Jun 2023",
            current_position=False,
            is_published=False,
            summary="Draft role not meant for public view.",
        )

    def test_anonymous_user_cannot_view_draft_experiences(self):
        response = self.client.get("/api/v1/experience/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [item["slug"] for item in results]
        self.assertIn(self.published_exp.slug, slugs)
        self.assertNotIn(self.draft_exp.slug, slugs)

    def test_anonymous_user_public_data_masking(self):
        response = self.client.get(f"/api/v1/experience/{self.published_exp.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Private fields must be stripped for anonymous visitors
        self.assertNotIn("internal_notes", response.data)
        self.assertNotIn("target_roles", response.data)

        # Non-public highlights must be filtered out
        highlights = response.data.get("highlights", [])
        self.assertEqual(len(highlights), 1)
        self.assertEqual(highlights[0]["text"], "Public contribution bullet")

    def test_authenticated_non_staff_user_cannot_mutate_experience(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # Non-staff POST -> 403 Forbidden
        payload = {
            "title": "Unauthorized Role",
            "company": self.company.id,
            "start_date": "Jan 2025",
        }
        res_post = self.client.post("/api/v1/experience/", payload, format="json")
        self.assertEqual(res_post.status_code, status.HTTP_403_FORBIDDEN)

        # Non-staff PATCH -> 403 Forbidden
        res_patch = self.client.patch(
            f"/api/v1/experience/{self.published_exp.slug}/",
            {"title": "Hacked Title"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_403_FORBIDDEN)

        # Non-staff DELETE -> 403 Forbidden
        res_delete = self.client.delete(f"/api/v1/experience/{self.published_exp.slug}/")
        self.assertEqual(res_delete.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_user_cannot_mutate_company(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # Non-staff company POST -> 403 Forbidden
        res_post = self.client.post(
            "/api/v1/companies/",
            {"name": "Unauthorized Company", "description": "test"},
            format="json",
        )
        self.assertEqual(res_post.status_code, status.HTTP_403_FORBIDDEN)

        # Non-staff company PATCH -> 403 Forbidden
        res_patch = self.client.patch(
            f"/api/v1/companies/{self.company.slug}/",
            {"name": "Hacked Company"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_user_receives_masked_data_and_no_drafts(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # Non-staff cannot see unpublished drafts in list
        res_list = self.client.get("/api/v1/experience/")
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        results = res_list.data.get("results", res_list.data)
        slugs = [item["slug"] for item in results]
        self.assertIn(self.published_exp.slug, slugs)
        self.assertNotIn(self.draft_exp.slug, slugs)

        # Non-staff cannot access unpublished draft by slug
        res_draft_detail = self.client.get(f"/api/v1/experience/{self.draft_exp.slug}/")
        self.assertEqual(res_draft_detail.status_code, status.HTTP_404_NOT_FOUND)

        # Non-staff receives masked detail data
        res_detail = self.client.get(f"/api/v1/experience/{self.published_exp.slug}/")
        self.assertEqual(res_detail.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", res_detail.data)
        self.assertNotIn("target_roles", res_detail.data)
        highlights = res_detail.data.get("highlights", [])
        self.assertEqual(len(highlights), 1)
        self.assertEqual(highlights[0]["text"], "Public contribution bullet")

    def test_authenticated_admin_receives_all_fields_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/v1/experience/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [item["slug"] for item in results]
        self.assertIn(self.published_exp.slug, slugs)
        self.assertIn(self.draft_exp.slug, slugs)

        # Verify admin detail view includes private fields
        detail_res = self.client.get(f"/api/v1/experience/{self.published_exp.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            detail_res.data["internal_notes"],
            "Private interview stories and architectural trade-offs.",
        )
        self.assertEqual(
            detail_res.data["target_roles"], ["Backend Engineering", "Cloud Architecture"]
        )
        self.assertEqual(len(detail_res.data["highlights"]), 2)

    def test_unauthenticated_write_operations_rejected(self):
        payload = {
            "title": "New Experience",
            "company": self.company.id,
            "start_date": "Jan 2025",
        }
        res_post = self.client.post("/api/v1/experience/", payload, format="json")
        self.assertEqual(res_post.status_code, status.HTTP_401_UNAUTHORIZED)

        res_patch = self.client.patch(
            f"/api/v1/experience/{self.published_exp.slug}/",
            {"title": "Updated Title"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_401_UNAUTHORIZED)

        res_delete = self.client.delete(f"/api/v1/experience/{self.published_exp.slug}/")
        self.assertEqual(res_delete.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_admin_crud_workflow(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create Experience
        create_payload = {
            "title": "Cloud Platform Engineer",
            "company": self.company.id,
            "employment_type": "full-time",
            "location": "Tokyo, Japan",
            "start_date": "Jan 2025",
            "end_date": "Present",
            "current_position": True,
            "is_published": True,
            "mission": "Scale cloud infrastructure.",
            "summary": "Managing AWS ECS and Terraform deployments.",
            "highlights": [
                {
                    "id": "ach-101",
                    "text": "Automated ECS deployments via CloudFormation",
                    "is_public": True,
                    "target_roles": ["Cloud Architecture"],
                    "order": 0,
                }
            ],
            "metrics": [{"label": "Uptime", "value": "99.99%"}],
            "challenges": [
                {
                    "problem": "Manual deployment",
                    "solution": "IaC automation",
                    "impact": "Zero downtime",
                }
            ],
            "technologies": [self.tech_python.id],
            "target_roles": ["Cloud Architecture"],
            "internal_notes": "Key project for 2025 performance review.",
        }
        create_res = self.client.post("/api/v1/experience/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        new_slug = create_res.data["slug"]
        self.assertEqual(create_res.data["start_year_month"], "2025-01")

        # 2. Update Experience
        patch_res = self.client.patch(
            f"/api/v1/experience/{new_slug}/",
            {"summary": "Updated summary for cloud platform engineer role."},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            patch_res.data["summary"], "Updated summary for cloud platform engineer role."
        )

        # 3. Delete Experience
        delete_res = self.client.delete(f"/api/v1/experience/{new_slug}/")
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Experience.objects.filter(slug=new_slug).exists())

    def test_inline_company_creation(self):
        self.client.force_authenticate(user=self.admin_user)
        company_payload = {
            "name": "Acme Cloud Corp",
            "location": "Tokyo, Japan",
            "industry": "Cloud Infrastructure",
            "website": "https://acmecloud.example.com",
            "description": "Next-gen serverless cloud platform.",
        }
        res = self.client.post("/api/v1/companies/", company_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["slug"], "acme-cloud-corp")
        self.assertTrue(Company.objects.filter(slug="acme-cloud-corp").exists())
