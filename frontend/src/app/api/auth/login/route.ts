import { cookies } from "next/headers";
import { getBaseURL } from "@/lib/api/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const backendUrl = `${getBaseURL()}/auth/token/`;
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return Response.json(
        { error: errorData.detail || "Invalid credentials." },
        { status: res.status }
      );
    }

    const data = await res.json();
    const { access, refresh } = data;

    // Fetch user details using access token
    const meRes = await fetch(`${getBaseURL()}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    let user = null;
    if (meRes.ok) {
      user = await meRes.json();
    }

    // Set secure HttpOnly refresh token cookie
    const cookieStore = await cookies();
    cookieStore.set("career_os_refresh_token", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return Response.json({
      access,
      user,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Authentication service error." },
      { status: 500 }
    );
  }
}
