"use client";

import { useState } from "react";
import { CheckCircle, Circle, XCircle } from "lucide-react";

interface Props {
  onSubmit: (status: number) => void;
  cycleDay: number;
  phase: string;
}

export default function ProteinScreen({ onSubmit, cycleDay, phase }: Props) {
  const [loading, setLoading] = useState(false);

  const options = [
    { value: 2, label: "On track", icon: CheckCircle, color: "text-green-600" },
    { value: 1, label: "Some intake", icon: Circle, color: "text-yellow-600" },
    { value: 0, label: "Less than planned", icon: XCircle, color: "text-red-600" }
  ];

  async function handleSelect(value: number) {
    setLoading(true);
    onSubmit(value);
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8">
          <div className="brand-header mb-4">RetentionHealth</div>
          <div className="phase-indicator">Day {cycleDay} • {phase} • Step 2 of 2</div>
          <h1 className="heading-lg mb-2">How did your protein intake go yesterday?</h1>
          <p className="text-body">This helps structure your daily guidance.</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                disabled={loading}
                className="btn-option disabled:opacity-50"
              >
                <div className="flex items-center">
                  <Icon className={`w-6 h-6 mr-3 ${opt.color}`} />
                  <span className="font-medium text-gray-900">{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-6 text-center text-sm text-gray-600">Processing...</div>
        )}
      </div>
    </div>
  );
}
