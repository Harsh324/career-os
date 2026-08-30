"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams ? searchParams.get("from") || "/dashboard" : "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      router.push(fromUrl);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Access is restricted to the system administrator.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-7 shadow-2xl shadow-black/60 relative backdrop-blur-sm">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-snug">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2" htmlFor="username">
            Admin Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
              <User className="w-4 h-4" />
            </div>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2" htmlFor="password">
            Admin Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8b949e]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isSubmitting}
              className="w-full pl-10 pr-11 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-xl text-white text-sm placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8b949e] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#238636]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2ea043]/40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Access Control Plane</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default function DashboardLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-[#c9d1d9] px-4 py-12 selection:bg-[#58a6ff]/30 selection:text-[#58a6ff]">
      <div className="w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl shadow-black/40 mb-4 text-[#58a6ff]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Career OS <span className="text-xs uppercase px-2 py-0.5 rounded-full font-mono bg-[#21262d] border border-[#30363d] text-[#58a6ff]">Control Plane</span>
          </h1>
          <p className="text-sm text-[#8b949e] mt-2">
            Private administrative control plane for career data management
          </p>
        </div>

        {/* Login Card inside Suspense boundary */}
        <Suspense
          fallback={
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-7 flex items-center justify-center min-h-[300px]">
              <Loader2 className="w-6 h-6 animate-spin text-[#58a6ff]" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Return to Public Site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#58a6ff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-[#484f58] font-mono">
            Authorized Administrator Access Only • Career OS v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
