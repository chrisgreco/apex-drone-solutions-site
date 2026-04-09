import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AG Drones NJ privacy policy.",
};

export default function PrivacyPage() {
  return (
    <section className="section bg-primary-950">
      <div className="container-narrow mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-400 mb-3 font-mono">// Privacy Policy</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Privacy Policy</h1>
        <div className="max-w-none text-white/60 leading-relaxed space-y-4 text-sm">
          <p><span className="text-accent-400 font-mono text-xs">EFFECTIVE_DATE:</span> <span className="text-white/80">January 1, 2026</span></p>
          <p>
            AG Drones NJ (&quot;AG Drones,&quot; &quot;we,&quot; &quot;our&quot;) is committed to protecting
            the privacy of our clients, pilots, and website visitors. This policy describes how we collect,
            use, and protect personal information.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name, email address, phone number,
            company name, farm information, and location when you submit a quote request, service inquiry, or job application.
            We also collect technical information such as IP address, browser type, and usage data through
            standard web analytics.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">How We Use Information</h2>
          <p>
            We use the information we collect to respond to inquiries, process service requests,
            schedule agricultural drone operations, manage our team, improve our services, and communicate
            with you about our agricultural drone services. We do not sell personal information to third parties.
          </p>
          <h2 className="text-lg font-semibold text-white mt-8 mb-2">Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us at{" "}
            <a href="mailto:info@agdronesnj.com" className="text-accent-400 hover:text-accent-300">info@agdronesnj.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
