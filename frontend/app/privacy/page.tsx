import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - RetentionHealth",
  description: "Privacy Policy for RetentionHealth retention infrastructure platform.",
};

export default function Privacy() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <p className="text-sm text-gray-600 mb-12">
          Last Updated: March 2025
        </p>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Overview
            </h2>
            <p className="mb-4">
              RetentionHealth (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides revenue stabilization infrastructure for subscription-based healthcare programs.
            </p>
            <p className="mb-4">
              This Privacy Policy explains how information is collected, used, and protected in connection with the RetentionHealth platform.
            </p>
            <p className="mb-4">
              The current 8-week pilot program is intentionally designed to avoid handling Protected Health Information (PHI).
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="mb-4">
              We collect limited information necessary to operate the platform.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinic-Level Information</h3>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Clinic business name</li>
              <li>Primary contact name</li>
              <li>Contact email and phone number</li>
              <li>Account credentials</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Operational Usage Data</h3>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Platform engagement metrics</li>
              <li>Aggregated stabilization measurements</li>
              <li>Dashboard interaction data</li>
              <li>Technical analytics</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Information</h3>
            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Log data necessary for security and performance</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Information We Do Not Collect During Pilot
            </h2>
            <p className="mb-4">
              During the pilot phase, RetentionHealth does not:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Collect patient names</li>
              <li>Collect patient contact information</li>
              <li>Collect medical record numbers</li>
              <li>Access or integrate with EMR systems</li>
              <li>Store Protected Health Information (PHI)</li>
              <li>Create identifiable patient profiles</li>
            </ul>
            <p className="mb-4">
              Behavioral inputs entered into the system during pilot are not associated with identifiable individuals and are not stored as longitudinal medical records.
            </p>
            <p className="mb-4">
              All pilot measurement is performed at an aggregated group level.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How We Use Information
            </h2>
            <p className="mb-4">
              Information collected is used to:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Operate and maintain the stabilization platform</li>
              <li>Generate reinforcement messaging within active sessions</li>
              <li>Provide aggregated analytics and retention metrics to clinic partners</li>
              <li>Improve platform functionality and performance</li>
              <li>Communicate with clinic partners regarding service delivery</li>
            </ul>
            <p className="mb-4">
              We do not use collected information for advertising or marketing resale.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Minimization Principles
            </h2>
            <p className="mb-4">
              RetentionHealth is architected to reduce legal and data exposure risk.
            </p>
            <p className="mb-4">
              The platform does not:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Replace clinical systems</li>
              <li>Provide medical decision-making</li>
              <li>Modify prescribed medication protocols</li>
              <li>Store identifiable patient health records during pilot</li>
            </ul>
            <p className="mb-4">
              Clinic partners retain full clinical responsibility and oversight.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="mb-4">
              We implement security measures designed to protect operational data, including:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-6">
              <li>Encrypted transmission using TLS</li>
              <li>Hosting on Cloudflare&apos;s secure global network</li>
              <li>Application-layer isolation between clinic environments</li>
              <li>Role-based access controls</li>
              <li>Restricted administrative access</li>
            </ul>
            <p className="mb-4">
              Security architecture is designed to minimize stored data and reduce exposure surface area.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Retention
            </h2>
            <p className="mb-4">
              Operational data is retained only as long as necessary to provide services to clinic partners.
            </p>
            <p className="mb-4">
              Clinic partners may request deletion of their account and associated operational data upon termination of services, subject to legal and operational requirements.
            </p>
            <p className="mb-4">
              Because the pilot does not collect PHI, no medical record retention applies during pilot participation.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Third-Party Infrastructure
            </h2>
            <p className="mb-4">
              RetentionHealth is hosted on Cloudflare infrastructure.
            </p>
            <p className="mb-4">
              We do not sell, rent, or share data with third-party advertising or marketing networks.
            </p>
            <p className="mb-4">
              We do not monetize data.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Clinic Partner Responsibilities
            </h2>
            <p className="mb-4">
              Clinic partners deploying RetentionHealth are responsible for:
            </p>
            <ul className="list-disc ml-6 space-y-2 mb-4">
              <li>Obtaining appropriate consents from their patients</li>
              <li>Maintaining compliance with applicable healthcare regulations</li>
              <li>Providing required privacy disclosures to end users</li>
              <li>Maintaining clinical oversight of patient care</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="mb-4">
              Depending on jurisdiction, individuals may have rights regarding personal information, including access, correction, or deletion.
            </p>
            <p className="mb-4">
              Requests may be submitted to the contact email below.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy periodically.
            </p>
            <p className="mb-4">
              Material changes will be communicated to clinic partners via email or platform notification.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact
            </h2>
            <p className="mb-2">
              For privacy-related questions:
            </p>
            <p className="mb-4">
              Email:{" "}
              <a 
                href="mailto:contact@retentionhealth.com?subject=Privacy Inquiry"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                contact@retentionhealth.com
              </a>
            </p>
            <p className="mb-2">
              Address:
            </p>
            <p>
              302 Arapahoe Ave<br />
              Boulder, CO 80302
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
