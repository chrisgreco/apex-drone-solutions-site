import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Apex Drone Solutions privacy policy.",
};

export default function PrivacyPage() {
  return (
    <section className="section bg-white">
      <div className="container-narrow mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-neutral max-w-none text-neutral-600 leading-relaxed space-y-4 text-sm">
          <p><strong>Effective Date:</strong> January 1, 2026</p>
          <p>
            Apex Drone Solutions (&quot;Apex,&quot; &quot;we,&quot; &quot;our&quot;) is committed to protecting
            the privacy of our clients, pilots, and website visitors. This policy describes how we collect,
            use, and protect personal information.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name, email address, phone number,
            company name, and location when you submit a contact form, pilot application, or service request.
            We also collect technical information such as IP address, browser type, and usage data through
            standard web analytics.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">How We Use Information</h2>
          <p>
            We use the information we collect to respond to inquiries, process service requests,
            manage our pilot network, improve our services, and communicate with you about our products
            and services. We do not sell personal information to third parties.
          </p>
          <h2 className="text-lg font-semibold text-primary-900 mt-8 mb-2">Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us at info@apexdronesolns.com.
          </p>
        </div>
      </div>
    </section>
  );
}
