from django.http import StreamingHttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.renderers import BaseRenderer, BrowsableAPIRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from apps.ai_assistant.services import (
    get_ai_assistant_reply,
    stream_ai_assistant_reply,
)


class EventStreamRenderer(BaseRenderer):
    media_type = "text/event-stream"
    format = "sse"
    charset = "utf-8"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


class AIChatRateThrottle(AnonRateThrottle):
    scope = "ai_chat"
    rate = "30/min"


class ChatAssistantView(APIView):
    """
    POST /api/v1/assistant/chat/
    Public API endpoint allowing visitors to query Harsh's AI portfolio assistant.
    Supports both standard JSON and real-time Server-Sent Events (SSE) streaming.
    """

    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer, EventStreamRenderer, BrowsableAPIRenderer]
    throttle_classes = [AIChatRateThrottle]

    def perform_content_negotiation(self, request, force=False):
        if "text/event-stream" in request.headers.get("Accept", ""):
            return (EventStreamRenderer(), "text/event-stream")
        return super().perform_content_negotiation(request, force)

    def post(self, request, *args, **kwargs):
        data = request.data
        messages = data.get("messages")
        message = data.get("message")
        stream_requested = bool(data.get("stream", False))

        payload = messages if messages else message
        if not payload:
            return Response(
                {"error": "Either 'message' string or 'messages' array is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if stream_requested or "text/event-stream" in request.headers.get("Accept", ""):
            try:
                response = StreamingHttpResponse(
                    stream_ai_assistant_reply(payload),
                    content_type="text/event-stream",
                )
                response["Cache-Control"] = "no-cache"
                response["X-Accel-Buffering"] = "no"
                return response
            except Exception as e:
                return Response(
                    {"error": "Failed to initialize streaming.", "details": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        try:
            result = get_ai_assistant_reply(payload)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to process chat query.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
