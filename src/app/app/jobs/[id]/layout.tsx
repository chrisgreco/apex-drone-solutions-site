"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", segment: "" },
  { label: "Map", segment: "/map" },
  { label: "Flight Plan", segment: "/flight-plan" },
  { label: "Upload", segment: "/upload" },
  { label: "Analysis", segment: "/analysis" },
  { label: "Measurements", segment: "/measurements" },
  { label: "Report", segment: "/report" },
];

export default function JobDetailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const basePath = `/app/jobs/${params.id}`;

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-neutral-200 bg-white px-6 overflow-x-auto">
        <nav className="flex gap-1 -mb-px min-w-max">
          {tabs.map((tab) => {
            const href = basePath + tab.segment;
            const isActive = tab.segment === ""
              ? pathname === basePath
              : pathname.startsWith(href);

            return (
              <Link
                key={tab.segment}
                href={href}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
