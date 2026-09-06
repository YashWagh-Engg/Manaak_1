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
      <div className="bg-white text-slate-800 rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#003366] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              <Scale className="w-3 h-3 text-[#003366]" />
              Rule 18(2) Surveillance
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            E-Commerce Pricing &amp; Dual-Pricing Cross-Check
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
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
            className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 text-xs font-medium transition cursor-pointer shadow-xs"
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
            className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 text-xs font-medium transition cursor-pointer shadow-xs"
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
            className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-gray-300 text-xs font-medium transition cursor-pointer shadow-xs"
          >
            Compliant (₹28 vs ₹28)
          </button>
        </div>
      </div>

      {/* Main Grid: Input / Cross-Check Card (Left) and Assessment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#003366]" />
              Surveillance Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Product Title / SKU:</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">E-Commerce Platform / Marketplace:</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Seller / Corporate Entity Name:</label>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-slate-800 text-xs focus:outline-none focus:border-[#003366]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Package MRP (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={packageMrp}
                      onChange={(e) => setPackageMrp(Number(e.target.value))}
                      className="w-full pl-6 pr-3 py-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    From physical label
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Online Listed Price (₹):
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(Number(e.target.value))}
                      className="w-full pl-6 pr-3 py-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Checkout price on portal
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleEvaluate()}
                disabled={isEvaluating}
                className="w-full mt-3 py-2.5 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-md text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
          <div className="bg-white rounded-lg p-5 border border-gray-200 text-xs text-slate-600 space-y-2 shadow-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <Scale className="w-4 h-4 text-[#003366]" />
              Statutory Basis: Rule 18(2), PCR 2011
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              "No retail dealer or other person including manufacturer, packer, importer or e-commerce entity shall sell any pre-packaged commodity at a price exceeding the maximum retail price stated on the package."
            </p>
            <p className="text-xs text-slate-500 pt-2 border-t border-gray-100">
              Contravention is punishable under Section 36(1) of the Legal Metrology Act, 2009 with compounding fine up to ₹25,000 for the first offence, and up to ₹50,000 for subsequent offences.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Side-by-Side Comparison */}
        <div className="lg:col-span-7 space-y-5">
          {/* Status Banner */}
          <div
            className={`p-5 rounded-lg border shadow-xs ${
              result.isOvercharging
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {result.isOvercharging ? (
                  <div className="p-2 bg-red-600 text-white rounded shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-600 text-white rounded shadow-xs">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-slate-700">
                    {result.isOvercharging ? 'Illegal Overcharge Detected' : 'Price Compliant'}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                    {result.isOvercharging
                      ? `Listed Price exceeds MRP by ₹${result.differenceAmount.toFixed(2)} (+${result.percentageOvercharge}%)`
                      : 'No Overcharging. Listed at or below Maximum Retail Price.'}
                  </h3>
                </div>
              </div>

              {/* Penalty Amount */}
              {result.isOvercharging && (
                <div className="bg-white p-3 rounded-md border border-red-200 text-right min-w-[140px] shadow-xs">
                  <span className="text-xs font-medium text-slate-600 block">
                    Statutory Fine
                  </span>
                  <span className="text-xl font-bold font-mono text-red-700">
                    ₹{notice.compoundingPenaltyInr.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Verification Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Packaging Physical Card */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-gray-100">
                <span className="font-semibold text-slate-800">Physical Packaging Evidence</span>
                <span className="text-slate-500 text-xs font-medium">Ground Truth</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500">Package Maximum Retail Price:</div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  ₹{result.packageMrp.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500">
                  Includes all statutory taxes (Rule 6(1)(e))
                </div>
              </div>
            </div>

            {/* Online Portal Card */}
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-gray-100">
                <span className="font-semibold text-slate-800">{result.platform}</span>
                <span className="text-slate-500 text-xs font-medium">Online Listing</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500">Active Checkout Price:</div>
                <div
                  className={`text-2xl font-bold font-mono ${
                    result.isOvercharging ? 'text-amber-600' : 'text-emerald-700'
                  }`}
                >
                  ₹{result.listingPrice.toFixed(2)}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1">
                  {result.isOvercharging ? (
                    <span className="text-red-700 font-semibold flex items-center gap-1 text-xs">
                      <TrendingUp className="w-3.5 h-3.5" /> +₹{result.differenceAmount.toFixed(2)} Excess Markup
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium flex items-center gap-1 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" /> Price strictly adheres to package MRP
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contravention Details Card */}
          {result.isOvercharging && (
            <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-xs space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#003366]" />
                Statutory Show-Cause Findings
              </h4>

              <div className="p-4 bg-slate-50 border border-gray-200 border-l-4 border-l-[#FF9933] rounded-md text-xs space-y-2">
                <div className="font-semibold text-xs text-[#003366]">
                  STATUTORY BREACH: {result.violationRule}
                </div>
                <p className="leading-relaxed text-slate-700">
                  The subject product <strong className="text-slate-900">"{result.listingTitle}"</strong> offered on <strong className="text-slate-900">{result.platform}</strong> at <strong className="text-amber-700">₹{result.listingPrice.toFixed(2)}</strong> violates Rule 18(2) of the Legal Metrology (Packaged Commodities) Rules, 2011, as the declared Maximum Retail Price (MRP) printed on the manufacturer's packaging is <strong className="text-slate-900">₹{result.packageMrp.toFixed(2)}</strong>. The excess markup of <strong className="text-red-700">₹{result.differenceAmount.toFixed(2)} (+{result.percentageOvercharge}%)</strong> constitutes illegal dual pricing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-slate-600">
                  Statutory Notice Response Window: <strong className="text-[#003366]">15 Days</strong>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onOpenNoticeModal(buildCurrentInspectionRecord())}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-gray-300 text-slate-700 rounded-md text-xs font-medium transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    Notice Memorandum
                  </button>

                  <button
                    onClick={() => generateInspectionPdf(buildCurrentInspectionRecord())}
                    className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-md text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer"
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
