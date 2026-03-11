"use client";

import { createClient } from "@/lib/supabase/client";
import { LogoFull } from "@/components/Logo";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/app/dashboard";

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError("Check your email for a confirmation link.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/">
            <LogoFull className="h-8 mx-auto" />
          </Link>
          <p className="mt-3 text-sm text-white/50">
            {mode === "login" ? "Sign in to the platform" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-xl space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            />
          </div>

          {error && (
            <p className={`text-sm ${error.includes("Check your email") ? "text-success-500" : "text-red-600"}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <p className="text-center text-sm text-neutral-500">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button type="button" onClick={() => setMode("signup")} className="text-accent-600 font-medium">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-accent-600 font-medium">
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
