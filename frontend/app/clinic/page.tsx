"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";

export default function ClinicLogin() {
  const [clinicId, setClinicId] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function login() {
    setLoading(true);
    setError("");

    try {
      // Verify credentials by calling dashboard endpoint
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://retentionhealth.com";
      const res = await fetch(`${apiBase}/api/clinic/dashboard`, {
        headers: {
          "x-clinic-id": clinicId,
          "x-clinic-key": adminKey,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error("Invalid credentials");
      }

      // Store credentials
      localStorage.setItem("clinic_id", clinicId);
      localStorage.setItem("clinic_key", adminKey);
      router.push("/clinic/dashboard");
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8 text-center">
          <div className="brand-header mb-4">RetentionHealth</div>
          <h1 className="heading-lg mb-2">Clinic Dashboard</h1>
          <p className="text-body">Access your patient retention metrics.</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">Preview the Dashboard</p>
          <p className="text-xs text-blue-700 mb-3">Use these demo credentials to explore the interface:</p>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-blue-600">Clinic ID:</span>
              <span className="text-blue-900 font-semibold">demo-clinic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">API Key:</span>
              <span className="text-blue-900 font-semibold">demo-key-2024</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic ID</label>
            <input
              className="input"
              placeholder="Enter clinic ID"
              value={clinicId}
              onChange={(e) => setClinicId(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              className="input"
              type="password"
              placeholder="Enter your API key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}
          
          <button 
            className="btn-primary" 
            onClick={login}
            disabled={loading || !clinicId || !adminKey}
          >
            {loading ? "Connecting..." : "Enter Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
