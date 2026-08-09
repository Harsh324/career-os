from django.urls import path

from .views import AnalyticsEventView

urlpatterns = [
    path("event/", AnalyticsEventView.as_view(), name="analytics-event"),
]
