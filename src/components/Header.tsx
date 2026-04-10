"use client";

import Link from "next/link";
import { LogoFull } from "./Logo";
import { useState } from "react";
import { IconPhone } from "./Icons";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/equipment", label: "Equipment" },
  { href: "/coverage", label: "Coverage Area" },
  { href: "/roi-calculator", label: "ROI Calculator" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-950/95 backdrop-blur-sm border-b border-accent-500/10">
      <div className="container-narrow mx-auto flex items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="AG Drones NJ home">
          <LogoFull />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.8125rem] font-medium text-white/60 hover:text-accent-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+1-555-AG-DRONE"
            className="hidden xl:inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-accent-400/70 hover:text-accent-400 transition-colors font-mono"
          >
            <IconPhone className="w-3.5 h-3.5" />
            (555) AG-DRONE
          </a>
          <Link href="/contact" className="btn-primary text-sm !py-2 !px-5">
            Get a Free Quote
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 -mr-2 text-white/60"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-accent-500/10 bg-primary-950" aria-label="Mobile navigation">
          <div className="container-narrow mx-auto px-5 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/70 py-2 hover:text-accent-400"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+1-555-AG-DRONE"
              className="flex items-center gap-2 text-sm font-medium text-accent-400/70 py-2 font-mono"
            >
              <IconPhone className="w-4 h-4" />
              (555) AG-DRONE
            </a>
            <Link href="/contact" className="btn-primary text-sm mt-2" onClick={() => setMobileOpen(false)}>
              Get a Free Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
