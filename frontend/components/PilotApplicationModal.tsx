'use client';

import { useState } from 'react';
import { X, ChevronLeft, CheckCircle } from 'lucide-react';

interface PilotApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationData {
  clinicStructure: string;
  activePatients: string;
  treatmentDelivery: string;
  pilotCommitment: string;
  clinicName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
}

export default function PilotApplicationModal({ isOpen, onClose }: PilotApplicationModalProps) {
  const [screen, setScreen] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<ApplicationData>({
    clinicStructure: '',
    activePatients: '',
    treatmentDelivery: '',
    pilotCommitment: '',
    clinicName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
  });

  const handleNext = () => {
    setScreen(screen + 1);
  };

  const handleBack = () => {
    setScreen(screen - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/pilot-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again or email us at contact@retentionhealth.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitted) {
      setIsSubmitted(false);
      setScreen(1);
      setData({
        clinicStructure: '',
        activePatients: '',
        treatmentDelivery: '',
        pilotCommitment: '',
        clinicName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  RetentionHealth Pilot Application
                </h2>
                <p className="text-sm text-gray-600">
                  Initial Cohort Limited to 6 Clinics
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-800">
                    Step {screen} of 5
                  </span>
                  <span className="text-sm text-gray-500">~20 seconds</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(screen / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Screen 1: Clinic Structure */}
              {screen === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    What best describes your clinic?
                  </h3>

                  <div className="space-y-3">
                    {[
                      { value: 'physician-owned', label: 'Physician-owned clinic' },
                      { value: 'np-led', label: 'Nurse practitioner-led clinic' },
                      { value: 'medspa', label: 'Med spa with physician oversight' },
                      { value: 'multi-location', label: 'Multi-location clinic group' },
                      { value: 'franchise', label: 'National franchise or corporate group' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setData({ ...data, clinicStructure: option.value });
                          handleNext();
                        }}
                        className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Screen 2: Active Patients */}
              {screen === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    How many active GLP-1 patients does your clinic currently manage?
                  </h3>

                  <div className="space-y-3">
                    {[
                      { value: '50-100', label: '50–100' },
                      { value: '100-250', label: '100–250' },
                      { value: '250-500', label: '250–500' },
                      { value: '500+', label: '500+' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setData({ ...data, activePatients: option.value });
                          handleNext();
                        }}
                        className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 mt-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                </div>
              )}

              {/* Screen 3: Treatment Delivery */}
              {screen === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    How are treatments primarily delivered to patients?
                  </h3>

                  <div className="space-y-3">
                    {[
                      { value: 'in-clinic', label: 'Weekly in-clinic administration' },
                      { value: 'combination', label: 'Combination clinic + take-home' },
                      { value: 'take-home', label: 'Primarily take-home prescriptions' },
                      { value: 'telehealth', label: 'Telehealth-managed treatment' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setData({ ...data, treatmentDelivery: option.value });
                          handleNext();
                        }}
                        className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 mt-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                </div>
              )}

              {/* Screen 4: Pilot Commitment */}
              {screen === 4 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    The pilot requires ~5 minutes of weekly reporting for 8 weeks.
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Is your clinic comfortable participating in this reporting process?
                  </p>

                  <div className="space-y-3">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'possibly', label: 'Possibly, need more information' },
                      { value: 'not-sure', label: 'Not sure yet' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setData({ ...data, pilotCommitment: option.value });
                          handleNext();
                        }}
                        className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 mt-6 px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </button>
                </div>
              )}

              {/* Screen 5: Contact Details */}
              {screen === 5 && (
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Contact Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Clinic Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={data.clinicName}
                        onChange={(e) => setData({ ...data, clinicName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={data.contactName}
                        onChange={(e) => setData({ ...data, contactName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Website (optional)
                      </label>
                      <input
                        type="url"
                        value={data.website}
                        onChange={(e) => setData({ ...data, website: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-6 py-4 text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!data.clinicName || !data.contactName || !data.email || !data.phone || isSubmitting}
                      className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Success Screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Application Received
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Thank you for applying to the RetentionHealth pilot cohort.
              </p>
              <p className="text-gray-600 mb-8">
                We are reviewing applications for the first six clinics and will respond within 48 hours.
              </p>
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Return to Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
