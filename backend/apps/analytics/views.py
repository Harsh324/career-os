import hashlib

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import EventLog, VisitorSession
from .serializers import AnalyticsEventCreateSerializer


def parse_user_agent(ua_string: str):
    ua = ua_string.lower()
    device = "desktop"
    if "mobile" in ua or "android" in ua or "iphone" in ua:
        device = "mobile"
    elif "tablet" in ua or "ipad" in ua:
        device = "tablet"

    browser = "Other"
    if "chrome" in ua and "edg" not in ua:
        browser = "Chrome"
    elif "safari" in ua and "chrome" not in ua:
        browser = "Safari font"
    elif "firefox" in ua:
        browser = "Firefox"
    elif "edg" in ua:
        browser = "Edge"

    os_name = "Other"
    if "mac os" in ua or "macintosh" in ua:
        os_name = "macOS"
    elif "windows" in ua:
        os_name = "Windows"
    elif "linux" in ua:
        os_name = "Linux"
    elif "iphone" in ua or "ipad" in ua:
        os_name = "iOS"
    elif "android" in ua:
        os_name = "Android"

    return device, browser, os_name


class AnalyticsEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = AnalyticsEventCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        session_key = data["session_key"]
        event_type = data["event_type"]
        path = data["path"]
        event_target = data.get("event_target", "")
        event_data = data.get("event_data", {})
        referrer = data.get("referrer", "")
        ref_code = data.get("ref_code", "")

        # Extract Client Meta
        raw_ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", ""))
        ip_hash = hashlib.sha256(raw_ip.encode("utf-8")).hexdigest()[:16] if raw_ip else ""
        user_agent = request.META.get("HTTP_USER_AGENT", "")
        device_type, browser, os_name = parse_user_agent(user_agent)
        country = request.META.get("HTTP_CF_IPCOUNTRY", "Unknown")

        # Get or Create Session
        session, created = VisitorSession.objects.get_or_create(
            session_key=session_key,
            defaults={
                "ip_hash": ip_hash,
                "user_agent": user_agent,
                "device_type": device_type,
                "browser": browser,
                "os_name": os_name,
                "country": country,
                "referrer": referrer,
                "ref_code": ref_code,
                "page_view_count": 1,
            },
        )

        if not created:
            if event_type == "page_view":
                session.page_view_count += 1
            if ref_code and not session.ref_code:
                session.ref_code = ref_code
            if referrer and not session.referrer:
                session.referrer = referrer
            session.save(update_fields=["page_view_count", "ref_code", "referrer", "last_seen"])

        # Log Event
        EventLog.objects.create(
            session=session,
            event_type=event_type,
            path=path,
            event_target=event_target,
            event_data=event_data,
        )

        return Response({"status": "recorded", "session_id": str(session.id)}, status=status.HTTP_201_CREATED)
