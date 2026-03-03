"use client";

import { Smile, Frown, AlertCircle, XCircle } from "lucide-react";

interface Props {
  onNext: (level: number) => void;
  cycleDay: number;
  phase: string;
}

export default function NauseaScreen({ onNext, cycleDay, phase }: Props) {
  const options = [
    { value: 0, label: "Feeling okay", icon: Smile, color: "text-green-600" },
    { value: 1, label: "Mild discomfort", icon: Frown, color: "text-yellow-600" },
    { value: 2, label: "Moderate discomfort", icon: AlertCircle, color: "text-orange-600" },
    { value: 3, label: "Significant discomfort", icon: XCircle, color: "text-red-600" }
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-white">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="brand-header mb-4">RetentionHealth</div>
          <div className="phase-indicator">Day {cycleDay} • {phase}</div>
          <h1 className="heading-lg mb-2">How are you feeling today?</h1>
          <p className="text-body">This helps personalize your guidance.</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => onNext(opt.value)}
                className="btn-option"
              >
                <div className="flex items-center">
                  <Icon className={`w-6 h-6 mr-3 ${opt.color}`} />
                  <span className="font-medium text-gray-900">{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
