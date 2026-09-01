from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.timeline.models import TimelineEvent

User = get_user_model()


class TimelineModelTests(TestCase):
    def test_auto_slug_generation(self):
        te = TimelineEvent.objects.create(
            title="Spoke at Tokyo Python Meetup",
            date="Nov 2025",
            category="Career",
        )
        self.assertEqual(te.slug, "spoke-at-tokyo-python-meetup")

    def test_auto_slug_collision_handling(self):
        t1 = TimelineEvent.objects.create(
            title="Graduation",
            date="Jun 2024",
            category="Education",
        )
        t2 = TimelineEvent.objects.create(
            title="Graduation",
            date="Jun 2028",
            category="Education",
        )
        self.assertEqual(t1.slug, "graduation")
        self.assertEqual(t2.slug, "graduation-1")


class TimelineAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="admin", email="admin@career-os.dev", password="adminpassword123"
        )
        self.non_staff_user = User.objects.create_user(
            username="visitor", email="visitor@example.com", password="visitorpassword123", is_staff=False
        )

        self.published_event = TimelineEvent.objects.create(
            title="Backend & Cloud Engineer",
            slug="sms-fulltime",
            subtitle="SMS DataTech",
            description="Building Celery pipelines and AWS ECS infrastructure.",
            date="Oct 2024 – Present",
            category="Career",
            icon="Briefcase",
            order=4,
            is_milestone=True,
            is_published=True,
            target_roles=["Backend Engineering"],
            internal_notes="Full-time promotion.",
        )

        self.draft_event = TimelineEvent.objects.create(
            title="Draft Milestone",
            slug="draft-milestone",
            date="2027",
            category="Milestone",
            is_published=False,
            is_milestone=False,
            order=99,
            target_roles=["Future"],
            internal_notes="Draft milestone notes.",
        )

    def test_anonymous_cannot_see_draft_in_list(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data.get("results", res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("sms-fulltime", slugs)
        self.assertNotIn("draft-milestone", slugs)

    def test_anonymous_cannot_get_draft_detail(self):
        res = self.client.get(f"/api/v1/timeline/{self.draft_event.slug}/")
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_receives_masked_public_data(self):
        res = self.client.get(f"/api/v1/timeline/{self.published_event.slug}/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", res.data)
        self.assertNotIn("target_roles", res.data)
        self.assertEqual(res.data["title"], "Backend & Cloud Engineer")

    def test_non_staff_mutations_forbidden(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # POST attempt
        post_res = self.client.post(
            "/api/v1/timeline/",
            {"title": "Hacked Event", "date": "2026", "category": "Career"},
            format="json",
        )
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        # PATCH attempt
        patch_res = self.client.patch(
            f"/api/v1/timeline/{self.published_event.slug}/",
            {"title": "Tampered Name"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

        # DELETE attempt
        del_res = self.client.delete(f"/api/v1/timeline/{self.published_event.slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_data_masking_and_draft_isolation(self):
        self.client.force_authenticate(user=self.non_staff_user)

        list_res = self.client.get("/api/v1/timeline/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("sms-fulltime", slugs)
        self.assertNotIn("draft-milestone", slugs)

        detail_res = self.client.get(f"/api/v1/timeline/{self.published_event.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", detail_res.data)
        self.assertNotIn("target_roles", detail_res.data)

        draft_res = self.client.get(f"/api/v1/timeline/{self.draft_event.slug}/")
        self.assertEqual(draft_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_staff_receives_unmasked_data_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)

        list_res = self.client.get("/api/v1/timeline/")
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        results = list_res.data.get("results", list_res.data)
        slugs = [e["slug"] for e in results]
        self.assertIn("sms-fulltime", slugs)
        self.assertIn("draft-milestone", slugs)

        detail_res = self.client.get(f"/api/v1/timeline/{self.published_event.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertIn("internal_notes", detail_res.data)
        self.assertEqual(detail_res.data["internal_notes"], "Full-time promotion.")
        self.assertIn("target_roles", detail_res.data)

    def test_staff_crud_lifecycle(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create
        create_payload = {
            "title": "AWS Summit Tokyo 2026",
            "subtitle": "Attendee & Architecture Workshop",
            "description": "Participated in enterprise AWS infrastructure deep dive.",
            "date": "May 2026",
            "category": "Career",
            "icon": "Award",
            "link": "https://aws.amazon.com/events/summits/tokyo/",
            "order": 7,
            "is_milestone": True,
            "is_published": True,
            "target_roles": ["Cloud Architecture"],
            "internal_notes": "Key contacts made in cloud networking.",
        }
        create_res = self.client.post("/api/v1/timeline/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        slug = create_res.data["slug"]
        self.assertEqual(slug, "aws-summit-tokyo-2026")

        # 2. Update (PATCH)
        patch_res = self.client.patch(
            f"/api/v1/timeline/{slug}/",
            {"order": 6, "is_milestone": False},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["order"], 6)
        self.assertFalse(patch_res.data["is_milestone"])

        # 3. Delete
        del_res = self.client.delete(f"/api/v1/timeline/{slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TimelineEvent.objects.filter(slug=slug).exists())

    def test_query_filtering(self):
        self.client.force_authenticate(user=self.admin_user)

        res_cat = self.client.get("/api/v1/timeline/?category=Career")
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        results = res_cat.data.get("results", res_cat.data)
        for e in results:
            self.assertEqual(e["category"], "Career")

        res_mile = self.client.get("/api/v1/timeline/?milestone=true")
        self.assertEqual(res_mile.status_code, status.HTTP_200_OK)
        results = res_mile.data.get("results", res_mile.data)
        for e in results:
            self.assertTrue(e["is_milestone"])
