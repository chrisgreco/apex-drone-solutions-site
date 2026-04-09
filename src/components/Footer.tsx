import Link from "next/link";
import { LogoFull } from "./Logo";
import { IconPhone, IconMail, IconMapPin } from "./Icons";

const footerLinks = {
  Services: [
    { href: "/services", label: "Crop Spraying" },
    { href: "/services#seeding", label: "Cover Crop Seeding" },
    { href: "/services#mapping", label: "Field Mapping & NDVI" },
    { href: "/services#pest-detection", label: "Pest & Disease Detection" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/equipment", label: "Our Equipment" },
    { href: "/results", label: "Results & Case Studies" },
    { href: "/careers", label: "Join Our Team" },
  ],
  Resources: [
    { href: "/roi-calculator", label: "ROI Calculator" },
    { href: "/coverage", label: "Coverage Area" },
    { href: "/contact", label: "Get a Quote" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-300">
      <div className="container-narrow mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <LogoFull />
            <p className="mt-4 text-sm leading-relaxed text-primary-400 max-w-sm">
              Next-generation agricultural drone technology for New Jersey farms.
              FAA Part 137 certified. 3D mapping, precision spraying, and NDVI analytics.
            </p>
            <div className="mt-6 space-y-3">
              <a href="tel:+1-555-AG-DRONE" className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-white transition-colors">
                <IconPhone className="w-4 h-4 text-accent-400" />
                (555) AG-DRONE
              </a>
              <a href="mailto:info@agdronesnj.com" className="flex items-center gap-2.5 text-sm text-primary-400 hover:text-white transition-colors">
                <IconMail className="w-4 h-4 text-accent-400" />
                info@agdronesnj.com
              </a>
              <div className="flex items-center gap-2.5 text-sm text-primary-400">
                <IconMapPin className="w-4 h-4 text-accent-400" />
                South Jersey, NJ
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-white mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
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

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {[
              "FAA Part 107 Certified",
              "FAA Part 137 Licensed",
              "NJ Pesticide Applicator",
              "Commercially Insured",
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-700 bg-primary-900/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-primary-300">{badge}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-500">
              &copy; {new Date().getFullYear()} AG Drones NJ. All rights reserved.
            </p>
            <p className="text-xs text-primary-600">
              Next-Gen Precision Agriculture
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
