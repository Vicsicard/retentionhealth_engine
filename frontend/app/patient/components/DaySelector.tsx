"use client";

import { Calendar } from "lucide-react";

interface Props {
  onNext: (day: number) => void;
}

export default function DaySelector({ onNext }: Props) {
  const options = [
    { value: 0, label: "Same day", sublabel: "Day 0" },
    { value: 1, label: "1 day ago", sublabel: "Day 1" },
    { value: 2, label: "2 days ago", sublabel: "Day 2" },
    { value: 3, label: "3 days ago", sublabel: "Day 3" },
    { value: 4, label: "4 days ago", sublabel: "Day 4" },
    { value: 5, label: "5 days ago", sublabel: "Day 5" },
    { value: 6, label: "6 days ago", sublabel: "Day 6" },
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-md mx-auto w-full">
        <div className="mb-8 text-center">
          <div className="brand-header mb-4">RetentionHealth</div>
          <h1 className="heading-lg mb-2">How many days since your last injection?</h1>
          <p className="text-body">This helps personalize your guidance for today.</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-1">Preview Patient Experience</p>
          <p className="text-xs text-blue-700">This is a demo of the patient check-in flow. Select any option to see personalized guidance.</p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onNext(opt.value)}
              className="btn-option"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="font-medium text-gray-900">{opt.label}</span>
                </div>
                <span className="text-sm text-gray-500">{opt.sublabel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
