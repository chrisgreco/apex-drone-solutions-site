import Link from "next/link";
import { LogoFull } from "./Logo";

const footerLinks = {
  Solutions: [
    { href: "/insurance-claims", label: "Insurance & Claims" },
    { href: "/roofing-restoration", label: "Roofing & Restoration" },
    { href: "/how-it-works", label: "How It Works" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/become-a-pilot", label: "Become a Pilot" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-300">
      <div className="container-narrow mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="[&_span]:!text-white">
              <LogoFull />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-400 max-w-xs">
              Drone-powered property condition documentation for insurance and roofing professionals. Faster data, safer operations, better outcomes.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-primary-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-500">
            &copy; {new Date().getFullYear()} Apex Drone Solutions. All rights reserved.
          </p>
          <p className="text-xs text-primary-600">
            Powered by Apex Drone Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
