import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">RetentionHealth</div>
            <p className="text-sm text-gray-300">
              Revenue Stabilization Infrastructure for GLP-1 Clinics
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/security" className="text-sm text-gray-300 hover:text-white">
                  Security & Compliance
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/medical-disclaimer" className="text-sm text-gray-300 hover:text-white">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                <strong>Contact:</strong>{' '}
                <a href="mailto:contact@retentionhealth.com" className="hover:text-white">
                  contact@retentionhealth.com
                </a>
              </p>
              <p>
                <strong>Address:</strong> Boulder, CO 80302
              </p>
            </div>
            
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} RetentionHealth
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Medical Disclaimer:</strong> RetentionHealth provides behavioral reinforcement tools 
              and operational retention analytics only. It does not provide medical advice, modify prescriptions, 
              or replace clinical decision-making. Clinics retain full responsibility for patient care.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
