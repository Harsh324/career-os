import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from apps.certifications.models import Certification
from apps.companies.models import Company
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.media_assets.models import MediaAsset
from apps.projects.models import Project
from apps.skills.models import Skill

User = get_user_model()


def create_test_image(
    filename: str = "test.png", width: int = 100, height: int = 80, color: str = "blue"
) -> SimpleUploadedFile:
    """Generates an in-memory PNG image for file upload testing."""
    img = Image.new("RGB", (width, height), color=color)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return SimpleUploadedFile(filename, buffer.read(), content_type="image/png")


class MediaAssetModelTests(TestCase):
    def test_auto_slug_generation_and_collision_handling(self):
        a1 = MediaAsset.objects.create(
            title="System Architecture Diagram",
            asset_type="architecture_diagram",
        )
        a2 = MediaAsset.objects.create(
            title="System Architecture Diagram",
            asset_type="architecture_diagram",
        )
        self.assertEqual(a1.slug, "system-architecture-diagram")
        self.assertEqual(a2.slug, "system-architecture-diagram-1")

    def test_image_metadata_auto_extraction(self):
        uploaded_image = create_test_image("diagram.png", width=320, height=240)
        asset = MediaAsset.objects.create(
            title="Async Queue Architecture",
            asset_type="architecture_diagram",
            file=uploaded_image,
            alt_text="Diagram of Redis queue and Celery worker workers",
        )

        self.assertEqual(asset.width, 320)
        self.assertEqual(asset.height, 240)
        self.assertEqual(asset.mime_type, "image/png")
        self.assertGreater(asset.file_size, 0)
        self.assertEqual(asset.original_filename, "diagram.png")
        self.assertTrue(asset.is_image)
        self.assertFalse(asset.is_document)

    def test_non_image_metadata_handling(self):
        uploaded_doc = SimpleUploadedFile(
            "resume.pdf",
            b"%PDF-1.4 sample content for testing",
            content_type="application/pdf",
        )
        asset = MediaAsset.objects.create(
            title="Harsh Tripathi Resume 2026",
            asset_type="resume",
            file=uploaded_doc,
        )

        self.assertIsNone(asset.width)
        self.assertIsNone(asset.height)
        self.assertEqual(asset.mime_type, "application/pdf")
        self.assertGreater(asset.file_size, 0)
        self.assertTrue(asset.is_document)
        self.assertFalse(asset.is_image)


