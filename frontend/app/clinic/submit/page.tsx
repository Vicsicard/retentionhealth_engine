"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubmitData() {
  const [weekNumber, setWeekNumber] = useState(1);
  const [baselineData, setBaselineData] = useState({
    patient_count: "",
    engagement_count: "",
    volatility_events: "",
    avg_refill_delta_days: "",
  });
  const [stabilizationData, setStabilizationData] = useState({
    patient_count: "",
    engagement_count: "",
    volatility_events: "",
    avg_refill_delta_days: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const clinicId = localStorage.getItem("clinic_id");
    setIsDemoMode(clinicId === 'demo-clinic');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Block submission in demo mode
    if (isDemoMode) {
      setError("Demo mode: Data submission is disabled. This feature is available to active pilot clinics.");
      return;
    }
    
    setLoading(true);
    setError("");

    const clinicId = localStorage.getItem("clinic_id");
    const clinicKey = localStorage.getItem("clinic_key");
    const sessionToken = localStorage.getItem("clinic_session");

    if (!clinicId || (!clinicKey && !sessionToken)) {
      router.push("/clinic/login");
      return;
    }

    try {
      const headers: any = { "Content-Type": "application/json" };
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      } else {
        headers["x-clinic-id"] = clinicId;
        headers["x-clinic-key"] = clinicKey;
      }

      // Submit baseline cohort
      const baselineRes = await fetch("https://retentionhealth.com/api/clinic/metrics", {
        method: "POST",
        headers,
        body: JSON.stringify({
          cohort_label: "Baseline",
          week_number: weekNumber,
          patient_count: parseInt(baselineData.patient_count),
          engagement_count: parseInt(baselineData.engagement_count),
          volatility_events: parseInt(baselineData.volatility_events),
          avg_refill_delta_days: baselineData.avg_refill_delta_days ? parseFloat(baselineData.avg_refill_delta_days) : undefined,
        }),
      });

      const baselineResult = await baselineRes.json();
      if (!baselineRes.ok || !baselineResult.ok) {
        throw new Error(baselineResult.error || "Failed to submit baseline data");
      }

      // Submit stabilization cohort
      const stabilizationRes = await fetch("https://retentionhealth.com/api/clinic/metrics", {
        method: "POST",
        headers,
        body: JSON.stringify({
          cohort_label: "Stabilization",
          week_number: weekNumber,
          patient_count: parseInt(stabilizationData.patient_count),
          engagement_count: parseInt(stabilizationData.engagement_count),
          volatility_events: parseInt(stabilizationData.volatility_events),
          avg_refill_delta_days: stabilizationData.avg_refill_delta_days ? parseFloat(stabilizationData.avg_refill_delta_days) : undefined,
        }),
      });

      const stabilizationResult = await stabilizationRes.json();
      if (!stabilizationRes.ok || !stabilizationResult.ok) {
        throw new Error(stabilizationResult.error || "Failed to submit stabilization data");
      }

      // Success - redirect to dashboard
      router.push("/clinic/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/clinic/dashboard")}
            className="text-base text-gray-600 hover:text-slate-900 font-medium mb-6 inline-flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="brand-header mb-2">RetentionHealth</div>
          <h1 className="heading-lg mb-2">Submit Weekly Data</h1>
          <p className="text-body">Enter cohort metrics for this week</p>
          {isDemoMode && (
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">Demo Mode - Preview Only</p>
              <p className="text-xs text-blue-700">This form shows what active pilot clinics use to submit weekly data. Submission is disabled in demo mode.</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Week Number */}
          <div className="card">
            <label className="block text-base font-semibold text-slate-900 mb-3">
              Week Number
            </label>
            <select
              className="input max-w-xs text-lg"
              value={weekNumber}
              onChange={(e) => setWeekNumber(parseInt(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </div>

          {/* Baseline Cohort */}
          <div className="card">
            <h2 className="heading-md mb-6">Baseline Cohort</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Count *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="45"
                  min="10"
                  value={baselineData.patient_count}
                  onChange={(e) => setBaselineData({ ...baselineData, patient_count: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 patients</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engagement Count *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="32"
                  min="0"
                  value={baselineData.engagement_count}
                  onChange={(e) => setBaselineData({ ...baselineData, engagement_count: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Patients who engaged this week</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volatility Events *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="8"
                  min="0"
                  value={baselineData.volatility_events}
                  onChange={(e) => setBaselineData({ ...baselineData, volatility_events: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Missed appointments, late refills, complaints</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avg Refill Delta (days)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="2.3"
                  value={baselineData.avg_refill_delta_days}
                  onChange={(e) => setBaselineData({ ...baselineData, avg_refill_delta_days: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Average days from expected refill</p>
              </div>
            </div>
          </div>

          {/* Stabilization Cohort */}
          <div className="card">
            <h2 className="heading-md mb-6">Stabilization Cohort</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Count *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="38"
                  min="10"
                  value={stabilizationData.patient_count}
                  onChange={(e) => setStabilizationData({ ...stabilizationData, patient_count: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 10 patients</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engagement Count *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="35"
                  min="0"
                  value={stabilizationData.engagement_count}
                  onChange={(e) => setStabilizationData({ ...stabilizationData, engagement_count: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Patients who engaged this week</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volatility Events *
                </label>
                <input
                  type="number"
                  className="input"
                  placeholder="3"
                  min="0"
                  value={stabilizationData.volatility_events}
                  onChange={(e) => setStabilizationData({ ...stabilizationData, volatility_events: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Missed appointments, late refills, complaints</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avg Refill Delta (days)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="1.1"
                  value={stabilizationData.avg_refill_delta_days}
                  onChange={(e) => setStabilizationData({ ...stabilizationData, avg_refill_delta_days: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Average days from expected refill</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-base text-red-700">
              {error}
            </div>
          )}

          <div className="card-gradient">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.push("/clinic/dashboard")}
                className="px-8 py-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg transition-colors ${
                  isDemoMode 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
                disabled={loading || isDemoMode}
              >
                {isDemoMode ? "Demo Mode - Submission Disabled" : loading ? "Submitting..." : `Submit Week ${weekNumber} Data`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
