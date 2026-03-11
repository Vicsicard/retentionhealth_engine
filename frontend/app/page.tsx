"use client";

import { useState } from "react";
import PilotNav from "@/components/PilotNav";
import Footer from "@/components/Footer";
import { TrendingDown, MessageSquare, RefreshCw, AlertTriangle, Target, CheckCircle, Users, DollarSign } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    clinicName: "",
    contactName: "",
    email: "",
    phone: "",
    activePatients: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setIsSubmitted(true);
      setFormData({
        clinicName: "",
        contactName: "",
        email: "",
        phone: "",
        activePatients: "",
      });
    } catch (err) {
      setError("Failed to submit. Please email contact@retentionhealth.com");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      <PilotNav />
      
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-gray-50 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Stabilize Patients During Treatment Ramp-Up — Measurably.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-2">
            Validated for GLP-1 programs.
          </p>
          <p className="text-xl sm:text-2xl text-gray-700 mb-4">
            8-week stabilization pilot for owner-led clinics.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            No EMR integration. No workflow disruption.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            No Protected Health Information (PHI) collected or stored during pilot.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Because the pilot does not collect Protected Health Information (PHI), a Business Associate Agreement (BAA) is not required during pilot participation.
          </p>
          <p className="text-base text-gray-500 mb-10">
            Structured retention validation for GLP-1 programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#apply"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 text-lg shadow-md"
            >
              Apply for Pilot
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-6">Limited to 6 owner-led clinics.</p>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* MARKET CONTEXT */}
      <section className="py-16 bg-white px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            The Market Context
          </h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            GLP-1 therapies now serve <strong>15M+ patients</strong> in the United States, across <strong>75,000–125,000</strong> medical weight-loss and longevity clinics.
          </p>
          <p className="text-lg text-gray-700 text-center">
            Early-phase patient instability is emerging as one of the most common operational challenges during treatment ramp-up.
          </p>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* PROBLEM */}
      <section className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            The First 60 Days Determine Everything.
          </h2>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-3xl mx-auto">
            Most GLP-1 programs experience the highest patient drop-off within the first 8 weeks.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Revenue volatility</h3>
                <p className="text-gray-600">Unpredictable monthly recurring revenue (MRR)</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Increased support load</h3>
                <p className="text-gray-600">Food-related questions during dose escalation</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Reactive staff workflows</h3>
                <p className="text-gray-600">Constant firefighting instead of structured support</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl mb-2">Unpredictable refill timing</h3>
                <p className="text-gray-600">Inventory and cash flow planning challenges</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xl text-slate-900 font-bold mt-12">
            Stopping early churn has a disproportionately large impact on patient lifetime value.
          </p>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* ECONOMIC IMPACT */}
      <section id="economic-impact" className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">
            Even Modest Retention Improvement Has Meaningful Revenue Impact
          </h2>
          
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-teal-50 p-12 rounded-2xl border-2 border-blue-200 shadow-lg">
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 mb-8">Example scenario:</p>
              <div className="space-y-3 text-left max-w-md mx-auto mb-10">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Active GLP-1 patients:</span>
                  <span className="font-semibold text-gray-900">120</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Average monthly fee:</span>
                  <span className="font-semibold text-gray-900">$600</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Baseline drop-off:</span>
                  <span className="font-semibold text-gray-900">30%</span>
                </div>
              </div>
              
              <div className="border-t-2 border-blue-200 pt-8">
                <p className="text-xl font-semibold text-gray-900 mb-4">
                  A 10% reduction in drop-off retains 12 patients and protects:
                </p>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  $7,200
                </p>
                <p className="text-lg text-gray-700 mb-2">preserved monthly revenue</p>
                <p className="text-base text-gray-600 mb-8">
                  Equivalent to approximately <strong>$86,400</strong> in annualized patient value.
                </p>
                
                <div className="bg-white p-6 rounded-lg border border-blue-200">
                  <p className="text-lg font-semibold text-gray-900 mb-3">
                    $7,200 preserved.<br />
                    $500 pilot participation.
                  </p>
                  <p className="text-gray-700 mb-2">Founder pilot rate: <span className="font-bold text-gray-900">$500/month</span></p>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Conservative example for illustration purposes.<br />
                    Results vary by clinic size and engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* WHAT IT DOES */}
      <section className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            This Is Not Software. It's Measured Stabilization.
          </h2>
          <p className="text-xl text-gray-600 mb-16 text-center max-w-3xl mx-auto">
            The pilot introduces a structured behavioral reinforcement layer that operates alongside your existing workflow.
          </p>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-red-600 mb-6">It Does NOT:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-gray-700">Prescribe</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-gray-700">Diagnose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-gray-700">Change dosing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-gray-700">Replace your EMR</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">✗</span>
                  <span className="text-gray-700">Collect or store Protected Health Information (PHI)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">It DOES:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Compare existing workflow vs reinforced patient groups</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Measure engagement trends between groups</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Monitor refill timing volatility</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Quantify drop-off delta</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Deliver weekly executive summaries</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-xl text-slate-900 font-bold mt-16">
            All results are measured against your existing workflow baseline.
          </p>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            How the Pilot Works
          </h2>

          <div className="space-y-12 max-w-3xl mx-auto">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Side-by-Side Patient Groups</h3>
                <p className="text-gray-700 text-lg mb-4">
                  You track two patient groups simultaneously.
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                  <p className="font-semibold text-slate-900 mb-2">Existing Workflow Group</p>
                  <p className="text-gray-700">Patients receive your clinic's normal onboarding and follow-up process.</p>
                  <p className="text-gray-600 text-sm mt-1 italic">No changes to your current operations.</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-slate-900 mb-2">Stabilization Group</p>
                  <p className="text-gray-700 mb-2">Patients receive access to the RetentionHealth behavioral guidance interface designed to support the treatment ramp-up phase.</p>
                  <p className="text-gray-600 text-sm italic">Delivered via a secure SMS link — no app download required.</p>
                </div>
                
                <p className="text-gray-700 text-lg mt-4">
                  The pilot measures whether the stabilization layer improves retention and reduces support burden compared to your existing workflow.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Weekly Measurement</h3>
                <p className="text-gray-700 text-lg mb-3">You submit simple weekly metrics:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Engagement rate</li>
                  <li>Volatility events</li>
                  <li>Refill timing variance</li>
                  <li>60-day drop-off</li>
                </ul>
                <p className="text-sm text-gray-600 italic mt-4">
                  Submission takes approximately 5 minutes per week.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  No patient identifiers are submitted. Clinics report simple aggregated counts.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Monday Executive Summary</h3>
                <p className="text-gray-700 text-lg mb-3">You receive:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Side-by-side comparison</li>
                  <li>Operational insights</li>
                  <li>Measured stabilization impact</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Week 8 Validation Review</h3>
                <p className="text-gray-700 text-lg mb-3">We quantify:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Drop-off reduction</li>
                  <li>Revenue preserved</li>
                  <li>Operational stability gains</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <p className="text-lg font-semibold text-slate-900">
                All results are measured against your existing workflow baseline.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* PILOT TIMELINE */}
      <section className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            What the 8-Week Pilot Actually Looks Like
          </h2>
          <p className="text-xl text-gray-700 mb-4 text-center">
            The pilot is intentionally lightweight.
          </p>
          <p className="text-xl text-gray-700 mb-16 text-center">
            Most clinics spend less than 10 minutes per week participating.
          </p>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Week 0 */}
            <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
              <h3 className="font-bold text-slate-900 text-xl mb-3">
                Week 0 — Setup (≈15 minutes)
              </h3>
              <p className="text-gray-700 mb-3">
                Clinic receives pilot onboarding link and demo credentials.
              </p>
              <p className="text-gray-700 mb-3">
                You assign patients to two groups using your existing workflow:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3 ml-4">
                <li>Existing workflow group</li>
                <li>Stabilization group</li>
              </ul>
              <p className="text-gray-600 text-sm">
                No EMR integration. No workflow changes required.
              </p>
            </div>

            {/* Weeks 1-2 */}
            <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
              <h3 className="font-bold text-slate-900 text-xl mb-3">
                Weeks 1–2 — Initial Ramp-Up
              </h3>
              <p className="text-gray-700 mb-3">
                Patients begin treatment ramp-up.
              </p>
              <p className="text-gray-700">
                Patients in the stabilization group receive structured behavioral guidance via secure SMS link.
              </p>
            </div>

            {/* Weeks 3-6 */}
            <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
              <h3 className="font-bold text-slate-900 text-xl mb-3">
                Weeks 3–6 — Stabilization Monitoring
              </h3>
              <p className="text-gray-700 mb-3">
                Clinics submit simple weekly metrics (~5 minutes):
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3 ml-4">
                <li>engagement trends</li>
                <li>refill timing patterns</li>
                <li>support load indicators</li>
                <li>early retention signals</li>
              </ul>
              <p className="text-gray-600 text-sm">
                No patient identifiers are submitted. Clinics report simple aggregated counts.
              </p>
            </div>

            {/* Week 7 */}
            <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
              <h3 className="font-bold text-slate-900 text-xl mb-3">
                Week 7 — Data Consolidation
              </h3>
              <p className="text-gray-700">
                RetentionHealth compiles cohort comparison data and operational trends.
              </p>
            </div>

            {/* Week 8 */}
            <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
              <h3 className="font-bold text-slate-900 text-xl mb-3">
                Week 8 — Validation Review
              </h3>
              <p className="text-gray-700 mb-3">
                Clinics receive a full executive summary including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-3 ml-4">
                <li>retention comparison</li>
                <li>estimated revenue preserved</li>
                <li>operational insights</li>
              </ul>
              <p className="text-gray-700">
                Clinics then decide whether to continue into the full production platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* COMPLIANCE & DATA DESIGN */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Compliance & Data Design
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 mb-8">
              The 8-week pilot is intentionally structured to avoid handling Protected Health Information (PHI).
            </p>
            
            <p className="text-lg text-gray-700 mb-6">During pilot:</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">No patient names are collected</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">No EMR integration occurs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">No medical records are accessed</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Because the pilot does not collect Protected Health Information (PHI), a Business Associate Agreement (BAA) is not required during pilot participation</span>
              </li>
            </ul>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <p className="text-lg text-gray-800 font-semibold text-center">
                Pilot design intentionally minimizes regulatory burden while validating measurable stabilization impact.
              </p>
            </div>

            <p className="text-base text-gray-600 mt-8 text-center">
              If the pilot validates measurable retention impact, the full production platform will operate within HIPAA-compliant infrastructure with secure clinic environments and executed BAAs.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* FOUNDER STRUCTURE */}
      <section id="founder-terms" className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            Founder Revenue Share Model
          </h2>
          <p className="text-xl text-gray-600 mb-4 text-center">
            Only for First 6 Clinics
          </p>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-3xl mx-auto mb-8">
            <p className="text-lg font-bold text-red-900 text-center">
              Only 6 clinics will receive Founder pricing.
            </p>
            <p className="text-base text-red-800 text-center mt-2">
              Founder pricing will not be reopened once filled.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-teal-50 p-10 rounded-2xl border-2 border-blue-200 shadow-lg mb-8">
            <p className="text-lg text-gray-700 mb-8">
              If measurable stabilization is demonstrated at Week 8, participating clinics may convert to permanent integration under Founder terms.
            </p>

            <p className="text-lg text-gray-700 mb-8">
              Founder participants receive:
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Lifetime preferred pricing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Priority onboarding</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Case study participation opportunity</span>
              </li>
            </ul>

            <p className="text-sm text-gray-600 italic">
              Direct physician oversight remains fully preserved.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 max-w-3xl mx-auto">
            <p className="text-gray-700 text-center font-semibold">
              Pilot cohort closes once 6 clinics are approved.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* IDEAL PROFILE */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Ideal Clinic Profile
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 mb-8">This pilot is best suited for:</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">50+ active GLP-1 patients</span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Owner-led clinics</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Direct physician oversight</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Willingness to submit weekly metrics</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-lg">Desire to reduce early churn</span>
              </li>
            </ul>

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
              <p className="text-gray-700 font-semibold">
                Not designed for national franchise groups.
              </p>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-lg font-semibold text-blue-900 mb-3">Preview the Interface Before Applying</p>
              <p className="text-gray-700 mb-4">
                Explore the clinic dashboard and patient experience with demo credentials:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/clinic"
                  className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 text-center"
                >
                  Preview Clinic Dashboard
                </a>
                <a
                  href="/patient"
                  className="flex-1 bg-white border-2 border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 text-center"
                >
                  Preview Patient Portal
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* PLATFORM DEVELOPMENT */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Platform Development
          </h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            RetentionHealth is engineered and maintained by <strong>Dig Development</strong>, a software studio specializing in secure operational infrastructure and analytics platforms.
          </p>
          <p className="text-lg text-gray-700 text-center">
            The system architecture maintains a clear separation between pilot validation and future HIPAA-compliant deployment.
          </p>
        </div>
      </section>

      <div className="h-px bg-gray-200"></div>

      {/* APPLY FORM */}
      <section id="apply" className="py-20 bg-white px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">
            Apply for the 8-Week Pilot
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Clinic Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Active GLP-1 Patient Range
                </label>
                <select
                  required
                  value={formData.activePatients}
                  onChange={(e) => setFormData({ ...formData, activePatients: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select range</option>
                  <option value="50-100">50-100</option>
                  <option value="100-200">100-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? "Submitting..." : "Request Pilot Access"}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Spots limited to 6 clinics.</p>
                <p className="text-sm text-gray-500">Applications reviewed within 48 hours.</p>
                <p className="text-sm text-gray-500">
                  No PHI collected. No EMR integration. No long-term contract required during pilot.
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Application Received
              </h3>
              <p className="text-lg text-gray-700">
                Thank you. We'll review your application and reach out within 48 hours.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
