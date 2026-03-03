"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

function ClinicLoginContent() {
  const [clinicId, setClinicId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for magic link token
    const token = searchParams.get("token");
    if (token) {
      handleMagicLogin(token);
    }
  }, [searchParams]);

  async function handleMagicLogin(token: string) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://retentionhealth.com/api/clinic/magic-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Invalid or expired magic link");
      }

      // Store session token
      localStorage.setItem("clinic_session", data.session_token);
      localStorage.setItem("clinic_id", data.clinic_id);
      localStorage.setItem("clinic_name", data.clinic_name);

      router.push("/clinic/dashboard");
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  async function handleManualLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify credentials by calling dashboard endpoint
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://retentionhealth-engine.vicsicard.workers.dev";
      const res = await fetch(`${apiBase}/api/clinic/dashboard`, {
        headers: {
          "x-clinic-id": clinicId,
          "x-clinic-key": apiKey,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error("Invalid credentials");
      }

      // Store credentials
      localStorage.setItem("clinic_id", clinicId);
      localStorage.setItem("clinic_key", apiKey);
      localStorage.setItem("clinic_name", data.clinic.name);

      router.push("/clinic/dashboard");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && searchParams.get("token")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <div className="text-xl font-semibold text-slate-900">Verifying your access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8 text-center">
          <div className="brand-header mb-4">RetentionHealth</div>
          <h1 className="heading-lg mb-4">Clinic Dashboard</h1>
          <p className="text-body">Access your cohort retention metrics</p>
        </div>

        <div className="card">
          <form onSubmit={handleManualLogin} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-slate-900 mb-2">Clinic ID</label>
              <input
                className="input"
                placeholder="clinic_..."
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-slate-900 mb-2">API Key</label>
              <input
                className="input"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-base text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Connecting..." : "Enter Dashboard"}
            </button>

            <p className="text-sm text-gray-600 text-center pt-4 border-t border-gray-200">
              Lost your credentials? Contact support for assistance.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ClinicLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <div className="text-xl font-semibold text-slate-900">Loading...</div>
        </div>
      </div>
    }>
      <ClinicLoginContent />
    </Suspense>
  );
}
