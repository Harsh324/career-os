from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.certifications.models import Certification
from apps.companies.models import Company
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.skills.models import Skill
from apps.technologies.models import Technology

User = get_user_model()


class CertificationModelTests(TestCase):
    def test_auto_slug_generation(self):
        cert = Certification.objects.create(
            name="AWS Certified Security – Specialty",
            issuer="Amazon Web Services",
            issue_date="2026-01-01",
        )
        self.assertEqual(cert.slug, "aws-certified-security-specialty")

    def test_auto_slug_collision_handling(self):
        c1 = Certification.objects.create(
            name="CKA",
            issuer="Linux Foundation",
            issue_date="2025-01-01",
        )
        c2 = Certification.objects.create(
            name="CKA",
            issuer="CNCF",
            issue_date="2026-01-01",
        )
        self.assertEqual(c1.slug, "cka")
        self.assertEqual(c2.slug, "cka-1")


class CertificationAPITests(TestCase):
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

        self.tech_aws = Technology.objects.create(name="AWS", slug="aws", category="Cloud")
        self.skill_cloud = Skill.objects.create(
            name="Cloud Architecture", slug="cloud-arch-skill", category="Cloud & Infrastructure"
        )
        self.company = Company.objects.create(name="SMS DataTech", slug="sms-datatech")
        self.exp = Experience.objects.create(
            title="Software Engineer",
            company=self.company,
            start_date="Oct 2024",
            current_position=True,
        )
        self.proj = Project.objects.create(
            title="Career OS",
            summary="Career OS Platform",
            project_type="platform",
        )

        self.published_cert = Certification.objects.create(
            name="AWS Certified Solutions Architect – Associate",
            slug="aws-saa",
            issuer="Amazon Web Services",
            credential_id="AWS-SAA-12345",
            credential_url="https://aws.amazon.com/verify/12345",
            issue_date="2025-08-19",
            expiry_date="2028-08-19",
            verification_status="verified",
            category="Cloud & Infrastructure",
            is_published=True,
            is_featured=True,
            order=1,
            description="Official AWS SAA credential.",
            target_roles=["Cloud Architecture", "Backend Engineering"],
            internal_notes="Private exam scores and verification notes.",
        )
        self.published_cert.related_technologies.add(self.tech_aws)
        self.published_cert.related_skills.add(self.skill_cloud)
        self.published_cert.related_experiences.add(self.exp)
        self.published_cert.related_projects.add(self.proj)

        self.draft_cert = Certification.objects.create(
            name="Draft Certification Exploration",
            slug="draft-cert",
            issuer="Beta Issuer",
            issue_date="2026-09-01",
            is_published=False,
            is_featured=False,
            order=99,
            description="Draft certification note.",
            target_roles=["Research"],
            internal_notes="Internal review notes.",
        )

    def test_anonymous_cannot_see_draft_in_list(self):
        res = self.client.get("/api/v1/certifications/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get("results", res.data)
        slugs = [c["slug"] for c in results]
        self.assertIn("aws-saa", slugs)
        self.assertNotIn("draft-cert", slugs)

    def test_anonymous_cannot_get_draft_detail(self):
        res = self.client.get(f"/api/v1/certifications/{self.draft_cert.slug}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_receives_masked_public_data(self):
        res = self.client.get(f"/api/v1/certifications/{self.published_cert.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", res.data)
        self.assertNotIn("target_roles", res.data)
        self.assertEqual(res.data["credential_id"], "AWS-SAA-12345")
        self.assertEqual(len(res.data["related_skills_detail"]), 1)
        self.assertEqual(len(res.data["related_technologies_detail"]), 1)
        self.assertEqual(len(res.data["related_experiences_detail"]), 1)
        self.assertEqual(len(res.data["related_projects_detail"]), 1)

    def test_non_staff_mutations_forbidden(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # POST attempt
        post_res = self.client.post(
            "/api/v1/certifications/",
            {"name": "Hacked Cert", "issuer": "Fake", "issue_date": "2026-01-01"},
            format="json",
        )
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        # PATCH attempt
        patch_res = self.client.patch(
            f"/api/v1/certifications/{self.published_cert.slug}/",
            {"name": "Tampered Name"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

        # DELETE attempt
        del_res = self.client.delete(f"/api/v1/certifications/{self.published_cert.slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_data_masking_and_draft_isolation(self):
        self.client.force_authenticate(user=self.non_staff_user)

        list_res = self.client.get("/api/v1/certifications/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [c["slug"] for c in results]
        self.assertIn("aws-saa", slugs)
        self.assertNotIn("draft-cert", slugs)

        detail_res = self.client.get(f"/api/v1/certifications/{self.published_cert.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", detail_res.data)
        self.assertNotIn("target_roles", detail_res.data)

        draft_res = self.client.get(f"/api/v1/certifications/{self.draft_cert.slug}/")
        self.assertEqual(draft_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_receives_unmasked_data_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)

        list_res = self.client.get("/api/v1/certifications/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [c["slug"] for c in results]
        self.assertIn("aws-saa", slugs)
        self.assertIn("draft-cert", slugs)

        detail_res = self.client.get(f"/api/v1/certifications/{self.published_cert.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertIn("internal_notes", detail_res.data)
        self.assertEqual(
            detail_res.data["internal_notes"],
            "Private exam scores and verification notes.",
        )
        self.assertIn("target_roles", detail_res.data)

    def test_staff_crud_lifecycle(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create
        create_payload = {
            "name": "Terraform Associate",
            "issuer": "HashiCorp",
            "credential_id": "HASHI-001",
            "credential_url": "https://hashicorp.com/verify/001",
            "issue_date": "2026-02-01",
            "expiry_date": "2028-02-01",
            "verification_status": "verified",
            "category": "DevOps",
            "is_published": True,
            "is_featured": True,
            "order": 5,
            "description": "Infrastructure as Code proficiency.",
            "related_technologies": [self.tech_aws.id],
            "related_skills": [self.skill_cloud.id],
            "related_experiences": [self.exp.id],
            "related_projects": [self.proj.id],
            "target_roles": ["DevOps", "Cloud Architecture"],
            "internal_notes": "Passed first attempt.",
        }
        create_res = self.client.post("/api/v1/certifications/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        slug = create_res.data["slug"]
        self.assertEqual(slug, "terraform-associate")
        self.assertEqual(create_res.data["credential_id"], "HASHI-001")
        self.assertEqual(len(create_res.data["related_skills_detail"]), 1)

        # 2. Update (PATCH)
        patch_res = self.client.patch(
            f"/api/v1/certifications/{slug}/",
            {"order": 1, "verification_status": "verified"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["order"], 1)

        # 3. Delete
        del_res = self.client.delete(f"/api/v1/certifications/{slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Certification.objects.filter(slug=slug).exists())

    def test_query_filtering(self):
        self.client.force_authenticate(user=self.admin_user)

        res_cat = self.client.get("/api/v1/certifications/?category=Cloud+%26+Infrastructure")
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        results = res_cat.data.get("results", res_cat.data)
        for c in results:
            self.assertEqual(c["category"], "Cloud & Infrastructure")

        res_feat = self.client.get("/api/v1/certifications/?featured=true")
        self.assertEqual(res_feat.status_code, status.HTTP_200_OK)
        results = res_feat.data.get("results", res_feat.data)
        for c in results:
            self.assertTrue(c["is_featured"])
