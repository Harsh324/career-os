from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.site_settings.models import SiteSettings

User = get_user_model()


class SiteSettingsAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username="adminuser",
            email="admin@career-os.dev",
            password="adminpassword123",
        )
        self.regular_user = User.objects.create_user(
            username="regularuser",
            email="regular@career-os.dev",
            password="regularpassword123",
        )
        self.settings_obj, _ = SiteSettings.objects.update_or_create(
            id=1,
            defaults={
                "name": "Harsh Tripathi",
                "title": "Backend & Cloud Engineer",
                "email": "tripathiharsh324@gmail.com",
                "location": "Tokyo, Japan",
                "tagline": "Backend Engineer building scalable systems.",
                "summary": "Experienced engineer working on Python & AWS.",
                "engineering_focus": ["Backend APIs", "Distributed Systems", "AWS Cloud"],
                "open_to_work": True,
                "target_roles": ["Backend Engineering", "Cloud Architecture"],
                "avatar_url": "https://github.com/Harsh324.png",
                "resume_url": "https://career-os.dev/resume.pdf",
                "github_url": "https://github.com/Harsh324",
                "linkedin_url": "https://linkedin.com/in/harsh324",
                "twitter_url": "https://x.com/harsh324",
            },
        )
        self.settings_url = reverse("v1:site_settings")
        self.json_resume_url = reverse("v1:json_resume")

    def test_public_settings_retrieval(self):
        """Anonymous public access should return presentation fields and omit target_roles."""
        response = self.client.get(self.settings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Harsh Tripathi")
        self.assertEqual(response.data["title"], "Backend & Cloud Engineer")
        self.assertEqual(
            response.data["engineering_focus"], ["Backend APIs", "Distributed Systems", "AWS Cloud"]
        )
        self.assertTrue(response.data["open_to_work"])
        # target_roles must NOT be exposed to anonymous public visitors
        self.assertNotIn("target_roles", response.data)

    def test_admin_settings_retrieval(self):
        """Admin request should include private career data (target_roles)."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.settings_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("target_roles", response.data)
        self.assertEqual(
            response.data["target_roles"], ["Backend Engineering", "Cloud Architecture"]
        )

    def test_admin_patch_profile_success(self):
        """Admin PATCH updates canonical profile in PostgreSQL."""
        self.client.force_authenticate(user=self.admin_user)
        patch_payload = {
            "title": "Lead Backend & Distributed Systems Engineer",
            "tagline": "Architecting resilient distributed backends with Python, Celery & AWS.",
            "open_to_work": False,
            "engineering_focus": ["Distributed Systems", "Event-Driven Architecture", "AWS Cloud"],
            "target_roles": ["Principal Backend Engineer"],
        }
        response = self.client.patch(self.settings_url, patch_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Lead Backend & Distributed Systems Engineer")
        self.assertFalse(response.data["open_to_work"])
        self.assertEqual(
            response.data["engineering_focus"],
            ["Distributed Systems", "Event-Driven Architecture", "AWS Cloud"],
        )
        self.assertEqual(response.data["target_roles"], ["Principal Backend Engineer"])

        # Verify DB persistence
        self.settings_obj.refresh_from_db()
        self.assertEqual(self.settings_obj.title, "Lead Backend & Distributed Systems Engineer")
        self.assertFalse(self.settings_obj.open_to_work)
        self.assertEqual(self.settings_obj.target_roles, ["Principal Backend Engineer"])

    def test_unauthenticated_patch_rejected(self):
        """Anonymous PATCH must be rejected with 401 Unauthorized."""
        response = self.client.patch(self.settings_url, {"title": "Hacked Title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_admin_patch_rejected(self):
        """Non-staff authenticated user PATCH must be rejected with 403 Forbidden."""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.patch(self.settings_url, {"title": "Hacked Title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_structured_array_validation(self):
        """Payload with invalid non-list engineering_focus or target_roles must return 400."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(
            self.settings_url,
            {"engineering_focus": "not_a_list"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("engineering_focus", response.data)

    def test_name_and_title_cannot_be_blank(self):
        """Blank name or title must return 400 Bad Request."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.settings_url, {"name": ""}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_resume_url_immutable_via_profile_patch(self):
        """resume_url is read-only in Profile Management and cannot be overwritten."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(
            self.settings_url,
            {"resume_url": "https://malicious.com/fake.pdf"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.settings_obj.refresh_from_db()
        self.assertEqual(self.settings_obj.resume_url, "https://career-os.dev/resume.pdf")

    def test_json_resume_reflects_updated_profile(self):
        """JSON Resume output dynamically reflects updated profile fields."""
        self.client.force_authenticate(user=self.admin_user)
        self.client.patch(
            self.settings_url,
            {"summary": "Updated specialized summary for JSON resume testing."},
            format="json",
        )
        response = self.client.get(self.json_resume_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data["basics"]["summary"],
            "Updated specialized summary for JSON resume testing.",
        )
