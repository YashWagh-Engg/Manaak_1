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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full shadow-2xl border border-gray-300 overflow-hidden my-8 text-slate-800">
        {/* Modal Header */}
        <div className="bg-[#003366] text-white p-5 border-b border-[#002244] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 border border-white/20 rounded">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                Statutory Memorandum Ref
              </div>
              <h3 className="text-base font-bold text-white">
                Show Cause Notice &amp; Compounding Assessment
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-700 text-sm max-h-[75vh] overflow-y-auto">
          {/* Govt Crest Header */}
          <div className="text-center pb-4 border-b border-gray-200 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono">GOVERNMENT OF INDIA</div>
            <div className="text-xs text-slate-600">Ministry of Consumer Affairs, Food &amp; Public Distribution</div>
            <div className="text-xs font-bold text-[#003366] uppercase tracking-wider font-mono">DEPARTMENT OF LEGAL METROLOGY • WEIGHTS &amp; MEASURES</div>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-100 rounded font-mono text-xs text-[#003366] font-bold border border-gray-300">
              MEMORANDUM REF: {record.id}
            </div>
          </div>

          {/* Severity & Fine Banner */}
          <div
            className={`p-4 rounded border flex flex-wrap items-center justify-between gap-4 ${
              hasViolations
                ? isSevere
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {hasViolations ? (
                <AlertTriangle className={`w-7 h-7 ${isSevere ? 'text-red-600' : 'text-amber-600'}`} />
              ) : (
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              )}
              <div>
                <div className="font-bold text-base text-slate-900">
                  {hasViolations ? `Notice Grade: ${noticeGrading.grade}` : 'Fully Compliant Commodity'}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  {hasViolations
                    ? `${noticeGrading.violationCount} statutory infraction(s) detected • Severity Score ${noticeGrading.severityScore}/100`
                    : 'All mandatory Chapter II declarations & Rule 8 font criteria satisfied'}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Assessed Compounding Fine
              </div>
              <div className="text-xl font-bold font-mono text-red-700">
                ₹{noticeGrading.compoundingPenaltyInr.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Product Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded border border-gray-200 text-xs font-mono">
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Brand:</span>
              <span className="font-semibold text-slate-800">{record.brand}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Declared Qty:</span>
              <span className="font-semibold text-slate-800">{record.declarations.netQuantityText || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Package MRP:</span>
              <span className="font-semibold text-[#003366]">{record.declarations.mrpText || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Date:</span>
              <span className="font-semibold text-slate-800">{new Date(record.timestamp).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Specific Grounds of Contravention */}
          <div>
            <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-[#003366]" />
              Specific Grounds of Contravention (Section 36(1) LM Act 2009)
            </h4>

            {noticeGrading.summaryOfInfractions.length > 0 ? (
              <ul className="space-y-2">
                {noticeGrading.summaryOfInfractions.map((infraction, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-slate-50 border border-gray-200 rounded text-xs text-slate-800 flex items-start gap-2"
                  >
                    <span className="font-bold text-[#003366] font-mono">[{idx + 1}]</span>
                    <span>{infraction}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-xs font-mono">
                No contraventions noted during this optical inspection inspection.
              </div>
            )}
          </div>

          {/* Legal Directives */}
          <div className="p-4 bg-slate-50 rounded border border-gray-200 border-l-4 border-l-[#FF9933] text-xs text-slate-700 space-y-2">
            <div className="font-bold text-[#003366] flex items-center gap-1.5 font-mono uppercase tracking-wider text-[11px]">
              <Calendar className="w-4 h-4 text-[#003366]" />
              Statutory 15-Day Show Cause Directive
            </div>
            <p className="leading-relaxed text-slate-700">
              In accordance with Section 36(1) and Section 49 of the Legal Metrology Act, 2009 read with the Legal Metrology (Packaged Commodities) Rules, 2011, you are hereby called upon to show cause in writing within <strong className="text-slate-900">{noticeGrading.showCauseNoticeDays || 15} calendar days</strong> as to why proceedings for compounding or prosecution before the competent Metropolitan Magistrate should not be initiated against you.
            </p>
          </div>

          {/* Signatures and Authority */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 text-xs text-slate-600 font-mono">
            <div>
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">Inspecting Officer:</span>
              <span className="text-slate-800 font-semibold">{record.inspectorName}</span>
            </div>
            <div className="text-right">
              <span className="block font-medium text-slate-500 uppercase tracking-wider text-[10px]">Competent Authority:</span>
              <span className="text-slate-800 font-semibold">Assistant Controller of Legal Metrology</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            Document format complies with Government of India Form LM-04.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded font-medium text-slate-700 hover:bg-white text-xs transition font-mono cursor-pointer shadow-xs"
            >
              Close
            </button>

            {userRole === 'supervisor' && record.status !== 'NOTICE_ISSUED' && onApproveAndSign && (
              <button
                onClick={onApproveAndSign}
                className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white rounded font-semibold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                Approve &amp; Sign
              </button>
            )}

            <button
              onClick={() => generateInspectionPdf(record)}
              className="px-4 py-2 bg-[#FF9933] hover:bg-[#E68A00] text-slate-950 rounded font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs cursor-pointer"
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
