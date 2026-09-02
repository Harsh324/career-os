from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.education.models import Education

User = get_user_model()


class EducationModelTests(TestCase):
    def test_auto_slug_generation(self):
        edu = Education.objects.create(
            institution="Stanford University",
            degree="M.S. in Computer Science",
            start_date="2027",
            end_date="2029",
        )
        self.assertEqual(edu.slug, "ms-in-computer-science-stanford-university")

    def test_auto_slug_collision_handling(self):
        e1 = Education.objects.create(
            institution="IIT",
            degree="B.Tech",
            start_date="2020",
            end_date="2024",
        )
        e2 = Education.objects.create(
            institution="IIT",
            degree="B.Tech",
            start_date="2024",
            end_date="2028",
        )
        self.assertEqual(e1.slug, "btech-iit")
        self.assertEqual(e2.slug, "btech-iit-1")


class EducationAPITests(TestCase):
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

        self.published_edu = Education.objects.create(
            institution="Indian Institute of Information Technology (IIIT Nagpur)",
            degree="B.Tech in Computer Science and Engineering",
            field_of_study="Computer Science and Engineering",
            slug="iiit-nagpur",
            location="Nagpur, India",
            start_date="Dec 2020",
            end_date="Jun 2024",
            grade="First Class",
            is_published=True,
            is_featured=True,
            order=1,
            description="Undergraduate degree.",
            achievements=["Graduated First Class"],
            relevant_courses=["Data Structures", "OS"],
            target_roles=["Software Engineering"],
            internal_notes="Official degree certificate on file.",
        )

        self.draft_edu = Education.objects.create(
            institution="Online Academy",
            degree="Certificate in Systems",
            slug="draft-academy",
            start_date="2026",
            end_date="2026",
            is_published=False,
            is_featured=False,
            order=99,
            target_roles=["Research"],
            internal_notes="Draft degree exploration.",
        )

    def test_anonymous_cannot_see_draft_in_list(self):
        res = self.client.get("/api/v1/education/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get("results", res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("iiit-nagpur", slugs)
        self.assertNotIn("draft-academy", slugs)

    def test_anonymous_cannot_get_draft_detail(self):
        res = self.client.get(f"/api/v1/education/{self.draft_edu.slug}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_receives_masked_public_data(self):
        res = self.client.get(f"/api/v1/education/{self.published_edu.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", res.data)
        self.assertNotIn("target_roles", res.data)
        self.assertEqual(
            res.data["institution"], "Indian Institute of Information Technology (IIIT Nagpur)"
        )

    def test_non_staff_mutations_forbidden(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # POST attempt
        post_res = self.client.post(
            "/api/v1/education/",
            {
                "institution": "Fake Univ",
                "degree": "B.A.",
                "start_date": "2020",
                "end_date": "2024",
            },
            format="json",
        )
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        # PATCH attempt
        patch_res = self.client.patch(
            f"/api/v1/education/{self.published_edu.slug}/",
            {"institution": "Tampered Name"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

        # DELETE attempt
        del_res = self.client.delete(f"/api/v1/education/{self.published_edu.slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_data_masking_and_draft_isolation(self):
        self.client.force_authenticate(user=self.non_staff_user)

        list_res = self.client.get("/api/v1/education/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("iiit-nagpur", slugs)
        self.assertNotIn("draft-academy", slugs)

        detail_res = self.client.get(f"/api/v1/education/{self.published_edu.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", detail_res.data)
        self.assertNotIn("target_roles", detail_res.data)

        draft_res = self.client.get(f"/api/v1/education/{self.draft_edu.slug}/")
        self.assertEqual(draft_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_receives_unmasked_data_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)

        list_res = self.client.get("/api/v1/education/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("iiit-nagpur", slugs)
        self.assertIn("draft-academy", slugs)

        detail_res = self.client.get(f"/api/v1/education/{self.published_edu.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertIn("internal_notes", detail_res.data)
        self.assertEqual(detail_res.data["internal_notes"], "Official degree certificate on file.")
        self.assertIn("target_roles", detail_res.data)

    def test_staff_crud_lifecycle(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create
        create_payload = {
            "institution": "University of Tokyo",
            "degree": "Research Fellowship",
            "field_of_study": "Distributed Computing",
            "location": "Tokyo, Japan",
            "start_date": "2026",
            "end_date": "2027",
            "currently_studying": True,
            "grade": "Distinction",
            "is_published": True,
            "is_featured": True,
            "order": 2,
            "description": "Visiting researcher fellowship.",
            "achievements": ["Published paper"],
            "relevant_courses": ["Advanced Systems"],
            "target_roles": ["Research Engineer"],
            "internal_notes": "Fellowship offer letter verified.",
        }
        create_res = self.client.post("/api/v1/education/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        slug = create_res.data["slug"]
        self.assertEqual(slug, "research-fellowship-university-of-tokyo")

        # 2. Update (PATCH)
        patch_res = self.client.patch(
            f"/api/v1/education/{slug}/",
            {"order": 1, "grade": "High Distinction"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["order"], 1)
        self.assertEqual(patch_res.data["grade"], "High Distinction")

        # 3. Delete
        del_res = self.client.delete(f"/api/v1/education/{slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Education.objects.filter(slug=slug).exists())