class MediaAssetAPITests(TestCase):
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
            name="SMS DataTech", slug="sms-datatech", location="Tokyo, Japan"
        )
        self.exp = Experience.objects.create(
            title="Software Engineer",
            slug="software-engineer-sms",
            company=self.company,
            start_date="Oct 2024",
            is_published=True,
        )
        self.project = Project.objects.create(
            title="FinTrack AI",
            slug="fintrack-ai",
            summary="Personal finance platform.",
            is_published=True,
        )
        self.cert = Certification.objects.create(
            name="AWS Certified Solutions Architect",
            slug="aws-solutions-architect",
            issuer="AWS",
            issue_date="2025-08-19",
            is_published=True,
        )
        self.edu = Education.objects.create(
            institution="IIIT Nagpur",
            degree="B.Tech in CSE",
            slug="iiit-nagpur",
            start_date="2020",
            end_date="2024",
            is_published=True,
        )
        self.skill = Skill.objects.create(
            name="Python",
            slug="python",
            category="Backend Engineering",
            is_published=True,
        )

        # Published Asset with relationships
        self.img_file = create_test_image("fintrack_arch.png", width=400, height=300)
        self.pub_asset = MediaAsset.objects.create(
            title="FinTrack Architecture Diagram",
            slug="fintrack-architecture-diagram",
            asset_type="architecture_diagram",
            file=self.img_file,
            alt_text="High-level FinTrack system architecture diagram",
            caption="AWS ECS and PostgreSQL topology",
            description="System dataflow and async worker topology.",
            is_published=True,
            is_featured=True,
            tags=["AWS", "Architecture", "FinTrack"],
            target_roles=["Backend Architect", "Cloud Engineer"],
            internal_notes="Confidential diagram details.",
        )
        self.pub_asset.related_projects.add(self.project)
        self.pub_asset.related_experiences.add(self.exp)
        self.pub_asset.related_certifications.add(self.cert)
        self.pub_asset.related_education.add(self.edu)
        self.pub_asset.related_skills.add(self.skill)

        # Draft Asset
        self.draft_asset = MediaAsset.objects.create(
            title="Draft Secret Diagram",
            slug="draft-secret-diagram",
            asset_type="architecture_diagram",
            is_published=False,
            target_roles=["Confidential"],
            internal_notes="Internal review only.",
        )

    def test_public_list_shows_published_only(self):
        res = self.client.get("/api/v1/media/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        slugs = [item["slug"] for item in results]
        self.assertIn("fintrack-architecture-diagram", slugs)
        self.assertNotIn("draft-secret-diagram", slugs)

    def test_public_retrieve_draft_returns_404(self):
        res = self.client.get("/api/v1/media/draft-secret-diagram/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_list_includes_drafts(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/media/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        slugs = [item["slug"] for item in results]
        self.assertIn("draft-secret-diagram", slugs)
        self.assertIn("fintrack-architecture-diagram", slugs)

    def test_staff_retrieve_draft_returns_200(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/media/draft-secret-diagram/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["title"], "Draft Secret Diagram")

    def test_private_intelligence_masked_for_anonymous(self):
        res = self.client.get("/api/v1/media/fintrack-architecture-diagram/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("target_roles", res.data)
        self.assertNotIn("internal_notes", res.data)

    def test_private_intelligence_visible_for_staff(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/media/fintrack-architecture-diagram/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["internal_notes"], "Confidential diagram details.")
        self.assertEqual(res.data["target_roles"], ["Backend Architect", "Cloud Engineer"])

    def test_related_entities_nested_summaries(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/media/fintrack-architecture-diagram/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertEqual(len(res.data["related_projects_detail"]), 1)
        self.assertEqual(res.data["related_projects_detail"][0]["slug"], "fintrack-ai")

        self.assertEqual(len(res.data["related_experiences_detail"]), 1)
        self.assertEqual(res.data["related_experiences_detail"][0]["slug"], "software-engineer-sms")

        self.assertEqual(len(res.data["related_certifications_detail"]), 1)
        self.assertEqual(
            res.data["related_certifications_detail"][0]["slug"],
            "aws-solutions-architect",
        )

    def test_anonymous_and_non_staff_mutations_forbidden(self):
        # Anonymous POST
        res1 = self.client.post(
            "/api/v1/media/", {"title": "Unauthorized Asset"}, format="json"
        )
        self.assertIn(
            res1.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
        )

        # Non-staff POST
        self.client.force_authenticate(user=self.non_staff_user)
        res2 = self.client.post("/api/v1/media/", {"title": "Unauthorized Asset"}, format="json")
        self.assertEqual(res2.status_code, status.HTTP_403_FORBIDDEN)

        # Non-staff DELETE
        res3 = self.client.delete("/api/v1/media/fintrack-architecture-diagram/")
        self.assertEqual(res3.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_create_asset_with_file_upload(self):
        self.client.force_authenticate(user=self.admin_user)
        img = create_test_image("logo.png", width=128, height=128)

        data = {
            "title": "AWS Cloud Architecture Logo",
            "asset_type": "project_logo",
            "file": img,
            "alt_text": "Official AWS Cloud logo",
            "is_published": True,
            "is_featured": True,
            "related_projects": [self.project.id],
            "target_roles": ["Cloud"],
            "internal_notes": "Vector-derived asset.",
        }

        res = self.client.post("/api/v1/media/", data, format="multipart")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["slug"], "aws-cloud-architecture-logo")
        self.assertEqual(res.data["width"], 128)
        self.assertEqual(res.data["height"], 128)
        self.assertEqual(res.data["mime_type"], "image/png")

    def test_staff_update_and_delete_asset(self):
        self.client.force_authenticate(user=self.admin_user)

        # Update
        res_patch = self.client.patch(
            "/api/v1/media/draft-secret-diagram/",
            {"title": "Updated Secret Diagram", "is_published": True},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data["title"], "Updated Secret Diagram")
        self.assertTrue(res_patch.data["is_published"])

        # Delete
        res_del = self.client.delete("/api/v1/media/draft-secret-diagram/")
        self.assertEqual(res_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MediaAsset.objects.filter(slug="draft-secret-diagram").exists())

    def test_filter_and_search_endpoints(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Filter by asset_type
        res_type = self.client.get("/api/v1/media/?asset_type=architecture_diagram")
        self.assertEqual(res_type.status_code, status.HTTP_200_OK)
        results = (
            res_type.data if isinstance(res_type.data, list) else res_type.data.get("results", [])
        )
        self.assertTrue(all(item["asset_type"] == "architecture_diagram" for item in results))

        # 2. Filter by project
        res_proj = self.client.get(f"/api/v1/media/?project={self.project.slug}")
        self.assertEqual(res_proj.status_code, status.HTTP_200_OK)
        results = (
            res_proj.data if isinstance(res_proj.data, list) else res_proj.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["slug"], "fintrack-architecture-diagram")

        # 3. Search query
        res_search = self.client.get("/api/v1/media/?search=topology")
        self.assertEqual(res_search.status_code, status.HTTP_200_OK)
        results = (
            res_search.data
            if isinstance(res_search.data, list)
            else res_search.data.get("results", [])
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["slug"], "fintrack-architecture-diagram")
