from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.companies.models import Company
from apps.experiences.models import Experience
from apps.projects.models import Project
from apps.skills.models import Skill
from apps.technologies.models import Technology

User = get_user_model()


class SkillModelTests(TestCase):
    def test_auto_slug_generation(self):
        skill = Skill.objects.create(
            name="Distributed Systems Architecture",
            category="Architecture & Distributed Systems",
            proficiency="expert",
            years=3.0,
        )
        self.assertEqual(skill.slug, "distributed-systems-architecture")

    def test_auto_slug_collision_handling(self):
        s1 = Skill.objects.create(name="Python", category="Backend Engineering")
        s2 = Skill.objects.create(name="Python", category="Supporting Technologies")
        self.assertEqual(s1.slug, "python")
        self.assertEqual(s2.slug, "python-1")

    def test_skill_defaults_and_ordering(self):
        s1 = Skill.objects.create(name="Zeta Skill", category="Backend Engineering", order=2)
        s2 = Skill.objects.create(name="Alpha Skill", category="Backend Engineering", order=1)
        s3 = Skill.objects.create(name="Beta Skill", category="AI & Data", order=1)

        skills = list(Skill.objects.filter(id__in=[s1.id, s2.id, s3.id]))
        self.assertEqual(skills[0].id, s3.id)  # AI & Data comes before Backend Engineering alphabetically
        self.assertEqual(skills[1].id, s2.id)  # Order 1 before Order 2
        self.assertEqual(skills[2].id, s1.id)


class SkillAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username="admin", email="admin@career-os.dev", password="adminpassword123"
        )
        self.non_staff_user = User.objects.create_user(
            username="visitor", email="visitor@example.com", password="visitorpassword123", is_staff=False
        )

        self.tech_python = Technology.objects.create(name="Python", slug="python", category="Languages")
        self.tech_docker = Technology.objects.create(name="Docker", slug="docker", category="DevOps")

        self.company = Company.objects.create(name="SMS DataTech", slug="sms-datatech")
        self.exp = Experience.objects.create(
            title="Software Engineer",
            company=self.company,
            start_date="Oct 2024",
            current_position=True,
        )
        self.proj = Project.objects.create(
            title="Career OS",
            summary="Backend-driven portfolio platform",
            project_type="platform",
        )

        self.published_skill = Skill.objects.create(
            name="Python Backend",
            slug="python-backend",
            category="Backend Engineering",
            proficiency="expert",
            years=3.0,
            is_core=True,
            is_published=True,
            order=1,
            description="Core language for APIs.",
            evidence_context="Built production DRF platforms.",
            target_roles=["Backend Engineering", "Platform Engineering"],
            internal_notes="Confidential interview talking points and staff notes.",
        )
        self.published_skill.technologies.add(self.tech_python)
        self.published_skill.related_experiences.add(self.exp)
        self.published_skill.related_projects.add(self.proj)

        self.draft_skill = Skill.objects.create(
            name="Rust Systems",
            slug="rust-systems",
            category="Supporting Technologies",
            proficiency="learning",
            years=0.5,
            is_core=False,
            is_published=False,
            order=99,
            description="Draft exploration of memory-safe systems programming.",
            target_roles=["Systems Engineering"],
            internal_notes="Internal skill evaluation note.",
        )

    def test_anonymous_cannot_see_unpublished_draft_in_list(self):
        response = self.client.get("/api/v1/skills/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [s["slug"] for s in results]
        self.assertIn("python-backend", slugs)
        self.assertNotIn("rust-systems", slugs)

    def test_anonymous_cannot_get_draft_detail(self):
        response = self.client.get(f"/api/v1/skills/{self.draft_skill.slug}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_receives_masked_public_data(self):
        response = self.client.get(f"/api/v1/skills/{self.published_skill.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", response.data)
        self.assertNotIn("target_roles", response.data)
        self.assertEqual(response.data["name"], "Python Backend")
        self.assertEqual(response.data["proficiency"], "expert")
        self.assertEqual(len(response.data["technologies_detail"]), 1)
        self.assertEqual(len(response.data["related_experiences_detail"]), 1)
        self.assertEqual(len(response.data["related_projects_detail"]), 1)

    def test_non_staff_mutation_forbidden(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # POST attempt
        post_res = self.client.post(
            "/api/v1/skills/",
            {"name": "Hacking", "category": "Backend Engineering"},
            format="json",
        )
        self.assertEqual(post_res.status_code, status.HTTP_403_FORBIDDEN)

        # PATCH attempt
        patch_res = self.client.patch(
            f"/api/v1/skills/{self.published_skill.slug}/",
            {"name": "Malicious Name"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_403_FORBIDDEN)

        # DELETE attempt
        del_res = self.client.delete(f"/api/v1/skills/{self.published_skill.slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_receives_unmasked_data_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/v1/skills/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [s["slug"] for s in results]
        self.assertIn("python-backend", slugs)
        self.assertIn("rust-systems", slugs)

        detail_res = self.client.get(f"/api/v1/skills/{self.published_skill.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertIn("internal_notes", detail_res.data)
        self.assertEqual(
            detail_res.data["internal_notes"],
            "Confidential interview talking points and staff notes.",
        )
        self.assertIn("target_roles", detail_res.data)
        self.assertEqual(
            detail_res.data["target_roles"],
            ["Backend Engineering", "Platform Engineering"],
        )

    def test_staff_crud_lifecycle(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create
        create_payload = {
            "name": "Cloud Networking",
            "category": "Cloud & Infrastructure",
            "proficiency": "advanced",
            "years": "2.0",
            "is_core": True,
            "is_published": True,
            "order": 10,
            "description": "VPC, Subnets, Gateways, Route Tables, and peering.",
            "evidence_context": "Configured multi-AZ VPC peering in AWS.",
            "technologies": [self.tech_docker.id],
            "related_experiences": [self.exp.id],
            "related_projects": [self.proj.id],
            "target_roles": ["Cloud Architecture"],
            "internal_notes": "Private assessment notes.",
        }
        create_res = self.client.post("/api/v1/skills/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        slug = create_res.data["slug"]
        self.assertEqual(slug, "cloud-networking")
        self.assertEqual(create_res.data["proficiency"], "advanced")
        self.assertEqual(len(create_res.data["technologies_detail"]), 1)

        # 2. Update (PATCH)
        patch_res = self.client.patch(
            f"/api/v1/skills/{slug}/",
            {"proficiency": "expert", "years": "3.5"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["proficiency"], "expert")
        self.assertEqual(float(patch_res.data["years"]), 3.5)

        # 3. Delete
        del_res = self.client.delete(f"/api/v1/skills/{slug}/")
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Skill.objects.filter(slug=slug).exists())

    def test_query_filtering(self):
        self.client.force_authenticate(user=self.admin_user)

        # Category filter
        res_cat = self.client.get("/api/v1/skills/?category=Backend+Engineering")
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        results = res_cat.data.get("results", res_cat.data)
        for s in results:
            self.assertEqual(s["category"], "Backend Engineering")

        # is_core filter
        res_core = self.client.get("/api/v1/skills/?is_core=true")
        self.assertEqual(res_core.status_code, status.HTTP_200_OK)
        results = res_core.data.get("results", res_core.data)
        for s in results:
            self.assertTrue(s["is_core"])

        # proficiency filter
        res_prof = self.client.get("/api/v1/skills/?proficiency=expert")
        self.assertEqual(res_prof.status_code, status.HTTP_200_OK)
        results = res_prof.data.get("results", res_prof.data)
        for s in results:
            self.assertEqual(s["proficiency"], "expert")
