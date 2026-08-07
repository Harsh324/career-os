from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.serializers import UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """Obtain JWT access and refresh token pair."""

class CustomTokenRefreshView(TokenRefreshView):
    """Refresh JWT access token."""

class MeView(APIView):
    """Return currently authenticated user info."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
