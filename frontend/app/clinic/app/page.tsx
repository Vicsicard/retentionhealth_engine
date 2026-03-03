"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";
import SeatTable from "./components/SeatTable";
import StatsBar from "./components/StatsBar";

export default function ClinicDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/api/clinic/dashboard/summary");
      setData(res);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="brand-header">🏥 Retention Health</div>
          <h1 className="text-2xl font-semibold text-gray-900">Patient Dashboard</h1>
        </div>
        <StatsBar counts={data.counts} window={data.window} />
        <SeatTable seats={data.seats} />
      </div>
    </div>
  );
}
