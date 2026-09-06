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
      <div className="bg-white text-slate-800 rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#003366] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              <Layers className="w-3 h-3 text-[#003366]" />
              Standard Benchmark Corpus
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Inspection Test Corpus &amp; Case Library
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Pre-loaded with 22 authentic Indian pre-packaged commodities representing fully compliant goods, staged Rule 6 / Rule 8 font infractions, Rule 18(2) overcharging, and Rule 26 statutory exemptions.
          </p>
        </div>

        {/* Count Pill */}
        <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-gray-200 text-right shrink-0">
          <div className="text-xs text-slate-500 font-medium">Corpus Volume</div>
          <div className="text-xl font-bold font-mono text-[#003366]">
            {SEED_INSPECTION_DATASET.length} Ground-Truth Cases
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by brand, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-gray-300 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#003366] text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap font-medium cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-gray-300 hover:bg-slate-50'
            }`}
          >
            All Items ({SEED_INSPECTION_DATASET.length})
          </button>

          <button
            onClick={() => setStatusFilter('COMPLIANT')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap flex items-center gap-1.5 font-medium cursor-pointer ${
              statusFilter === 'COMPLIANT'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-emerald-800 border border-gray-300 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliant
          </button>

          <button
            onClick={() => setStatusFilter('VIOLATION')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap flex items-center gap-1.5 font-medium cursor-pointer ${
              statusFilter === 'VIOLATION'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-white text-red-800 border border-gray-300 hover:bg-red-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Violations
          </button>

          <button
            onClick={() => setStatusFilter('EXEMPT')}
            className={`px-3 py-1.5 rounded-md transition whitespace-nowrap flex items-center gap-1.5 font-medium cursor-pointer ${
              statusFilter === 'EXEMPT'
                ? 'bg-[#003366] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-gray-300 hover:bg-slate-50'
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
              className="bg-white rounded-lg border border-gray-200 shadow-xs hover:border-gray-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Label Thumbnail */}
                <div className="h-44 bg-slate-50 p-3 flex items-center justify-center border-b border-gray-100 relative group overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="max-h-full max-w-full object-contain rounded shadow-xs group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Status Pill on Thumbnail */}
                  <div className="absolute top-3 left-3">
                    {item.id === 'INSP-2026-000' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 shadow-xs">
                        Camera Scan Slot
                      </span>
                    ) : isExempt ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200 shadow-xs">
                        Rule 26 Exempt
                      </span>
                    ) : hasViolations ? (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium shadow-xs ${
                          isSevere
                            ? 'bg-red-50 text-red-900 border border-red-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {item.noticeGrading.grade === 'SEVERE' ? 'Severe Violation' : 'Minor Violation'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
                        Compliant
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 text-xs font-mono bg-white/95 text-slate-600 border border-gray-200 px-2 py-0.5 rounded shadow-xs">
                    {item.id}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-[#003366] font-semibold">
                        {item.brand}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                        {item.productName}
                      </h3>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border border-gray-200 text-slate-600 shrink-0">
                      {item.category}
                    </span>
                  </div>

                  {/* Key Stats Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded border border-gray-100">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Net Quantity:</span>
                      <span className="font-semibold text-slate-800">
                        {item.declarations.netQuantityText || 'Missing'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">Package MRP:</span>
                      <span className="font-bold text-[#003366] font-mono">
                        {item.declarations.mrpValue ? `₹${item.declarations.mrpValue.toFixed(2)}` : 'Missing'}
                      </span>
                    </div>
                  </div>

                  {/* Summary / Infraction highlight */}
                  <div className="text-xs text-slate-600 min-h-[36px] line-clamp-2 leading-relaxed">
                    {isExempt ? (
                      <span className="text-blue-800 font-medium">{item.exemption.reason}</span>
                    ) : hasViolations ? (
                      <span className="text-red-700 font-medium">
                        {item.noticeGrading.summaryOfInfractions[0] || 'Rule contravention detected.'}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium">
                        Fully compliant under Rule 6, 8, &amp; 18(2) of PCR 2011.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                {hasViolations ? (
                  <button
                    onClick={() => onOpenNotice(item)}
                    className="text-[#003366] hover:text-[#002244] text-xs flex items-center gap-1 font-medium cursor-pointer"
                  >
                    View Notice (₹{item.noticeGrading.compoundingPenaltyInr.toLocaleString('en-IN')})
                  </button>
                ) : (
                  <button
                    onClick={() => generateInspectionPdf(item)}
                    className="text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Memo PDF
                  </button>
                )}

                <button
                  onClick={() => onInspectItem(item)}
                  className="px-3 py-1.5 bg-[#003366] hover:bg-[#002244] text-white rounded-md font-medium text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect in Scanner
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
