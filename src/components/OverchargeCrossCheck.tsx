import React, { useState } from 'react';
import { OverchargeResult, NoticeGradingResult, UserRole, InspectionRecord } from '../types';
import { SEED_INSPECTION_DATASET } from '../data/seedDataset';
import { generateInspectionPdf } from '../lib/pdfReportGenerator';
import {
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Scale,
  RefreshCw,
  FileText,
  Download,
  Building2,
  Tag,
  CheckCircle,
} from 'lucide-react';

interface OverchargeCrossCheckProps {
  currentRole: UserRole;
  onOpenNoticeModal: (record: InspectionRecord) => void;
}

export const OverchargeCrossCheck: React.FC<OverchargeCrossCheckProps> = ({
  currentRole,
  onOpenNoticeModal,
}) => {
  // Preset scenarios
  const [productTitle, setProductTitle] = useState('Daawat Rozana Super Basmati Rice 5kg');
  const [platform, setPlatform] = useState('Amazon India / Quick-Commerce');
  const [packageMrp, setPackageMrp] = useState<number>(180);
  const [listingPrice, setListingPrice] = useState<number>(215);
  const [sellerName, setSellerName] = useState('Alpha Retailers Private Limited');
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Evaluation outcome state
  const [result, setResult] = useState<OverchargeResult>({
    packageMrp: 180,
    listingPrice: 215,
    differenceAmount: 35,
    percentageOvercharge: 19.44,
    isOvercharging: true,
    platform: 'Amazon India / Quick-Commerce',
    listingTitle: 'Daawat Rozana Super Basmati Rice 5kg',
    violationRule: 'Rule 18(2), PCR 2011 & Section 36(1) of Legal Metrology Act, 2009',
  });

  const [notice, setNotice] = useState<NoticeGradingResult>({
    grade: 'SEVERE',
    severityScore: 85,
    compoundingPenaltyInr: 25000,
    statutorySections: ['Rule 18(2) PCR 2011', 'Section 36(1) of LM Act 2009'],
    violationCount: 1,
    offenceType: 'FIRST_OFFENCE',
    showCauseNoticeDays: 15,
    summaryOfInfractions: [
      'Rule 18(2) Overcharging: Online listed price ₹215.00 exceeds physical package Maximum Retail Price (MRP) ₹180.00 by ₹35.00 (+19.44% dual pricing markup).',
    ],
  });

  // Evaluate via API or client engine
  const handleEvaluate = async (mrp = packageMrp, price = listingPrice, plat = platform, title = productTitle) => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/overcharge-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageMrp: mrp,
          listingPrice: price,
          platform: plat,
          listingTitle: title,
        }),
      });

      const data = await response.json();
      if (data.result && data.noticeGrading) {
        setResult(data.result);
        setNotice(data.noticeGrading);
      }
    } catch (err) {
      console.error('Overcharge check error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectPreloadCase = (item: typeof SEED_INSPECTION_DATASET[0]) => {
    const mrp = item.declarations.mrpValue || 100;
    const price = item.overchargeCheck?.listingPrice || mrp + 25;
    const plat = item.overchargeCheck?.platform || 'E-Commerce Platform';
    const title = item.productName;

    setProductTitle(title);
    setPlatform(plat);
    setPackageMrp(mrp);
    setListingPrice(price);
    handleEvaluate(mrp, price, plat, title);
  };

  // Construct a dummy inspection record for PDF generation
  const buildCurrentInspectionRecord = (): InspectionRecord => ({
    id: `ECOM-NOTICE-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    productName: productTitle,
    brand: sellerName,
    category: 'E-Commerce Retail Listing',
    packageHeightMm: 220,
    packageWidthMm: 110,
    imageUrl: '',
    declarations: {
      mrpText: `₹${packageMrp.toFixed(2)} (incl. of all taxes)`,
      mrpValue: packageMrp,
      hasInclusiveOfTaxes: true,
      netQuantityText: 'Packaged SKU',
      netQuantityValue: 1,
      netQuantityUnit: 'unit',
      mfgMonthYear: '08/2026',
      bestBefore: '12 Months',
      manufacturerName: sellerName,
      manufacturerAddress: 'Industrial Zone, India',
      packerOrImporter: sellerName,
      consumerCarePhone: '1800-11-2233',
      consumerCareEmail: 'care@seller.in',
      consumerCareAddress: 'Customer Cell, India',
      countryOfOrigin: 'India',
      rawOcrText: `MRP ₹${packageMrp.toFixed(2)} LISTED ₹${listingPrice.toFixed(2)}`,
      detectedBoxes: [],
    },
    fontValidations: [],
    exemption: { isExempt: false, clause: '', reason: '' },
    overchargeCheck: result,
    noticeGrading: notice,
    status: result.isOvercharging ? 'PENDING_REVIEW' : 'VERIFIED',
    inspectorName: currentRole === 'admin' ? 'Chief Metrology Admin' : currentRole === 'supervisor' ? 'Legal Supervisor' : 'E-Commerce Surveillance Officer',
    inspectorRole: currentRole,
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Module 2: Persona A Surveillance
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Rule 18(2) PCR 2011 &amp; Sec 36(1)
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Overcharging &amp; Dual-Pricing Surveillance Cross-Check
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Compares physical package Maximum Retail Price (MRP) against e-commerce platform retail checkout prices to detect and penalize illegal online overcharging under Rule 18(2).
          </p>
        </div>

        {/* Quick Test Case Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setProductTitle('Daawat Rozana Super Basmati Rice 5kg');
              setPlatform('Amazon Fresh / Blinkit');
              setPackageMrp(180);
              setListingPrice(215);
              handleEvaluate(180, 215, 'Amazon Fresh / Blinkit', 'Daawat Rozana Super Basmati Rice 5kg');
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition"
          >
            Rice (₹180 vs ₹215)
          </button>

          <button
            onClick={() => {
              setProductTitle('Sri Vedic Organic A2 Cow Desi Ghee 1L');
              setPlatform('Quick-Commerce App');
              setPackageMrp(650);
              setListingPrice(720);
              handleEvaluate(650, 720, 'Quick-Commerce App', 'Sri Vedic Organic A2 Cow Desi Ghee 1L');
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium transition"
          >
            Ghee (₹650 vs ₹720)
          </button>

          <button
            onClick={() => {
              setProductTitle('Tata Salt Vacuum Evaporated 1kg');
              setPlatform('Verified E-Retail');
              setPackageMrp(28);
              setListingPrice(28);
              handleEvaluate(28, 28, 'Verified E-Retail', 'Tata Salt Vacuum Evaporated 1kg');
            }}
            className="px-3 py-1.5 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-700/50 text-xs font-mono font-medium transition"
          >
            Compliant (₹28 vs ₹28)
          </button>
        </div>
      </div>

      {/* Main Grid: Input / Cross-Check Card (Left) and Assessment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2 font-mono">
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              Surveillance Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-400 mb-1 font-mono text-[11px] uppercase tracking-wider">Product Title / SKU:</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1 font-mono text-[11px] uppercase tracking-wider">E-Commerce Platform / Marketplace:</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1 font-mono text-[11px] uppercase tracking-wider">Seller / Corporate Entity Name:</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-medium text-slate-400 mb-1 font-mono text-[11px] uppercase tracking-wider">
                    Package MRP (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={packageMrp}
                      onChange={(e) => setPackageMrp(Number(e.target.value))}
                      className="w-full pl-6 pr-3 py-2 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    Extracted from physical label
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-slate-400 mb-1 font-mono text-[11px] uppercase tracking-wider">
                    Online Listed Price (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(Number(e.target.value))}
                      className="w-full pl-6 pr-3 py-2 bg-slate-950 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    Checkout price on portal
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleEvaluate()}
                disabled={isEvaluating}
                className="w-full mt-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing Rule 18(2) Cross-Check...
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    Execute Overcharge Cross-Check
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Statutory Law Citation Card */}
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 text-xs text-slate-400 space-y-2 font-mono">
            <div className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Scale className="w-4 h-4 text-amber-500" />
              Statutory Basis: Rule 18(2), PCR 2011
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              "No retail dealer or other person including manufacturer, packer, importer or e-commerce entity shall sell any pre-packaged commodity at a price exceeding the maximum retail price stated on the package."
            </p>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Contravention is punishable under Section 36(1) of the Legal Metrology Act, 2009 with compounding fine up to ₹25,000 for the first offence, and up to ₹50,000 for subsequent offences.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Side-by-Side Comparison */}
        <div className="lg:col-span-7 space-y-4">
          {/* Status Banner */}
          <div
            className={`p-5 rounded-lg border shadow-sm ${
              result.isOvercharging
                ? 'bg-red-950/20 border-red-500/40 text-red-200'
                : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {result.isOvercharging ? (
                  <div className="p-2.5 bg-red-600 text-white rounded shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-600 text-white rounded shadow-sm">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                    {result.isOvercharging ? 'ILLEGAL OVERCHARGE DETECTED' : 'PRICE COMPLIANT'}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {result.isOvercharging
                      ? `Listed Price exceeds MRP by ₹${result.differenceAmount.toFixed(2)} (+${result.percentageOvercharge}%)`
                      : 'No Overcharging. Listed at or below Maximum Retail Price.'}
                  </h3>
                </div>
              </div>

              {/* Penalty Amount */}
              {result.isOvercharging && (
                <div className="bg-slate-900 p-3 rounded border border-red-500/40 text-right min-w-[150px]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                    Statutory Fine
                  </span>
                  <span className="text-xl font-bold font-mono text-red-400">
                    ₹{notice.compoundingPenaltyInr.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Verification Cards - Geometric style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Packaging Physical Card */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-300">Physical Packaging Evidence</span>
                <span className="font-mono text-amber-400 font-semibold text-[10px] uppercase">Ground Truth</span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Package Maximum Retail Price:</div>
                <div className="text-3xl font-bold font-mono text-white">
                  ₹{result.packageMrp.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Includes all statutory taxes (Rule 6(1)(e))
                </div>
              </div>
            </div>

            {/* Online Portal Card */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-300">{result.platform}</span>
                <span className="font-mono text-amber-400 font-semibold text-[10px] uppercase">Online Listing</span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">Active Checkout Price:</div>
                <div
                  className={`text-3xl font-bold font-mono ${
                    result.isOvercharging ? 'text-amber-500' : 'text-emerald-400'
                  }`}
                >
                  ₹{result.listingPrice.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  {result.isOvercharging ? (
                    <span className="text-red-400 font-semibold flex items-center gap-1 font-mono text-xs">
                      <TrendingUp className="w-3.5 h-3.5" /> +₹{result.differenceAmount.toFixed(2)} Excess Markup
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" /> Price strictly adheres to package MRP
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contravention Details Card */}
          {result.isOvercharging && (
            <div className="bg-slate-900 rounded-lg p-5 border border-slate-800 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <FileText className="w-4 h-4 text-amber-500" />
                Statutory Show-Cause Findings
              </h4>

              <div className="p-4 bg-slate-950 border-l-2 border-amber-500 rounded-r text-xs space-y-2">
                <div className="font-bold font-mono text-[10px] text-amber-400 uppercase tracking-wider">
                  STATUTORY BREACH: {result.violationRule}
                </div>
                <p className="leading-relaxed text-slate-300">
                  The subject product <strong className="text-white">"{result.listingTitle}"</strong> offered on <strong className="text-white">{result.platform}</strong> at <strong className="text-amber-400">₹{result.listingPrice.toFixed(2)}</strong> violates Rule 18(2) of the Legal Metrology (Packaged Commodities) Rules, 2011, as the declared Maximum Retail Price (MRP) printed on the manufacturer's packaging is <strong className="text-white">₹{result.packageMrp.toFixed(2)}</strong>. The excess markup of <strong className="text-amber-400">₹{result.differenceAmount.toFixed(2)} (+{result.percentageOvercharge}%)</strong> constitutes illegal dual pricing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-mono">
                  Statutory Notice Response Window: <strong className="text-amber-400">15 Days</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenNoticeModal(buildCurrentInspectionRecord())}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    Notice Memorandum
                  </button>

                  <button
                    onClick={() => generateInspectionPdf(buildCurrentInspectionRecord())}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF Notice
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
