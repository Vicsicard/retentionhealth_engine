"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Building2 } from "lucide-react";

export default function PilotSignup() {
  const [formData, setFormData] = useState({
    clinic_name: "",
    contact_name: "",
    email: "",
    phone: "",
    patient_count_range: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [capacity, setCapacity] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkCapacity();
  }, []);

  async function checkCapacity() {
    try {
      const res = await fetch("https://retentionhealth.com/api/pilot/capacity");
      const data = await res.json();
      setCapacity(data);
    } catch (e) {
      console.error("Failed to check capacity:", e);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://retentionhealth.com/api/pilot/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (capacity && !capacity.accepting_signups) {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto w-full text-center">
          <div className="brand-header mb-6">RetentionHealth</div>
          <h1 className="heading-lg mb-6">Pilot Program Full</h1>
          <div className="card-gradient">
            <p className="text-body mb-4">
              We've reached capacity for our 8-week pilot program.
            </p>
            <p className="text-2xl font-bold text-slate-900 mb-4">
              {capacity.active_clinics}/{capacity.capacity} clinics enrolled
            </p>
            <p className="text-secondary">
              The pilot will conclude in 8 weeks. Check back for updates on our full launch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md mx-auto w-full">
          <div className="card">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="heading-md mb-4">Application Received</h1>
              <p className="text-body">
                Thank you for your interest in the RetentionHealth pilot program.
              </p>
            </div>
            <div className="card-gradient mb-6">
              <p className="font-bold text-slate-900 mb-4 text-lg">What happens next:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">1.</span>
                  <span>We'll review your application within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">2.</span>
                  <span>If approved, you'll receive dashboard access credentials via email</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">3.</span>
                  <span>Your 8-week pilot will begin immediately upon approval</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => router.push("/")}
              className="btn-primary w-full"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8 text-center">
          <div className="brand-header mb-4">RetentionHealth</div>
          <h1 className="heading-lg mb-4">Pilot Program Application</h1>
          <p className="text-body mb-2">8-week cohort retention pilot</p>
          <p className="text-lg font-semibold text-blue-600">Free for first 6 clinics</p>
          {capacity && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border-2 border-blue-200">
              <span className="text-sm font-semibold text-blue-800">
                {capacity.active_clinics}/{capacity.capacity} spots filled
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clinic Name *
            </label>
            <input
              className="input"
              placeholder="ABC GLP-1 Clinic"
              value={formData.clinic_name}
              onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name *
            </label>
            <input
              className="input"
              placeholder="Dr. Jane Smith"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              className="input"
              type="email"
              placeholder="jane@clinic.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              className="input"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active GLP-1 Patients
            </label>
            <select
              className="input"
              value={formData.patient_count_range}
              onChange={(e) => setFormData({ ...formData, patient_count_range: e.target.value })}
            >
              <option value="">Select range</option>
              <option value="50-100">50-100 patients</option>
              <option value="100-200">100-200 patients</option>
              <option value="200-500">200-500 patients</option>
              <option value="500+">500+ patients</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Apply for Pilot Program"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By applying, you agree to participate in an 8-week pilot program with weekly cohort data submissions.
          </p>
        </form>
      </div>
    </div>
  );
}
