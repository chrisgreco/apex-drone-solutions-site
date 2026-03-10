import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Apex Drone Solutions terms of service.",
};

export default function TermsPage() {
  return (
    <section className="section bg-white">
      <div className="container-narrow mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">Terms of Service</h1>
        <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed space-y-4 text-sm">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the Apex Drone Solutions
            website and services. By using our website or engaging our services, you agree to these Terms.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">Services</h2>
          <p>
            Apex Drone Solutions provides drone-powered property condition documentation services,
            including aerial imagery, 3D modeling, damage annotation, and automated report generation.
            Our services produce documentation records, not formal engineering or insurance inspections.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">Limitation of Liability</h2>
          <p>
            Apex Drone Solutions provides property condition documentation services on an &quot;as is&quot;
            basis. Our reports are documentation tools and are not intended to replace professional
            engineering assessments, formal inspections, or licensed adjuster evaluations.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">Contact</h2>
          <p>
            Questions about these Terms should be directed to info@apexdronesolns.com.
          </p>
        </div>
      </div>
    </section>
  );
}
