from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.ai_assistant.services import get_ai_assistant_reply


class ChatAssistantView(APIView):
    """
    POST /api/v1/assistant/chat/
    Public API endpoint allowing visitors to query Harsh's AI portfolio assistant.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"error": "Message body is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = get_ai_assistant_reply(message)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Failed to process chat query.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
