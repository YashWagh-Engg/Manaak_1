import React from 'react';
import { InspectionRecord } from '../types';
import { generateInspectionPdf } from '../lib/pdfReportGenerator';
import { Download, X, AlertTriangle, CheckCircle, Shield, Calendar, Scale, FileText } from 'lucide-react';

interface NoticeModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
  onApproveAndSign?: () => void;
  userRole: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  record,
  onClose,
  onApproveAndSign,
  userRole,
}) => {
  if (!record) return null;

  const { noticeGrading } = record;
  const isSevere = noticeGrading.grade === 'SEVERE';
  const hasViolations = noticeGrading.violationCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-lg max-w-3xl w-full shadow-2xl border border-slate-800 overflow-hidden my-8 text-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                Statutory Memorandum Ref
              </div>
              <h3 className="text-base font-bold text-white">
                Show Cause Notice &amp; Compounding Assessment
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-300 text-sm max-h-[75vh] overflow-y-auto">
          {/* Govt Crest Header */}
          <div className="text-center pb-4 border-b border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono">GOVERNMENT OF INDIA</div>
            <div className="text-xs text-slate-400">Ministry of Consumer Affairs, Food &amp; Public Distribution</div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono">DEPARTMENT OF LEGAL METROLOGY • WEIGHTS &amp; MEASURES</div>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-950 rounded font-mono text-xs text-amber-400 font-semibold border border-slate-800">
              MEMORANDUM REF: {record.id}
            </div>
          </div>

          {/* Severity & Fine Banner */}
          <div
            className={`p-4 rounded border flex flex-wrap items-center justify-between gap-4 ${
              hasViolations
                ? isSevere
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {hasViolations ? (
                <AlertTriangle className={`w-7 h-7 ${isSevere ? 'text-red-400' : 'text-amber-400'}`} />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              )}
              <div>
                <div className="font-bold text-base text-white">
                  {hasViolations ? `Notice Grade: ${noticeGrading.grade}` : 'Fully Compliant Commodity'}
                </div>
                <div className="text-xs opacity-90 font-mono text-slate-400">
                  {hasViolations
                    ? `${noticeGrading.violationCount} statutory infraction(s) detected • Severity Score ${noticeGrading.severityScore}/100`
                    : 'All mandatory Chapter II declarations & Rule 8 font criteria satisfied'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Assessed Compounding Fine
              </div>
              <div className="text-xl font-bold font-mono text-amber-400">
                ₹{noticeGrading.compoundingPenaltyInr.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Product Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Brand:</span>
              <span className="font-semibold text-slate-200">{record.brand}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Declared Qty:</span>
              <span className="font-semibold text-slate-200">{record.declarations.netQuantityText || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Package MRP:</span>
              <span className="font-semibold text-amber-400">{record.declarations.mrpText || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Date:</span>
              <span className="font-semibold text-slate-200">{new Date(record.timestamp).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Specific Grounds of Contravention */}
          <div>
            <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Specific Grounds of Contravention (Section 36(1) LM Act 2009)
            </h4>

            {noticeGrading.summaryOfInfractions.length > 0 ? (
              <ul className="space-y-2">
                {noticeGrading.summaryOfInfractions.map((infraction, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 flex items-start gap-2"
                  >
                    <span className="font-bold text-amber-400 font-mono">[{idx + 1}]</span>
                    <span>{infraction}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-emerald-950/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-mono">
                No contraventions noted during this optical inspection inspection.
              </div>
            )}
          </div>

          {/* Legal Directives */}
          <div className="p-4 bg-slate-950 rounded border-l-2 border-amber-500 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 font-mono uppercase tracking-wider text-[11px]">
              <Calendar className="w-4 h-4 text-amber-400" />
              Statutory 15-Day Show Cause Directive
            </div>
            <p className="leading-relaxed">
              In accordance with Section 36(1) and Section 49 of the Legal Metrology Act, 2009 read with the Legal Metrology (Packaged Commodities) Rules, 2011, you are hereby called upon to show cause in writing within <strong className="text-white">{noticeGrading.showCauseNoticeDays || 15} calendar days</strong> as to why proceedings for compounding or prosecution before the competent Metropolitan Magistrate should not be initiated against you.
            </p>
          </div>

          {/* Signatures and Authority */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
            <div>
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">Inspecting Officer:</span>
              <span className="text-slate-200">{record.inspectorName}</span>
            </div>
            <div className="text-right">
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">Competent Authority:</span>
              <span className="text-slate-200">Assistant Controller of Legal Metrology</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Document format complies with Government of India Form LM-04.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-700 rounded font-medium text-slate-300 hover:bg-slate-800 text-xs transition font-mono"
            >
              Close
            </button>

            {userRole === 'supervisor' && record.status !== 'NOTICE_ISSUED' && onApproveAndSign && (
              <button
                onClick={onApproveAndSign}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded font-semibold text-xs transition flex items-center gap-1.5 shadow"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Approve &amp; Sign
              </button>
            )}

            <button
              onClick={() => generateInspectionPdf(record)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              Download Notice PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
