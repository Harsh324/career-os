from django.urls import path
from apps.accounts.views import CustomTokenObtainPairView, CustomTokenRefreshView, MeView

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="user_me"),
]
