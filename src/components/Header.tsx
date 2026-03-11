"use client";

import Link from "next/link";
import { LogoFull } from "./Logo";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/insurance-claims", label: "Insurance & Claims" },
  { href: "/roofing-restoration", label: "Roofing & Restoration" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/become-a-pilot", label: "Become a Pilot" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="container-narrow mx-auto flex items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="Apex Drone Solutions home">
          <LogoFull />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.8125rem] font-medium text-neutral-600 hover:text-primary-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/app/login"
            className="text-[0.8125rem] font-medium text-accent-600 hover:text-accent-700 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/contact" className="btn-primary text-sm !py-2 !px-5">
            Talk to Sales
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 -mr-2 text-neutral-600"
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
        <nav className="lg:hidden border-t border-neutral-100 bg-white" aria-label="Mobile navigation">
          <div className="container-narrow mx-auto px-5 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-700 py-2 hover:text-primary-900"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/app/login"
              className="text-sm font-medium text-accent-600 py-2 hover:text-accent-700"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link href="/contact" className="btn-primary text-sm mt-2" onClick={() => setMobileOpen(false)}>
              Talk to Sales
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
