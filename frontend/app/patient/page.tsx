"use client";

import { useState } from "react";
import DaySelector from "./components/DaySelector";
import NauseaScreen from "./components/NauseaScreen";
import ProteinScreen from "./components/ProteinScreen";
import SummaryScreen from "./components/SummaryScreen";
import { generateSummary, getPhase, type GeneratedSummary } from "@/lib/patientTemplates";

export default function PatientFlow() {
  const [step, setStep] = useState(1);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [nauseaLevel, setNauseaLevel] = useState<number | null>(null);
  const [proteinStatus, setProteinStatus] = useState<number | null>(null);
  const [summary, setSummary] = useState<GeneratedSummary | null>(null);

  function handleDaySelect(day: number) {
    setCycleDay(day);
    setStep(2);
  }

  function handleNauseaSelect(level: number) {
    setNauseaLevel(level);
    setStep(3);
  }

  function handleProteinSelect(status: number) {
    setProteinStatus(status);
    const generated = generateSummary(cycleDay!, nauseaLevel!, status);
    setSummary(generated);
    setStep(4);
  }

  function handleDone() {
    setStep(1);
    setCycleDay(null);
    setNauseaLevel(null);
    setProteinStatus(null);
    setSummary(null);
  }

  if (step === 1) return <DaySelector onNext={handleDaySelect} />;
  if (step === 2 && cycleDay !== null) {
    return <NauseaScreen cycleDay={cycleDay} phase={getPhase(cycleDay)} onNext={handleNauseaSelect} />;
  }
  if (step === 3 && cycleDay !== null) {
    return <ProteinScreen cycleDay={cycleDay} phase={getPhase(cycleDay)} onSubmit={handleProteinSelect} />;
  }
  if (step === 4 && summary) {
    return <SummaryScreen summary={summary} onDone={handleDone} />;
  }

  return null;
}
