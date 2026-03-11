"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ElevenLabsWidget } from "./ElevenLabsWidget";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlatform = pathname.startsWith("/app");

  if (isPlatform) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ElevenLabsWidget />
    </>
  );
}
