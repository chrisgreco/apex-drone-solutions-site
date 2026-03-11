"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar userName={userName} />
        <main className="flex-1 bg-neutral-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
