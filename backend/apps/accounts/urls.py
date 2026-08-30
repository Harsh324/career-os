from django.urls import path

from apps.accounts.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    DashboardOverviewStatsView,
    LogoutView,
    MeView,
)

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="user_me"),
    path("logout/", LogoutView.as_view(), name="user_logout"),
    path("stats/", DashboardOverviewStatsView.as_view(), name="dashboard_stats"),
]
