"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TopBar({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/app/login");
  }

  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-700">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden sm:inline">{userName || "User"}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
