import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Data Architecture - RetentionHealth",
  description: "Security and data architecture information for RetentionHealth's retention infrastructure platform.",
};

export default function Security() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Security & Compliance Overview
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          RetentionHealth is designed as lightweight revenue stabilization infrastructure for subscription-based healthcare programs.
        </p>
        
        <p className="text-gray-700 mb-12">
          Security, simplicity, and minimal data exposure are core design principles.
        </p>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pilot Phase Data Design
            </h2>
            
            <p className="text-gray-700 mb-6">
              The 8-week pilot program is intentionally structured to avoid handling Protected Health Information (PHI).
            </p>
            
            <p className="text-gray-700 mb-4">During the pilot:</p>
            
            <ul className="space-y-2 text-gray-700 mb-6 ml-6">
              <li>• No patient names are collected</li>
              <li>• No patient contact information is collected</li>
              <li>• No medical records are accessed</li>
              <li>• No EMR integration is required</li>
              <li>• No patient identifiers are stored</li>
            </ul>
            
            <p className="text-gray-700 mb-6">
              All measurements during the pilot are aggregated at the group level for stabilization analysis.
            </p>
            
            <p className="text-gray-700">
              This design eliminates the need for legal review, EMR integration, or a HIPAA Business Associate Agreement (BAA) during pilot participation.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What Is a BAA?
            </h2>
            
            <p className="text-gray-700 mb-6">
              A Business Associate Agreement (BAA) is a legal contract required under HIPAA when a third party handles patient-identifiable health information.
            </p>
            
            <p className="text-gray-700 mb-6">
              Because the pilot avoids collecting or storing patient-identifiable data, a BAA is not required during the validation phase.
            </p>
            
            <p className="text-gray-700">
              If clinics transition to a post-pilot retention system involving patient-level tracking, BAAs will be executed at that time.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Infrastructure
            </h2>
            
            <p className="text-gray-700 mb-6">
              RetentionHealth is hosted on Cloudflare's global edge network.
            </p>
            
            <p className="text-gray-700 mb-4">Core infrastructure includes:</p>
            
            <ul className="space-y-2 text-gray-700 mb-6 ml-6">
              <li>• Cloudflare Workers (serverless execution)</li>
              <li>• Cloudflare Pages (static frontend hosting)</li>
              <li>• Encrypted HTTPS connections</li>
              <li>• TLS encryption for all data in transit</li>
            </ul>
            
            <p className="text-gray-700">
              The system is designed to minimize stored data and reduce exposure surface area.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Data Scope During Pilot
            </h2>
            
            <p className="text-gray-700 mb-4">RetentionHealth does not:</p>
            
            <ul className="space-y-2 text-gray-700 mb-6 ml-6">
              <li>• Replace clinical systems</li>
              <li>• Provide medical decision-making</li>
              <li>• Modify prescribed medication protocols</li>
              <li>• Store Protected Health Information</li>
              <li>• Integrate with EMR systems during pilot phase</li>
            </ul>
            
            <p className="text-gray-700 mb-6">
              Behavioral inputs entered into the system during pilot are not associated with identifiable patient records and are used solely to generate adaptive reinforcement messaging within the session context.
            </p>
            
            <p className="text-gray-700">
              No longitudinal patient profiles are stored during the pilot phase.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Access Controls
            </h2>
            
            <p className="text-gray-700 mb-6">
              Clinic-level dashboards are accessible only through secure authentication.
            </p>
            
            <p className="text-gray-700 mb-6">
              Administrative access is restricted to authorized personnel.
            </p>
            
            <p className="text-gray-700">
              Role-based access controls are implemented at the application layer.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Post-Pilot Compliance Expansion
            </h2>
            
            <p className="text-gray-700 mb-6">
              If measurable drop-off reduction is demonstrated and clinics choose to move forward, RetentionHealth will transition to:
            </p>
            
            <ul className="space-y-2 text-gray-700 mb-6 ml-6">
              <li>• HIPAA-compliant cloud infrastructure</li>
              <li>• Encrypted patient identifiers</li>
              <li>• Signed Business Associate Agreements</li>
              <li>• Audit logs and access controls aligned with healthcare standards</li>
            </ul>
            
            <p className="text-gray-700">
              Compliance expansion occurs only after value is validated.
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Security Contact
            </h2>
            
            <p className="text-gray-700">
              For security-related inquiries:{" "}
              <a 
                href="mailto:security@retentionhealth.com?subject=Security Inquiry"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                security@retentionhealth.com
              </a>
            </p>
          </section>
          
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Design Philosophy
            </h2>
            
            <p className="text-gray-700 mb-6">
              RetentionHealth is engineered to minimize legal complexity during validation.
            </p>
            
            <p className="text-gray-700 mb-6">
              The pilot phase focuses on measurable stabilization without increasing compliance burden for participating clinics.
            </p>
            
            <p className="text-gray-700">
              Security architecture evolves intentionally as the platform scales.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
