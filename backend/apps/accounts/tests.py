from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.username = "testadmin"
        self.password = "secure_password_123!"
        self.email = "admin@career-os.dev"
        self.user = User.objects.create_superuser(
            username=self.username,
            email=self.email,
            password=self.password,
        )
        self.token_url = reverse("v1:token_obtain_pair")
        self.refresh_url = reverse("v1:token_refresh")
        self.me_url = reverse("v1:user_me")
        self.logout_url = reverse("v1:user_logout")
        self.stats_url = reverse("v1:dashboard_stats")

    def test_valid_login_returns_tokens(self):
        response = self.client.post(
            self.token_url,
            {"username": self.username, "password": self.password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_invalid_credentials_rejected(self):
        response = self.client.post(
            self.token_url,
            {"username": self.username, "password": "wrong_password"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        login_res = self.client.post(
            self.token_url,
            {"username": self.username, "password": self.password},
            format="json",
        )
        refresh_token = login_res.data["refresh"]

        refresh_res = self.client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_res.data)

    def test_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], self.username)
        self.assertEqual(response.data["email"], self.email)
        self.assertTrue(response.data["is_superuser"])

    def test_me_unauthenticated_rejected(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_dashboard_stats_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["system_status"], "operational")
        self.assertIn("counts", response.data)
        self.assertIn("experiences", response.data["counts"])
        self.assertIn("projects", response.data["counts"])
        self.assertIn("skills", response.data["counts"])
        self.assertIn("certifications", response.data["counts"])
        self.assertIn("timeline_events", response.data["counts"])

    def test_dashboard_stats_unauthenticated_rejected(self):
        response = self.client.get(self.stats_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
