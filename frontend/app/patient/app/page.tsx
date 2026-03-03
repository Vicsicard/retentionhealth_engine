"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import NauseaScreen from "./components/NauseaScreen";
import ProteinScreen from "./components/ProteinScreen";
import SummaryScreen from "./components/SummaryScreen";

export default function PatientApp() {
  const [mode, setMode] = useState<"loading" | "pre" | "post">("loading");
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [nauseaLevel, setNauseaLevel] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await apiFetch("/api/patient/daily-output");
      setData(res);
      setMode(res.mode === "PRE_CHECKIN" ? "pre" : "post");
    } catch (error) {
      console.error("Failed to load daily output:", error);
    }
  }

  async function handleProteinSubmit(proteinStatus: number) {
    try {
      await apiFetch("/api/patient/checkin", {
        method: "POST",
        body: JSON.stringify({
          nausea_level: nauseaLevel,
          protein_status: proteinStatus
        })
      });
      await load();
    } catch (error) {
      console.error("Failed to submit check-in:", error);
    }
  }

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (mode === "post") {
    return <SummaryScreen data={data} reload={load} />;
  }

  // PRE_CHECKIN flow
  if (step === 1) {
    return (
      <NauseaScreen 
        cycleDay={data.cycle_day}
        phase={data.phase}
        onNext={(level) => {
          setNauseaLevel(level);
          setStep(2);
        }} 
      />
    );
  }

  if (step === 2) {
    return (
      <ProteinScreen 
        cycleDay={data.cycle_day}
        phase={data.phase}
        onSubmit={handleProteinSubmit} 
      />
    );
  }

  return null;
}
