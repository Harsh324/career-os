from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.projects.models import Project
from apps.technologies.models import Technology

User = get_user_model()


class ProjectModelTests(TestCase):
    def test_auto_slug_generation(self):
        project = Project.objects.create(
            title="Auto Slug Project",
            summary="A test project for automatic slug generation.",
            project_type="application",
            status="active",
        )
        self.assertEqual(project.slug, "auto-slug-project")

    def test_project_ordering(self):
        p1 = Project.objects.create(title="P1", summary="s1", order=2, featured=False)
        p2 = Project.objects.create(title="P2", summary="s2", order=1, featured=True)
        p3 = Project.objects.create(title="P3", summary="s3", order=1, featured=False)
        projects = list(Project.objects.filter(id__in=[p1.id, p2.id, p3.id]))
        self.assertEqual(projects[0].id, p2.id)
        self.assertEqual(projects[1].id, p3.id)
        self.assertEqual(projects[2].id, p1.id)


class ProjectAPITests(TestCase):
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
        self.tech_docker = Technology.objects.create(
            name="Docker", slug="docker", category="DevOps"
        )
        self.tech_python = Technology.objects.create(
            name="Python", slug="python", category="Languages"
        )

        self.published_project = Project.objects.create(
            title="Published Public Project",
            slug="published-public-project",
            project_type="infrastructure",
            status="active",
            is_published=True,
            featured=True,
            order=1,
            timeline="2026 – Present",
            summary="Public project summary.",
            description="Detailed technical description.",
            problem="Exposing open ports.",
            solution="Zero-trust tunnel routing.",
            technical_outcome="Zero attack surface.",
            repository="https://github.com/example/repo",
            demo="https://demo.example.com",
            architecture_flow=[{"step": 1, "title": "Ingress", "detail": "Cloudflare Tunnel"}],
            key_features=[{"title": "Feature 1", "desc": "Description 1"}],
            highlights=[
                {
                    "id": "ach-1",
                    "text": "Public project highlight",
                    "is_public": True,
                    "target_roles": ["DevOps"],
                    "order": 0,
                },
                {
                    "id": "ach-2",
                    "text": "Private internal highlight",
                    "is_public": False,
                    "target_roles": ["DevOps"],
                    "order": 1,
                },
            ],
            target_roles=["DevOps", "Platform Engineering"],
            internal_notes="Confidential architecture trade-offs and benchmark numbers.",
        )
        self.published_project.tech_stack.add(self.tech_docker, self.tech_python)

        self.draft_project = Project.objects.create(
            title="Unpublished Draft Project",
            slug="unpublished-draft-project",
            project_type="experiment",
            status="in_development",
            is_published=False,
            summary="Draft project summary not for public eyes.",
        )

    def test_anonymous_user_cannot_view_draft_projects(self):
        response = self.client.get("/api/v1/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [p["slug"] for p in results]
        self.assertIn(self.published_project.slug, slugs)
        self.assertNotIn(self.draft_project.slug, slugs)

        # Direct slug request to draft project returns 404
        draft_res = self.client.get(f"/api/v1/projects/{self.draft_project.slug}/")
        self.assertEqual(draft_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_data_masking(self):
        response = self.client.get(f"/api/v1/projects/{self.published_project.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Private fields stripped
        self.assertNotIn("internal_notes", response.data)
        self.assertNotIn("target_roles", response.data)

        # Highlights filtered
        highlights = response.data.get("highlights", [])
        self.assertEqual(len(highlights), 1)
        self.assertEqual(highlights[0]["text"], "Public project highlight")

    def test_authenticated_non_staff_user_cannot_mutate_projects(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # POST -> 403
        res_post = self.client.post(
            "/api/v1/projects/",
            {"title": "Unauthorized Project", "summary": "test"},
            format="json",
        )
        self.assertEqual(res_post.status_code, status.HTTP_403_FORBIDDEN)

        # PATCH -> 403
        res_patch = self.client.patch(
            f"/api/v1/projects/{self.published_project.slug}/",
            {"title": "Hacked Title"},
            format="json",
        )
        self.assertEqual(res_patch.status_code, status.HTTP_403_FORBIDDEN)

        # DELETE -> 403
        res_delete = self.client.delete(f"/api/v1/projects/{self.published_project.slug}/")
        self.assertEqual(res_delete.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_non_staff_user_receives_masked_data_and_no_drafts(self):
        self.client.force_authenticate(user=self.non_staff_user)

        # Drafts not in list
        res_list = self.client.get("/api/v1/projects/")
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        results = res_list.data.get("results", res_list.data)
        slugs = [p["slug"] for p in results]
        self.assertIn(self.published_project.slug, slugs)
        self.assertNotIn(self.draft_project.slug, slugs)

        # Draft slug returns 404
        res_draft = self.client.get(f"/api/v1/projects/{self.draft_project.slug}/")
        self.assertEqual(res_draft.status_code, status.HTTP_404_NOT_FOUND)

        # Data is masked
        res_detail = self.client.get(f"/api/v1/projects/{self.published_project.slug}/")
        self.assertEqual(res_detail.status_code, status.HTTP_200_OK)
        self.assertNotIn("internal_notes", res_detail.data)
        self.assertNotIn("target_roles", res_detail.data)
        highlights = res_detail.data.get("highlights", [])
        self.assertEqual(len(highlights), 1)

    def test_authenticated_admin_receives_all_fields_and_drafts(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get("/api/v1/projects/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get("results", response.data)
        slugs = [p["slug"] for p in results]
        self.assertIn(self.published_project.slug, slugs)
        self.assertIn(self.draft_project.slug, slugs)

        # Admin detail view includes private fields and highlights
        detail_res = self.client.get(f"/api/v1/projects/{self.published_project.slug}/")
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            detail_res.data["internal_notes"],
            "Confidential architecture trade-offs and benchmark numbers.",
        )
        self.assertEqual(detail_res.data["target_roles"], ["DevOps", "Platform Engineering"])
        self.assertEqual(len(detail_res.data["highlights"]), 2)

    def test_authenticated_admin_crud_workflow(self):
        self.client.force_authenticate(user=self.admin_user)

        # 1. Create Project
        create_payload = {
            "title": "New Distributed Cache",
            "project_type": "platform",
            "status": "in_development",
            "is_published": True,
            "featured": True,
            "order": 5,
            "timeline": "2026",
            "summary": "In-memory caching engine.",
            "description": "Built in Go/Python.",
            "problem": "High DB latency.",
            "solution": "Cluster-aware LRU cache.",
            "technical_outcome": "90% cache hit ratio.",
            "repository": "https://github.com/example/cache",
            "demo": "",
            "docs_url": "https://docs.example.com",
            "tech_stack": [self.tech_python.id],
            "architecture_flow": [{"step": 1, "title": "Client", "detail": "TCP stream"}],
            "key_features": [{"title": "LRU Eviction", "desc": "Constant time O(1) eviction"}],
            "highlights": [
                {
                    "id": "ach-cache-1",
                    "text": "Engineered cluster-aware caching engine.",
                    "is_public": True,
                    "target_roles": ["Backend Engineering"],
                    "order": 0,
                }
            ],
            "target_roles": ["Backend Engineering", "Systems Engineering"],
            "internal_notes": "Benchmark results: 50k req/sec on single core.",
        }
        create_res = self.client.post("/api/v1/projects/", create_payload, format="json")
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        new_slug = create_res.data["slug"]
        self.assertEqual(new_slug, "new-distributed-cache")

        # 2. Update Project
        patch_res = self.client.patch(
            f"/api/v1/projects/{new_slug}/",
            {"status": "deployed", "demo": "https://cache.example.com"},
            format="json",
        )
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data["status"], "deployed")
        self.assertEqual(patch_res.data["demo"], "https://cache.example.com")

        # 3. Delete Project
        delete_res = self.client.delete(f"/api/v1/projects/{new_slug}/")
        self.assertEqual(delete_res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(slug=new_slug).exists())
