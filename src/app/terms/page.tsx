import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AG Drones NJ terms of service.",
};

export default function TermsPage() {
  return (
    <section className="section bg-primary-950">
      <div className="container-narrow mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">// Terms of Service</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Terms of Service</h1>
        <div className="max-w-none text-white/60 leading-relaxed space-y-4 text-sm">
          <p><span className="text-accent-400 font-mono text-xs">EFFECTIVE_DATE:</span> <span className="text-white/80">January 1, 2026</span></p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the AG Drones NJ
            website and services. By using our website or engaging our services, you agree to these Terms.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">Services</h2>
          <p>
            AG Drones NJ provides professional agricultural drone services,
            including precision crop spraying, cover crop seeding, NDVI field mapping, and pest detection.
            All operations are conducted under FAA Part 137 certification with licensed pesticide applicators.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">Limitation of Liability</h2>
          <p>
            AG Drones NJ provides agricultural drone application services on an &quot;as is&quot;
            basis. While we apply products per manufacturer and agronomist specifications, we are not
            responsible for crop outcomes, weather-related impacts, or product efficacy. All chemical
            applications are performed by licensed pesticide applicators.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions about these Terms should be directed to{" "}
            <a href="mailto:info@agdronesnj.com" className="text-accent-400 hover:text-accent-300">info@agdronesnj.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
