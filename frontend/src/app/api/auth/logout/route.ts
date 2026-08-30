import { cookies } from "next/headers";
import { getBaseURL } from "@/lib/api/client";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("career_os_refresh_token");

    // Attempt backend logout notification if auth header is present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      try {
        await fetch(`${getBaseURL()}/auth/logout/`, {
          method: "POST",
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        // Silent catch for backend logout notification
      }
    }

    return Response.json({ message: "Successfully logged out." });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to log out." },
      { status: 500 }
    );
  }
}
