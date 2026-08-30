"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AdminUser,
  setAdminToken,
  refreshAdminSession,
} from "@/lib/api/admin-client";

interface AuthContextType {
  user: AdminUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const handleSetToken = useCallback((token: string | null) => {
    setAccessTokenState(token);
    setAdminToken(token);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const data = await refreshAdminSession();
      if (data && data.access) {
        handleSetToken(data.access);
        if (data.user) {
          setUser(data.user);
        }
        return true;
      }
      handleSetToken(null);
      setUser(null);
      return false;
    } catch {
      handleSetToken(null);
      setUser(null);
      return false;
    }
  }, [handleSetToken]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed.");
      }

      const data = await res.json();
      handleSetToken(data.access);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
          "Content-Type": "application/json",
        },
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      handleSetToken(null);
      setUser(null);
      setIsLoading(false);
      router.push("/dashboard/login");
    }
  };

  // Initial silent authentication check on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      await refreshSession();
      if (isMounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    const handleUnauthorized = () => {
      handleSetToken(null);
      setUser(null);
      router.push("/dashboard/login");
    };

    window.addEventListener("career-os:unauthorized", handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener("career-os:unauthorized", handleUnauthorized);
    };
  }, [refreshSession, handleSetToken, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
