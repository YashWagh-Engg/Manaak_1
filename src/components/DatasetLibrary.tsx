import React, { useState } from 'react';
import { InspectionRecord } from '../types';
import { SEED_INSPECTION_DATASET } from '../data/seedDataset';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Eye,
  Scale,
  Sparkles,
  Download,
} from 'lucide-react';
import { generateInspectionPdf } from '../lib/pdfReportGenerator';

interface DatasetLibraryProps {
  onSelectItem: (item: InspectionRecord) => void;
  onInspectItem: (item: InspectionRecord) => void;
  onOpenNotice: (item: InspectionRecord) => void;
}

export const DatasetLibrary: React.FC<DatasetLibraryProps> = ({
  onSelectItem,
  onInspectItem,
  onOpenNotice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'VIOLATION' | 'EXEMPT'>('ALL');

  const filteredItems = SEED_INSPECTION_DATASET.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'COMPLIANT') {
      return item.noticeGrading.violationCount === 0 && !item.exemption.isExempt;
    }
    if (statusFilter === 'VIOLATION') {
      return item.noticeGrading.violationCount > 0;
    }
    if (statusFilter === 'EXEMPT') {
      return item.exemption.isExempt;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Module 4: Benchmark Corpus
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">22 Pre-Packaged Commodities</span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Curated Inspection Test Corpus &amp; Case Library
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Pre-loaded with 22 authentic Indian pre-packaged commodities representing fully compliant goods, staged Rule 6 / Rule 8 font infractions, Rule 18(2) overcharging, and Rule 26 statutory exemptions.
          </p>
        </div>

        {/* Count Pill */}
        <div className="bg-slate-950 px-4 py-2 rounded border border-slate-800 text-right">
          <div className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Corpus Volume</div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {SEED_INSPECTION_DATASET.length} Ground-Truth Cases
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-amber-500 text-xs font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 font-mono text-[11px]">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded transition whitespace-nowrap uppercase tracking-wider ${
              statusFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            All Items ({SEED_INSPECTION_DATASET.length})
          </button>

          <button
            onClick={() => setStatusFilter('COMPLIANT')}
            className={`px-3 py-1.5 rounded transition whitespace-nowrap flex items-center gap-1 uppercase tracking-wider ${
              statusFilter === 'COMPLIANT'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-emerald-400 border border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliant
          </button>

          <button
            onClick={() => setStatusFilter('VIOLATION')}
            className={`px-3 py-1.5 rounded transition whitespace-nowrap flex items-center gap-1 uppercase tracking-wider ${
              statusFilter === 'VIOLATION'
                ? 'bg-red-500 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-950 text-red-400 border border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Violations
          </button>

          <button
            onClick={() => setStatusFilter('EXEMPT')}
            className={`px-3 py-1.5 rounded transition whitespace-nowrap flex items-center gap-1 uppercase tracking-wider ${
              statusFilter === 'EXEMPT'
                ? 'bg-indigo-500 text-white font-bold shadow-xs'
                : 'bg-slate-950 text-indigo-400 border border-slate-800 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Rule 26 Exempt
          </button>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const isExempt = item.exemption.isExempt;
          const hasViolations = item.noticeGrading.violationCount > 0;
          const isSevere = item.noticeGrading.grade === 'SEVERE';

          return (
            <div
              key={item.id}
              className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Label Thumbnail */}
                <div className="h-44 bg-slate-950 p-3 flex items-center justify-center border-b border-slate-800 relative group overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="max-h-full max-w-full object-contain rounded shadow-xs group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Pill on Thumbnail */}
                  <div className="absolute top-3 left-3">
                    {item.id === 'INSP-2026-000' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow">
                        CAMERA SCAN SLOT
                      </span>
                    ) : isExempt ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 shadow">
                        RULE 26 EXEMPT
                      </span>
                    ) : hasViolations ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono shadow ${
                          isSevere
                            ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {item.noticeGrading.grade} VIOLATION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow">
                        COMPLIANT
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
                    {item.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-mono text-amber-400 font-bold">
                        {item.brand}
                      </div>
                      <h3 className="font-semibold text-white text-sm line-clamp-1">
                        {item.productName}
                      </h3>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-slate-400 shrink-0">
                      {item.category}
                    </span>
                  </div>

                  {/* Key Stats Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-2.5 rounded border border-slate-800 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Net Qty:</span>
                      <span className="font-bold text-slate-200">
                        {item.declarations.netQuantityText || 'Missing'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Package MRP:</span>
                      <span className="font-bold text-amber-400">
                        {item.declarations.mrpValue ? `₹${item.declarations.mrpValue.toFixed(2)}` : 'Missing'}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Infraction highlight */}
                  <div className="text-[11px] text-slate-400 min-h-[36px] line-clamp-2">
                    {isExempt ? (
                      <span className="text-indigo-400 font-medium">{item.exemption.reason}</span>
                    ) : hasViolations ? (
                      <span className="text-red-400 font-medium">
                        {item.noticeGrading.summaryOfInfractions[0] || 'Rule contravention detected.'}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">
                        Fully compliant under Rule 6, 8, &amp; 18(2) of PCR 2011.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                {hasViolations ? (
                  <button
                    onClick={() => onOpenNotice(item)}
                    className="text-amber-400 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1"
                  >
                    View Notice (₹{item.noticeGrading.compoundingPenaltyInr.toLocaleString('en-IN')})
                  </button>
                ) : (
                  <button
                    onClick={() => generateInspectionPdf(item)}
                    className="text-slate-400 hover:text-slate-200 font-mono text-[11px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Memo PDF
                  </button>
                )}

                <button
                  onClick={() => onInspectItem(item)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold text-xs uppercase tracking-wider transition flex items-center gap-1 shadow-lg shadow-amber-500/20"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect In Scanner
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
