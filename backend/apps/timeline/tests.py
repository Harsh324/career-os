from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.certifications.models import Certification
from apps.companies.models import Company
from apps.education.models import Education
from apps.experiences.models import Experience
from apps.timeline.models import TimelineEvent

User = get_user_model()


class TimelineModelTests(TestCase):
    def test_auto_slug_generation(self):
        te = TimelineEvent.objects.create(
            title="Spoke at Tokyo Python Meetup",
            date="Nov 2025",
            category="Milestone",
        )
        self.assertEqual(te.slug, "spoke-at-tokyo-python-meetup")

    def test_auto_slug_collision_handling(self):
        t1 = TimelineEvent.objects.create(
            title="Milestone Event",
            date="Jun 2024",
            category="Milestone",
        )
        t2 = TimelineEvent.objects.create(
            title="Milestone Event",
            date="Jun 2028",
            category="Milestone",
        )
        self.assertEqual(t1.slug, "milestone-event")
        self.assertEqual(t2.slug, "milestone-event-1")


class TimelineProjectionAPITests(TestCase):
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
            location="Tokyo, Japan",
        )

        # 1. Canonical Experience
        self.exp = Experience.objects.create(
            title="Backend & Cloud Engineer",
            slug="software-engineer-sms",
            company=self.company,
            start_date="Oct 2024",
            end_date="Present",
            current_position=True,
            summary="Building Celery pipelines and AWS ECS cloud infrastructure.",
            is_published=True,
            featured=True,
            target_roles=["Backend Engineering"],
            internal_notes="Full-time role notes.",
        )

        # 2. Canonical Education
        self.edu = Education.objects.create(
            institution="IIIT Nagpur",
            degree="B.Tech in Computer Science and Engineering",
            slug="iiit-nagpur",
            location="Nagpur, India",
            start_date="Dec 2020",
            end_date="Jun 2024",
            description="Computer science undergraduate degree.",
            is_published=True,
            is_featured=True,
            target_roles=["Education"],
            internal_notes="Graduated with honors.",
        )

        # 3. Canonical Certification
        self.cert = Certification.objects.create(
            name="AWS Certified Solutions Architect – Associate",
            slug="aws-solutions-architect",
            issuer="Amazon Web Services",
            issue_date="2025-08-19",
            credential_url="https://cp.certmetrics.com/amazon/verify/sample",
            description="AWS Cloud architecture validation.",
            is_published=True,
            is_featured=True,
            target_roles=["Cloud Architecture"],
            internal_notes="Passed on first attempt.",
        )

        # 4. Manual Milestone
        self.manual = TimelineEvent.objects.create(
            title="Engineering Relocation to Tokyo",
            slug="engineering-relocation-tokyo",
            subtitle="Tokyo, Japan",
            description="Relocated to Tokyo for engineering role.",
            date="Oct 2024",
            category="Milestone",
            icon="Rocket",
            is_milestone=True,
            is_published=True,
            target_roles=["Career Transition"],
            internal_notes="Relocation package details.",
        )

        # 5. Draft Canonical Record
        self.draft_exp = Experience.objects.create(
            title="Draft Future Role",
            slug="draft-future-role",
            company=self.company,
            start_date="2027",
            is_published=False,
            target_roles=["Future"],
            internal_notes="Draft role notes.",
        )

    def test_published_experience_projects_to_timeline(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        exp_entry = next((e for e in results if e["source_slug"] == "software-engineer-sms"), None)
        self.assertIsNotNone(exp_entry)
        self.assertEqual(exp_entry["source_type"], "experience")
        self.assertEqual(exp_entry["title"], "Backend & Cloud Engineer")
        self.assertEqual(exp_entry["category"], "Career")
        self.assertEqual(exp_entry["icon"], "Briefcase")
        self.assertTrue(exp_entry["is_milestone"])

    def test_published_education_projects_to_timeline(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        edu_entry = next((e for e in results if e["source_slug"] == "iiit-nagpur"), None)
        self.assertIsNotNone(edu_entry)
        self.assertEqual(edu_entry["source_type"], "education")
        self.assertEqual(edu_entry["title"], "B.Tech in Computer Science and Engineering")
        self.assertEqual(edu_entry["category"], "Education")
        self.assertEqual(edu_entry["icon"], "GraduationCap")

    def test_published_certification_projects_to_timeline(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        cert_entry = next((e for e in results if e["source_slug"] == "aws-solutions-architect"), None)
        self.assertIsNotNone(cert_entry)
        self.assertEqual(cert_entry["source_type"], "certification")
        self.assertEqual(cert_entry["title"], "AWS Certified Solutions Architect – Associate")
        self.assertEqual(cert_entry["category"], "Certification")
        self.assertEqual(cert_entry["icon"], "Award")
        self.assertEqual(cert_entry["date"], "Aug 2025")

    def test_manual_milestone_projects_to_timeline(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        manual_entry = next((e for e in results if e["source_slug"] == "engineering-relocation-tokyo"), None)
        self.assertIsNotNone(manual_entry)
        self.assertEqual(manual_entry["source_type"], "manual_milestone")
        self.assertEqual(manual_entry["title"], "Engineering Relocation to Tokyo")
        self.assertEqual(manual_entry["icon"], "Rocket")

    def test_unpublished_canonical_records_hidden_from_public(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        slugs = [e.get("source_slug") for e in results]
        self.assertNotIn("draft-future-role", slugs)

    def test_staff_can_view_drafts_in_projection(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        slugs = [e.get("source_slug") for e in results]
        self.assertIn("draft-future-role", slugs)

    def test_private_intelligence_masked_for_anonymous(self):
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        for item in results:
            self.assertNotIn("internal_notes", item)
            self.assertNotIn("target_roles", item)

    def test_private_intelligence_visible_for_staff(self):
        self.client.force_authenticate(user=self.admin_user)
        res = self.client.get("/api/v1/timeline/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        results = res.data if isinstance(res.data, list) else res.data.get("results", [])
        exp_entry = next((e for e in results if e["source_slug"] == "software-engineer-sms"), None)
        self.assertIsNotNone(exp_entry)
        self.assertEqual(exp_entry.get("internal_notes"), "Full-time role notes.")
        self.assertEqual(exp_entry.get("target_roles"), ["Backend Engineering"])

    def test_derived_entry_mutation_rejected(self):
        self.client.force_authenticate(user=self.admin_user)

        # Attempt to patch a derived experience via timeline API
        res_patch = self.client.patch(
            "/api/v1/timeline/exp-software-engineer-sms/",
            {"title": "Tampered Title"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", res_patch.data)

        # Attempt to delete a derived certification via timeline API
        res_del = self.client.delete("/api/v1/timeline/cert-aws-solutions-architect/")
        self.assertEqual(res_del.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", res_del.data)

    def test_manual_milestone_crud_lifecycle(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create Manual Milestone
        payload = {
            "title": "AWS Community Day Speaker",
            "subtitle": "Tokyo, Japan",
            "description": "Delivered keynote on serverless async queues.",
            "date": "Dec 2026",
            "category": "Milestone",
            "icon": "Award",
            "is_milestone": True,
            "is_published": True,
            "target_roles": ["Public Speaking"],
            "internal_notes": "Conference notes.",
        }
        res_post = self.client.post("/api/v1/timeline/", payload, format="json")
        self.assertEqual(res_post.status_code, status.HTTP_201_CREATED)
        slug = res_post.data["slug"]
        self.assertEqual(slug, "aws-community-day-speaker")

        # 2. Update Manual Milestone
        res_patch = self.client.patch(
            f"/api/v1/timeline/{slug}/",
            {"description": "Updated keynote details."},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_200_OK)
        self.assertEqual(res_patch.data["description"], "Updated keynote details.")

        # 3. Delete Manual Milestone
        res_del = self.client.delete(f"/api/v1/timeline/{slug}/")
        self.assertEqual(res_del.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(TimelineEvent.objects.filter(slug=slug).exists())

    def test_canonical_update_propagates_immediately(self):
        # 1. Verify initial title
        res1 = self.client.get("/api/v1/timeline/")
        exp1 = next((e for e in res1.data if e["source_slug"] == "software-engineer-sms"), None)
        self.assertEqual(exp1["title"], "Backend & Cloud Engineer")

        # 2. Update canonical Experience model directly
        self.exp.title = "Lead Backend & Cloud Architect"
        self.exp.save()

        # 3. Verify timeline projection immediately reflects updated title without secondary edits
        res2 = self.client.get("/api/v1/timeline/")
        exp2 = next((e for e in res2.data if e["source_slug"] == "software-engineer-sms"), None)
        self.assertEqual(exp2["title"], "Lead Backend & Cloud Architect")

        # 4. Update canonical Education degree
        self.edu.degree = "B.Tech in Artificial Intelligence & Computer Science"
        self.edu.save()

        res3 = self.client.get("/api/v1/timeline/")
        edu3 = next((e for e in res3.data if e["source_slug"] == "iiit-nagpur"), None)
        self.assertEqual(edu3["title"], "B.Tech in Artificial Intelligence & Computer Science")

        # 5. Update canonical Certification issue date
        self.cert.issue_date = "2026-01-15"
        self.cert.save()

        res4 = self.client.get("/api/v1/timeline/")
        cert4 = next((e for e in res4.data if e["source_slug"] == "aws-solutions-architect"), None)
        self.assertEqual(cert4["date"], "Jan 2026")
