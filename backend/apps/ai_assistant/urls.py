from django.urls import path

from apps.ai_assistant.views import ChatAssistantView

urlpatterns = [
    path("chat/", ChatAssistantView.as_view(), name="ai-chat"),
]
