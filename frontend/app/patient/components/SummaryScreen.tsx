"use client";

import { CheckCircle } from "lucide-react";
import type { GeneratedSummary } from "@/lib/patientTemplates";

interface Props {
  summary: GeneratedSummary;
  onDone: () => void;
}

export default function SummaryScreen({ summary, onDone }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="brand-header mb-4">RetentionHealth</div>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h1 className="heading-lg">You're all set for today.</h1>
          </div>
          <div className="text-body mb-3 font-semibold text-gray-900">{summary.header}</div>
          <p className="text-base text-gray-700 mb-3">{summary.normalization}</p>
          <p className="text-base text-gray-600">{summary.todayGoal}</p>
        </div>

        {summary.focus.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Focus</h2>
            <ul className="focus-list">
              {summary.focus.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-4 italic">
              Small adjustments today help your body adapt to the medication.
            </p>
          </div>
        )}

        {summary.nausea_guidance && (
          <div className="card mb-6 bg-blue-50 border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{summary.nausea_guidance.title}</h2>
            <ul className="focus-list">
              {summary.nausea_guidance.bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {summary.safety_line && (
          <div className="card mb-6 bg-yellow-50 border-yellow-300">
            <h2 className="text-base font-semibold text-gray-900 mb-2">When to Contact Your Provider</h2>
            <p className="text-sm text-gray-800">{summary.safety_line}</p>
          </div>
        )}

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{summary.protein_modifier.title}</h2>
          <ul className="focus-list mb-4">
            {summary.protein_modifier.bullets.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Easy-to-Tolerate Options</h3>
            <div className="flex flex-wrap gap-2">
              {summary.protein_examples.map((item, i) => (
                <span key={i} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card mb-6 bg-green-50 border-green-200">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Quick Check-Ins Help Keep the Week Steady</h2>
          <p className="text-sm text-gray-700">{summary.encouragement}</p>
        </div>

        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
          <p className="text-xs text-gray-700 text-center leading-relaxed">
            <strong>Medical Disclaimer:</strong> This tool supports your clinician's treatment plan and does not replace medical care. For severe or persistent symptoms, contact your provider.
          </p>
        </div>

        <button 
          onClick={onDone}
          className="btn-primary mt-6"
        >
          Done for today
        </button>
      </div>
    </div>
  );
}
