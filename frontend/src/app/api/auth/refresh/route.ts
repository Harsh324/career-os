import { cookies } from "next/headers";
import { getBaseURL } from "@/lib/api/client";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("career_os_refresh_token")?.value;

    if (!refreshToken) {
      return Response.json(
        { error: "No refresh token provided." },
        { status: 401 }
      );
    }

    const backendUrl = `${getBaseURL()}/auth/token/refresh/`;
    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      // Invalid/expired refresh token, clear cookie
      cookieStore.delete("career_os_refresh_token");
      return Response.json(
        { error: "Refresh token expired or invalid." },
        { status: 401 }
      );
    }

    const data = await res.json();
    const { access, refresh: newRefresh } = data;

    if (newRefresh) {
      cookieStore.set("career_os_refresh_token", newRefresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Also fetch user details if needed
    const meRes = await fetch(`${getBaseURL()}/auth/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    let user = null;
    if (meRes.ok) {
      user = await meRes.json();
    }

    return Response.json({
      access,
      user,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to refresh token." },
      { status: 500 }
    );
  }
}
