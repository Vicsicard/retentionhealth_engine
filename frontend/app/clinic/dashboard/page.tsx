"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Info } from "lucide-react";

export default function ClinicDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const clinicId = localStorage.getItem("clinic_id");
    const clinicKey = localStorage.getItem("clinic_key");
    const sessionToken = localStorage.getItem("clinic_session");

    if (!clinicId || (!clinicKey && !sessionToken)) {
      router.push("/clinic/login");
      return;
    }

    // Detect demo mode
    setIsDemoMode(clinicId === 'demo-clinic');

    try {
      const headers: any = {};
      if (sessionToken) {
        headers["Authorization"] = `Bearer ${sessionToken}`;
      } else {
        headers["x-clinic-id"] = clinicId;
        headers["x-clinic-key"] = clinicKey;
      }

      const res = await fetch("https://retentionhealth.com/api/clinic/dashboard", {
        headers,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to load dashboard");
      }

      setDashboardData(data);
      
      // Calculate current week based on pilot start date
      if (data.clinic.pilot_start_date) {
        const startDate = new Date(data.clinic.pilot_start_date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const week = Math.min(Math.ceil(diffDays / 7), 8);
        setCurrentWeek(week);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("clinic_id");
    localStorage.removeItem("clinic_key");
    localStorage.removeItem("clinic_session");
    localStorage.removeItem("clinic_name");
    router.push("/clinic/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-xl font-semibold text-slate-900">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-md text-center">
          <div className="card">
            <div className="text-red-600 text-lg font-semibold mb-6">{error}</div>
            <button onClick={() => router.push("/clinic/login")} className="btn-primary">
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const baseline = dashboardData?.cohorts?.find((c: any) => c.cohort_label === "Baseline");
  const stabilization = dashboardData?.cohorts?.find((c: any) => c.cohort_label === "Stabilization");
  const comparison = dashboardData?.comparison;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="brand-header mb-2">RetentionHealth</div>
            <h1 className="heading-lg">
              {dashboardData?.clinic?.name || "Clinic Dashboard"}
            </h1>
            {isDemoMode && (
              <p className="text-sm text-gray-500 mt-1">Sample Data for Illustration</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Demo Mode Active
              </span>
            )}
            <button onClick={handleLogout} className="text-base text-gray-600 hover:text-slate-900 font-medium">
              Logout
            </button>
          </div>
        </div>

        {/* Pilot Status Banner */}
        <div className="card-gradient mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-lg font-bold text-slate-900 mb-2">
                Pilot Status: Week {currentWeek} of 8
              </div>
              <div className="text-base text-gray-700">
                Next submission due: Monday 10am
              </div>
            </div>
            <button
              onClick={() => router.push("/clinic/submit")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-blue-700 shadow-md whitespace-nowrap"
            >
              Submit Week {currentWeek} Data
            </button>
          </div>
        </div>

        {/* Cohort Comparison */}
        {comparison && (
          <div className="card mb-8">
            <h2 className="heading-md mb-6">Cohort Comparison</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="stat-card-primary">
                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  Engagement Delta
                  {isDemoMode && (
                    <div className="group relative">
                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                      <div className="absolute left-0 top-6 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        <p className="font-semibold mb-1">What it measures:</p>
                        <p className="mb-2">Difference in patient check-in rates between cohorts.</p>
                        <p className="font-semibold mb-1">Why it matters:</p>
                        <p className="mb-2">Higher engagement predicts lower drop-off.</p>
                        <p className="font-semibold mb-1">Operational impact:</p>
                        <p>Early disengagement signals allow proactive intervention.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-3xl font-bold ${comparison.engagement_delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.engagement_delta > 0 ? '+' : ''}{comparison.engagement_delta.toFixed(1)}%
                </div>
              </div>
              <div className="stat-card-primary">
                <div className="text-sm font-semibold text-gray-700 mb-2">Volatility Delta</div>
                <div className={`text-3xl font-bold ${comparison.volatility_delta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.volatility_delta > 0 ? '+' : ''}{comparison.volatility_delta.toFixed(1)}%
                </div>
              </div>
              <div className="stat-card-primary">
                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  Refill Delta
                  {isDemoMode && (
                    <div className="group relative">
                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                      <div className="absolute left-0 top-6 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        <p className="font-semibold mb-1">What it measures:</p>
                        <p className="mb-2">Difference in refill timing variance between cohorts.</p>
                        <p className="font-semibold mb-1">Why it matters:</p>
                        <p className="mb-2">Unpredictable refills disrupt inventory and cash flow.</p>
                        <p className="font-semibold mb-1">Operational impact:</p>
                        <p>Stable refill patterns enable predictable operations.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-3xl font-bold ${comparison.refill_delta && comparison.refill_delta < 0 ? 'text-green-600' : 'text-slate-900'}`}>
                  {comparison.refill_delta ? `${comparison.refill_delta > 0 ? '+' : ''}${comparison.refill_delta.toFixed(1)}d` : 'N/A'}
                </div>
              </div>
              <div className="stat-card-primary">
                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                  Drop-off Delta
                  {isDemoMode && (
                    <div className="group relative">
                      <Info className="w-4 h-4 text-blue-500 cursor-help" />
                      <div className="absolute left-0 top-6 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        <p className="font-semibold mb-1">What it measures:</p>
                        <p className="mb-2">Patients who discontinue within 60 days.</p>
                        <p className="font-semibold mb-1">Why it matters:</p>
                        <p className="mb-2">Early churn eliminates high-LTV patients.</p>
                        <p className="font-semibold mb-1">Operational impact:</p>
                        <p>Reducing drop-off stabilizes monthly revenue.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`text-3xl font-bold ${comparison.dropoff_delta < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.dropoff_delta > 0 ? '+' : ''}{comparison.dropoff_delta.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cohort Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Baseline Cohort */}
          {baseline && (
            <div className="card">
              <h3 className="heading-md mb-6">Baseline Cohort</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patients</span>
                  <span className="font-medium">{baseline.patient_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="font-medium">{baseline.engagement_rate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volatility Rate</span>
                  <span className="font-medium">{baseline.volatility_rate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Refill Delta</span>
                  <span className="font-medium">
                    {baseline.avg_refill_delta_days ? `${baseline.avg_refill_delta_days.toFixed(1)} days` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Drop-off Rate</span>
                  <span className="font-medium">{baseline.dropoff_rate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Stabilization Cohort */}
          {stabilization && (
            <div className="card">
              <h3 className="heading-md mb-6">Stabilization Cohort</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patients</span>
                  <span className="font-medium">{stabilization.patient_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="font-medium">{stabilization.engagement_rate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Volatility Rate</span>
                  <span className="font-medium">{stabilization.volatility_rate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Refill Delta</span>
                  <span className="font-medium">
                    {stabilization.avg_refill_delta_days ? `${stabilization.avg_refill_delta_days.toFixed(1)} days` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Drop-off Rate</span>
                  <span className="font-medium">{stabilization.dropoff_rate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {!baseline && !stabilization && (
          <div className="card-gradient text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="heading-md mb-4">No Data Yet</h3>
            <p className="text-body mb-8">
              Submit your first week's cohort data to see metrics and comparisons.
            </p>
            <button
              onClick={() => router.push("/clinic/submit")}
              className="btn-primary inline-block"
            >
              Submit Week 1 Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
