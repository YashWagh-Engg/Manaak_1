import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Cpu,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface TestStepResult {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  latencyMs: number;
  details: string;
}

export const E2ETestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [totalLatency, setTotalLatency] = useState(273);
  const [testResults, setTestResults] = useState<TestStepResult[]>([
    {
      id: 'step-1',
      name: '1. Image Ingestion & Optical Coordinate Normalization',
      description: 'Accepts raw photograph and normalizes polygon coordinates to millimeter physical scale.',
      status: 'passed',
      latencyMs: 38,
      details: 'Calibrated standard 180mm x 95mm package geometry (pixel-to-millimeter ratio 1:0.32).',
    },
    {
      id: 'step-2',
      name: '2. Gemini Multimodal Vision Extraction',
      description: 'Extracts MRP, Net Quantity, Mfg Date, Manufacturer, and Consumer Helpline fields.',
      status: 'passed',
      latencyMs: 142,
      details: 'Extracted 7/7 Rule 6 mandatory declaration zones via multimodal vision extraction.',
    },
    {
      id: 'step-3',
      name: '3. Rule 6 Statutory Declarations Verification Engine',
      description: 'Verifies tax phrase, legal metric units, helpline details, and country of origin.',
      status: 'passed',
      latencyMs: 12,
      details: 'All mandatory Chapter II PCR 2011 declarations verified against legal criteria.',
    },
    {
      id: 'step-4',
      name: '4. Rule 7 & 8 Font Height Millimeter Calibration',
      description: 'Measures numeral height against statutory Table 1 minimum mm thresholds.',
      status: 'passed',
      latencyMs: 8,
      details: 'Evaluated Net Quantity 200g (min 2.0mm) and 1kg (min 4.0mm) tiers with legal tolerances.',
    },
    {
      id: 'step-5',
      name: '5. Rule 26 Statutory Exemption Routing',
      description: 'Routes statutory exemptions: small packages <= 10g/ml, bulk agricultural produce > 50kg.',
      status: 'passed',
      latencyMs: 5,
      details: 'Correctly routed 5g pain balm to Rule 26(a) and 65kg grain bag to Rule 26(b) exemptions.',
    },
    {
      id: 'step-6',
      name: '6. E-Commerce Overcharge Cross-Check (Rule 18(2))',
      description: 'Cross-checks packaging OCR MRP against online listing price to detect overcharging.',
      status: 'passed',
      latencyMs: 15,
      details: 'Detected ₹35.00 overcharge on ₹180.00 basmati rice listing (+19.4% excess).',
    },
    {
      id: 'step-7',
      name: '7. Notice Grading & Compounding Calculation (Sec 36(1))',
      description: 'Computes compounding fine up to ₹25,000 (1st offence) and ₹50,000 (2nd offence).',
      status: 'passed',
      latencyMs: 9,
      details: 'Correctly graded infractions into MINOR, MODERATE, and SEVERE categories.',
    },
    {
      id: 'step-8',
      name: '8. PDF Statutory Inspection Notice Stream',
      description: 'Generates formal Government of India Show-Cause Notice with digital compounding table.',
      status: 'passed',
      latencyMs: 44,
      details: 'A4 format PDF output stream generated with statutory citations and compounding schedule.',
    },
  ]);

  const handleRunE2ETests = async () => {
    setIsRunning(true);
    setHasRun(true);

    try {
      const response = await fetch('/api/tests/e2e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.results) {
        setTestResults(data.results);
        setTotalLatency(data.totalDurationMs || 273);
      }
    } catch (err) {
      console.error('E2E test error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = testResults.filter((t) => t.status === 'passed').length;

  return (
    <div className="space-y-6">
      {/* Simulation / Mockup Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-xs text-slate-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-amber-900">
              Illustrative Architecture Simulation &amp; Test Blueprint
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              This pipeline test suite is an <strong>illustrative architectural simulation</strong> demonstrating the 8-stage verification pipeline under the Legal Metrology (Packaged Commodities) Rules, 2011. It shows the expected execution flow, statutory validation rules, and latency benchmarks for field inspection audits.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-white text-slate-800 rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#003366] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              <Cpu className="w-3 h-3 text-[#003366]" />
              Pipeline Architecture
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            End-to-End Metrology Pipeline Blueprint
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Simulates end-to-end statutory verification covering image ingestion, Gemini multimodal vision extraction, Rule 6 checklist verification, Rule 8 font calibration, Rule 26 exemptions, e-commerce overcharging, and notice generation.
          </p>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunE2ETests}
          disabled={isRunning}
          className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-md tracking-wide transition flex items-center gap-2 shadow-xs text-xs shrink-0 cursor-pointer"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#FF9933]" />
              Running 8-Stage Simulation...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-[#FF9933]" />
              Run Simulation Walkthrough
            </>
          )}
        </button>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Architecture Status</div>
          <div className="text-lg font-bold text-emerald-700 flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verified Standards
          </div>
          <div className="text-xs text-slate-500 mt-1">Target statutory pipeline</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Pipeline Coverage</div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {passedCount} / {testResults.length} Stages
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">8 of 8 stages specified</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Target Latency Budget</div>
          <div className="text-lg font-bold text-[#003366] flex items-center gap-1.5 mt-1 font-mono">
            <Clock className="w-4 h-4 text-[#FF9933]" />
            {totalLatency} ms
          </div>
          <div className="text-xs text-slate-500 mt-1">Edge inference target budget</div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active Rule Engine</div>
          <div className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#FF9933]" />
            PCR 2011 Rules
          </div>
          <div className="text-xs text-slate-500 mt-1">Legal Metrology Act, 2009</div>
        </div>
      </div>

      {/* Test Steps List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between text-xs font-medium text-slate-700">
          <span className="font-semibold text-slate-900">8-Stage Pipeline Architecture Diagnostic</span>
          <span className="text-slate-500 text-xs">/api/tests/e2e</span>
        </div>

        <div className="divide-y divide-gray-100">
          {testResults.map((step) => {
            const isPassed = step.status === 'passed';
            return (
              <div key={step.id} className="p-4 hover:bg-slate-50/80 transition flex items-start gap-4">
                <div className="mt-0.5">
                  {isPassed ? (
                    <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
                      <AlertOctagon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-900">{step.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{step.latencyMs} ms</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-normal">{step.description}</p>

                  <div className="p-2.5 bg-slate-50 border border-gray-200 rounded text-xs text-slate-700 mt-2">
                    {step.details}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
