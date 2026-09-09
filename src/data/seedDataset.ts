import { InspectionRecord } from '../types';

// Helper to generate SVG mock image for package label
export function generateLabelSvg(
  brand: string,
  title: string,
  mrp: string,
  netQty: string,
  mfgDate: string,
  mfgName: string,
  consumerCare: string,
  countryOfOrigin: string,
  flagBadField?: string
): string {
  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
  </defs>
  <!-- Package Outline -->
  <rect x="10" y="10" width="480" height="630" rx="14" fill="url(#bgGrad)" stroke="#cbd5e1" stroke-width="3" />
  
  <!-- Header Bar -->
  <rect x="25" y="25" width="450" height="70" rx="8" fill="#1e293b" />
  <text x="250" y="55" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="#38bdf8" text-anchor="middle">${brand.toUpperCase()}</text>
  <text x="250" y="78" font-family="system-ui, sans-serif" font-size="14" fill="#f8fafc" text-anchor="middle">${title}</text>

  <!-- Product Graphics Box -->
  <rect x="25" y="110" width="450" height="150" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" />
  <circle cx="250" cy="175" r="45" fill="#f0fdf4" stroke="#86efac" stroke-width="2" />
  <text x="250" y="182" font-family="system-ui, sans-serif" font-size="32" text-anchor="middle">📦</text>
  <text x="250" y="240" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#475569" text-anchor="middle">PRE-PACKAGED COMMODITY • LEGAL METROLOGY PCR 2011</text>

  <!-- Principal Display Panel (Declarations) -->
  <rect x="25" y="275" width="450" height="345" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
  <rect x="25" y="275" width="450" height="28" rx="8" fill="#f1f5f9" />
  <text x="40" y="294" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">STATUTORY DECLARATIONS (RULE 6 PCR 2011)</text>

  <!-- Declarations Content -->
  <!-- Net Quantity -->
  <g id="box-netqty">
    <rect x="40" y="315" width="420" height="34" fill="${flagBadField === 'netQty' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'netQty' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="337" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#1e293b">Net Quantity:</text>
    <text x="150" y="337" font-family="system-ui, sans-serif" font-size="${flagBadField === 'netQtyFont' ? '9' : '14'}" font-weight="bold" fill="${flagBadField === 'netQtyFont' ? '#b91c1c' : '#047857'}">${netQty}</text>
  </g>

  <!-- MRP -->
  <g id="box-mrp">
    <rect x="40" y="358" width="420" height="34" fill="${flagBadField === 'mrp' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'mrp' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="380" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#1e293b">MRP (Max Retail Price):</text>
    <text x="210" y="380" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${flagBadField === 'mrp' ? '#b91c1c' : '#0284c7'}">${mrp}</text>
  </g>

  <!-- Date of Mfg -->
  <g id="box-mfgdate">
    <rect x="40" y="401" width="420" height="34" fill="${flagBadField === 'mfgDate' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'mfgDate' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="423" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#1e293b">Mfg / Pkg Date:</text>
    <text x="170" y="423" font-family="system-ui, sans-serif" font-size="13" fill="#334155">${mfgDate || 'NOT DECLARED [MISSING]'}</text>
  </g>

  <!-- Manufacturer -->
  <g id="box-mfg">
    <rect x="40" y="444" width="420" height="42" fill="${flagBadField === 'mfg' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'mfg' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="462" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1e293b">Mfd / Pkd By:</text>
    <text x="140" y="462" font-family="system-ui, sans-serif" font-size="11" fill="#475569">${mfgName}</text>
  </g>

  <!-- Consumer Care -->
  <g id="box-consumercare">
    <rect x="40" y="495" width="420" height="42" fill="${flagBadField === 'consumerCare' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'consumerCare' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="513" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1e293b">Consumer Care:</text>
    <text x="150" y="513" font-family="system-ui, sans-serif" font-size="11" fill="${flagBadField === 'consumerCare' ? '#b91c1c' : '#475569'}">${consumerCare || 'NOT PROVIDED [MISSING]'}</text>
  </g>

  <!-- Country of Origin -->
  <g id="box-origin">
    <rect x="40" y="546" width="420" height="34" fill="${flagBadField === 'countryOfOrigin' ? '#fee2e2' : '#f8fafc'}" rx="4" stroke="${flagBadField === 'countryOfOrigin' ? '#ef4444' : '#e2e8f0'}" />
    <text x="50" y="568" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#1e293b">Country of Origin:</text>
    <text x="170" y="568" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${flagBadField === 'countryOfOrigin' ? '#b91c1c' : '#047857'}">${countryOfOrigin || 'NOT DECLARED [MISSING]'}</text>
  </g>

  <!-- Barcode Footer -->
  <line x1="50" y1="595" x2="450" y2="595" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4" />
  <text x="250" y="612" font-family="monospace" font-size="11" fill="#94a3b8" text-anchor="middle">||| | ||||| || |||||| | ||| 8901030918234</text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Helper to generate clean empty slot placeholder for new camera scans
export function generateEmptySlotSvg(): string {
  const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="100%" height="100%">
  <defs>
    <linearGradient id="emptyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <!-- Frame Outer -->
  <rect x="10" y="10" width="480" height="630" rx="14" fill="url(#emptyBg)" stroke="#334155" stroke-width="2" stroke-dasharray="8 6" />
  
  <!-- Reticle Corners -->
  <path d="M 40 80 L 40 40 L 80 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <path d="M 460 80 L 460 40 L 420 40" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <path d="M 40 570 L 40 610 L 80 610" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />
  <path d="M 460 570 L 460 610 L 420 610" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" />

  <!-- Camera Graphic Center -->
  <circle cx="250" cy="240" r="54" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" />
  <circle cx="250" cy="240" r="36" fill="#0f172a" stroke="#64748b" stroke-width="1.5" />
  <circle cx="264" cy="226" r="6" fill="#f59e0b" opacity="0.8" />
  <circle cx="250" cy="240" r="18" fill="#1e293b" />

  <!-- Center Crosshairs -->
  <line x1="250" y1="160" x2="250" y2="175" stroke="#f59e0b" stroke-width="2" />
  <line x1="250" y1="305" x2="250" y2="320" stroke="#f59e0b" stroke-width="2" />
  <line x1="170" y1="240" x2="185" y2="240" stroke="#f59e0b" stroke-width="2" />
  <line x1="315" y1="240" x2="330" y2="240" stroke="#f59e0b" stroke-width="2" />

  <!-- Instruction Text -->
  <text x="250" y="360" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#f8fafc" text-anchor="middle">READY FOR CAMERA SCAN</text>
  <text x="250" y="388" font-family="system-ui, sans-serif" font-size="13" fill="#94a3b8" text-anchor="middle">Clean Blank Slot • No Preloaded Default</text>
  
  <rect x="60" y="420" width="380" height="52" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
  <text x="250" y="452" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="#f59e0b" text-anchor="middle">Tap [Open Real Camera] or [Mobile Snap]</text>

  <rect x="60" y="488" width="380" height="42" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1" />
  <text x="250" y="514" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" text-anchor="middle">Captured labels will generate clean PDF show-cause notices</text>

  <text x="250" y="580" font-family="monospace" font-size="11" fill="#64748b" text-anchor="middle">STATUTORY METROLOGY PCR 2011 • PADDLEOCR ENGINE</text>
</svg>
  `.trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const SEED_INSPECTION_DATASET: InspectionRecord[] = [
  // 0. Clean Blank Slot for Real Camera / Mobile Inspections
  {
    id: 'INSP-2026-000',
    timestamp: '2026-09-04T00:00:00Z',
    productName: 'Live Camera Commodity (Blank Slot)',
    brand: 'Pending Camera Scan',
    category: 'Packaged Commodity',
    packageHeightMm: 180,
    packageWidthMm: 95,
    imageUrl: generateEmptySlotSvg(),
    declarations: {
      mrpText: '',
      mrpValue: 0,
      hasInclusiveOfTaxes: false,
      netQuantityText: '',
      netQuantityValue: 0,
      netQuantityUnit: '',
      mfgMonthYear: '',
      bestBefore: '',
      manufacturerName: '',
      manufacturerAddress: '',
      packerOrImporter: '',
      consumerCarePhone: '',
      consumerCareEmail: '',
      consumerCareAddress: '',
      countryOfOrigin: '',
      rawOcrText: 'Awaiting image input. Point your device camera at the Principal Display Panel (PDP) and capture to extract Rule 6 statutory declarations via PaddleOCR.',
      detectedBoxes: [],
    },
    fontValidations: [],
    exemption: {
      isExempt: false,
      clause: 'Rule 6 Pending Verification',
      reason: 'Awaiting device camera or image capture to evaluate declarations',
    },
    noticeGrading: {
      grade: 'MINOR',
      severityScore: 0,
      compoundingPenaltyInr: 0,
      statutorySections: [],
      violationCount: 0,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 0,
      summaryOfInfractions: [],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Field Inspector',
    inspectorRole: 'field_officer',
  },
  // 1. Amul Taaza Milk 500ml - Compliant
  {
    id: 'INSP-2026-001',
    timestamp: '2026-09-02T10:15:00Z',
    productName: 'Amul Taaza Homogenised Toned Milk',
    brand: 'Amul',
    category: 'Dairy & Beverages',
    packageHeightMm: 180,
    packageWidthMm: 95,
    imageUrl: generateLabelSvg(
      'Amul',
      'Taaza Toned Milk 500ml',
      '₹34.00 (incl. of all taxes)',
      '500 ml',
      '08/2026',
      'Gujarat Co-operative Milk Marketing Fed Ltd, Anand 388001',
      'Toll-Free 1800-258-3333, customercare@amul.coop',
      'India'
    ),
    declarations: {
      mrpText: '₹34.00 (incl. of all taxes)',
      mrpValue: 34,
      hasInclusiveOfTaxes: true,
      netQuantityText: '500 ml',
      netQuantityValue: 500,
      netQuantityUnit: 'ml',
      mfgMonthYear: '08/2026',
      bestBefore: '180 days from packaging',
      manufacturerName: 'Gujarat Co-operative Milk Marketing Federation Ltd',
      manufacturerAddress: 'Amul Dairy Road, Anand - 388001, Gujarat',
      packerOrImporter: 'GCMMF Ltd',
      consumerCarePhone: '1800-258-3333',
      consumerCareEmail: 'customercare@amul.coop',
      consumerCareAddress: 'PO Box 10, Anand 388001',
      countryOfOrigin: 'India',
      rawOcrText: 'AMUL TAAZA HOMOGENISED TONED MILK NET QTY: 500 ml MRP Rs 34.00 (INCL. OF ALL TAXES) PKD: 08/2026 MFD BY GUJARAT COOPERATIVE MILK MARKETING FEDERATION LTD ANAND CUSTOMER CARE 1800-258-3333 COUNTRY OF ORIGIN: INDIA',
      detectedBoxes: [
        { topPercent: 48, leftPercent: 8, widthPercent: 84, heightPercent: 5.5, label: 'NET_QUANTITY', confidence: 0.98 },
        { topPercent: 55, leftPercent: 8, widthPercent: 84, heightPercent: 5.5, label: 'MRP', confidence: 0.99 },
        { topPercent: 62, leftPercent: 8, widthPercent: 84, heightPercent: 5.5, label: 'MFG_DATE', confidence: 0.95 },
        { topPercent: 68, leftPercent: 8, widthPercent: 84, heightPercent: 6.5, label: 'MANUFACTURER', confidence: 0.94 },
        { topPercent: 76, leftPercent: 8, widthPercent: 84, heightPercent: 6.5, label: 'CONSUMER_CARE', confidence: 0.96 },
        { topPercent: 84, leftPercent: 8, widthPercent: 84, heightPercent: 5.5, label: 'COUNTRY_ORIGIN', confidence: 0.97 },
      ],
    },
    fontValidations: [
      { fieldName: 'Net Quantity (500 ml)', measuredHeightMm: 4.2, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1000g: min 4.0mm)', sampleText: '500 ml' },
      { fieldName: 'MRP Numeral', measuredHeightMm: 4.1, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1000g: min 4.0mm)', sampleText: '34.00' },
      { fieldName: 'Month & Year of Mfg', measuredHeightMm: 3.2, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 (Letters min 2.0mm)', sampleText: '08/2026' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged retail commodity' },
    noticeGrading: {
      grade: 'MINOR',
      severityScore: 0,
      compoundingPenaltyInr: 0,
      statutorySections: [],
      violationCount: 0,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 0,
      summaryOfInfractions: [],
    },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 2. Parle-G Biscuits 120g - Compliant
  {
    id: 'INSP-2026-002',
    timestamp: '2026-09-02T11:30:00Z',
    productName: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle',
    category: 'Packaged Foods',
    packageHeightMm: 140,
    packageWidthMm: 70,
    imageUrl: generateLabelSvg(
      'Parle',
      'Parle-G Gluco Biscuits 120g',
      '₹10.00 (incl. of all taxes)',
      '120 g',
      '07/2026',
      'Parle Products Pvt Ltd, Vile Parle East, Mumbai 400057',
      'Tel: 022-66916911, cs@parle.biz',
      'India'
    ),
    declarations: {
      mrpText: '₹10.00 (incl. of all taxes)',
      mrpValue: 10,
      hasInclusiveOfTaxes: true,
      netQuantityText: '120 g',
      netQuantityValue: 120,
      netQuantityUnit: 'g',
      mfgMonthYear: '07/2026',
      bestBefore: '6 Months from packaging',
      manufacturerName: 'Parle Products Pvt Ltd',
      manufacturerAddress: 'North Level Crossing, Vile Parle East, Mumbai 400057, Maharashtra',
      packerOrImporter: 'Parle Products Pvt Ltd',
      consumerCarePhone: '022-66916911',
      consumerCareEmail: 'cs@parle.biz',
      consumerCareAddress: 'Consumer Care Cell, Parle House, Mumbai 400057',
      countryOfOrigin: 'India',
      rawOcrText: 'PARLE-G ORIGINAL GLUCO BISCUITS NET WEIGHT 120 g MRP Rs. 10.00 INCL. OF ALL TAXES PKD 07/2026 MFD BY PARLE PRODUCTS PVT LTD MUMBAI 400057 CONSUMER CARE 022-66916911 CS@PARLE.BIZ COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (120 g)', measuredHeightMm: 2.4, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '120 g' },
      { fieldName: 'MRP Numeral', measuredHeightMm: 2.6, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '10.00' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 3. Tata Salt 1kg - Compliant
  {
    id: 'INSP-2026-003',
    timestamp: '2026-09-02T14:10:00Z',
    productName: 'Tata Salt Vacuum Evaporated Iodised Salt',
    brand: 'Tata Consumer',
    category: 'Packaged Foods',
    packageHeightMm: 240,
    packageWidthMm: 160,
    imageUrl: generateLabelSvg(
      'Tata Consumer',
      'Tata Salt Iodised 1 kg',
      '₹28.00 (incl. of all taxes)',
      '1 kg',
      '08/2026',
      'Tata Consumer Products Ltd, 1 Bishop Lefroy Rd, Kolkata 700020',
      '1800-108-4488, care@tataconsumer.com',
      'India'
    ),
    declarations: {
      mrpText: '₹28.00 (incl. of all taxes)',
      mrpValue: 28,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 kg',
      netQuantityValue: 1000,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '24 Months from packaging',
      manufacturerName: 'Tata Consumer Products Limited',
      manufacturerAddress: '1, Bishop Lefroy Road, Kolkata - 700020',
      packerOrImporter: 'Tata Consumer Products Limited',
      consumerCarePhone: '1800-108-4488',
      consumerCareEmail: 'care@tataconsumer.com',
      consumerCareAddress: 'Kirloskar Business Park, Bengaluru 560024',
      countryOfOrigin: 'India',
      rawOcrText: 'TATA SALT VACUUM EVAPORATED IODISED SALT NET QUANTITY 1 kg MRP Rs 28.00 INCL OF ALL TAXES PKD 08/2026 TATA CONSUMER PRODUCTS LTD CARE@TATACONSUMER.COM 1800-108-4488 MADE IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 kg)', measuredHeightMm: 4.8, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1kg: min 4.0mm)', sampleText: '1 kg' },
      { fieldName: 'MRP Numeral', measuredHeightMm: 4.5, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1kg: min 4.0mm)', sampleText: '28.00' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 4. Maggi 2-Minute Noodles 70g - Compliant
  {
    id: 'INSP-2026-004',
    timestamp: '2026-09-02T15:20:00Z',
    productName: 'Maggi 2-Minute Masala Instant Noodles',
    brand: 'Nestle',
    category: 'Packaged Foods',
    packageHeightMm: 130,
    packageWidthMm: 110,
    imageUrl: generateLabelSvg(
      'Nestle',
      'Maggi 2-Minute Noodles 70g',
      '₹14.00 (incl. of all taxes)',
      '70 g',
      '07/2026',
      'Nestle India Ltd, 100/101 World Trade Centre, New Delhi 110001',
      '1800-103-1947, wecare@in.nestle.com',
      'India'
    ),
    declarations: {
      mrpText: '₹14.00 (incl. of all taxes)',
      mrpValue: 14,
      hasInclusiveOfTaxes: true,
      netQuantityText: '70 g',
      netQuantityValue: 70,
      netQuantityUnit: 'g',
      mfgMonthYear: '07/2026',
      bestBefore: '9 Months from manufacturing',
      manufacturerName: 'Nestle India Limited',
      manufacturerAddress: '100 / 101, World Trade Centre, Barakhamba Lane, New Delhi 110001',
      packerOrImporter: 'Nestle India Ltd',
      consumerCarePhone: '1800-103-1947',
      consumerCareEmail: 'wecare@in.nestle.com',
      consumerCareAddress: 'Nestle Consumer Care, DLF Cyber City, Gurugram 122002',
      countryOfOrigin: 'India',
      rawOcrText: 'NESTLE MAGGI 2-MINUTE NOODLES MASALA NET QTY 70 g MRP RS 14.00 (INCLUSIVE OF ALL TAXES) MFD 07/2026 NESTLE INDIA LTD NEW DELHI WECARE@IN.NESTLE.COM 1800-103-1947 COUNTRY OF ORIGIN: INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (70 g)', measuredHeightMm: 2.3, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '70 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 5. Fortune Sunflower Oil 1 Litre - Compliant
  {
    id: 'INSP-2026-005',
    timestamp: '2026-09-02T16:05:00Z',
    productName: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    category: 'Edible Oils',
    packageHeightMm: 260,
    packageWidthMm: 120,
    imageUrl: generateLabelSvg(
      'Adani Wilmar',
      'Fortune Sunlite Sunflower Oil 1L',
      '₹145.00 (incl. of all taxes)',
      '1 L (910 g)',
      '08/2026',
      'Adani Wilmar Ltd, Fortune House, Navrangpura, Ahmedabad 380009',
      '1800-233-9999, customercare@adaniwilmar.in',
      'India'
    ),
    declarations: {
      mrpText: '₹145.00 (incl. of all taxes)',
      mrpValue: 145,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 L (910 g)',
      netQuantityValue: 1000,
      netQuantityUnit: 'ml',
      mfgMonthYear: '08/2026',
      bestBefore: '9 Months from packaging',
      manufacturerName: 'Adani Wilmar Limited',
      manufacturerAddress: 'Fortune House, Near Mithakhali Six Roads, Navrangpura, Ahmedabad 380009',
      packerOrImporter: 'Adani Wilmar Ltd',
      consumerCarePhone: '1800-233-9999',
      consumerCareEmail: 'customercare@adaniwilmar.in',
      consumerCareAddress: 'Fortune House, Ahmedabad 380009',
      countryOfOrigin: 'India',
      rawOcrText: 'FORTUNE SUNLITE REFINED SUNFLOWER OIL NET VOLUME: 1 L (910 g) MRP Rs. 145.00 INCLUSIVE OF ALL TAXES PKD 08/2026 ADANI WILMAR LTD AHMEDABAD 380009 CARE@ADANIWILMAR.IN 1800-233-9999 PRODUCED IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 L)', measuredHeightMm: 4.4, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200ml - 1000ml: min 4.0mm)', sampleText: '1 L' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged edible oil' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 6. Haldiram's Bhujia Sev 200g - Compliant
  {
    id: 'INSP-2026-006',
    timestamp: '2026-09-02T16:45:00Z',
    productName: "Haldiram's Nagpur Bhujia Sev",
    brand: "Haldiram's",
    category: 'Packaged Foods',
    packageHeightMm: 210,
    packageWidthMm: 150,
    imageUrl: generateLabelSvg(
      "Haldiram's",
      'Bhujia Sev 200g',
      '₹55.00 (incl. of all taxes)',
      '200 g',
      '08/2026',
      "Haldiram Foods International Pvt Ltd, Bhandara Rd, Nagpur 441104",
      '0712-2681197, support@haldirams.com',
      'India'
    ),
    declarations: {
      mrpText: '₹55.00 (incl. of all taxes)',
      mrpValue: 55,
      hasInclusiveOfTaxes: true,
      netQuantityText: '200 g',
      netQuantityValue: 200,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '6 Months from packaging',
      manufacturerName: "Haldiram Foods International Pvt Ltd",
      manufacturerAddress: '145/146, Old Pardi Naka, Bhandara Road, Nagpur 441104, Maharashtra',
      packerOrImporter: "Haldiram Foods International Pvt Ltd",
      consumerCarePhone: '0712-2681197',
      consumerCareEmail: 'support@haldirams.com',
      consumerCareAddress: 'Bhandara Road, Nagpur 441104',
      countryOfOrigin: 'India',
      rawOcrText: "HALDIRAM'S NAGPUR BHUJIA SEV NET WT 200 g MRP Rs 55.00 (INCL OF ALL TAXES) PKD 08/2026 HALDIRAM FOODS NAGPUR SUPPORT@HALDIRAMS.COM 0712-2681197 COUNTRY OF ORIGIN: INDIA",
    },
    fontValidations: [
      { fieldName: 'Net Quantity (200 g)', measuredHeightMm: 2.5, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '200 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged food' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 7. Colgate Total Toothpaste 150g - Compliant
  {
    id: 'INSP-2026-007',
    timestamp: '2026-09-02T17:15:00Z',
    productName: 'Colgate Total Whole Mouth Health Toothpaste',
    brand: 'Colgate-Palmolive',
    category: 'Personal Care',
    packageHeightMm: 200,
    packageWidthMm: 50,
    imageUrl: generateLabelSvg(
      'Colgate',
      'Total Toothpaste 150g',
      '₹130.00 (incl. of all taxes)',
      '150 g',
      '07/2026',
      'Colgate-Palmolive (India) Ltd, Hiranandani Gardens, Powai, Mumbai 400076',
      '1800-225-599, consumeraffairs_india@colpal.com',
      'India'
    ),
    declarations: {
      mrpText: '₹130.00 (incl. of all taxes)',
      mrpValue: 130,
      hasInclusiveOfTaxes: true,
      netQuantityText: '150 g',
      netQuantityValue: 150,
      netQuantityUnit: 'g',
      mfgMonthYear: '07/2026',
      bestBefore: '24 Months from packaging',
      manufacturerName: 'Colgate-Palmolive (India) Limited',
      manufacturerAddress: 'Colgate Research Centre, Main Street, Hiranandani Gardens, Powai, Mumbai 400076',
      packerOrImporter: 'Colgate-Palmolive (India) Ltd',
      consumerCarePhone: '1800-225-599',
      consumerCareEmail: 'consumeraffairs_india@colpal.com',
      consumerCareAddress: 'Powai, Mumbai 400076',
      countryOfOrigin: 'India',
      rawOcrText: 'COLGATE TOTAL WHOLE MOUTH HEALTH NET WT 150 g MRP Rs. 130.00 (INCL OF ALL TAXES) MFD 07/2026 COLGATE-PALMOLIVE INDIA LTD MUMBAI 1800-225-599 CONSUMERAFFAIRS_INDIA@COLPAL.COM MADE IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (150 g)', measuredHeightMm: 2.2, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '150 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged cosmetic' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 8. Dabur Honey 250g - Compliant
  {
    id: 'INSP-2026-008',
    timestamp: '2026-09-02T17:45:00Z',
    productName: 'Dabur 100% Pure Honey',
    brand: 'Dabur',
    category: 'Packaged Foods',
    packageHeightMm: 150,
    packageWidthMm: 75,
    imageUrl: generateLabelSvg(
      'Dabur',
      '100% Pure Honey 250g',
      '₹120.00 (incl. of all taxes)',
      '250 g',
      '08/2026',
      'Dabur India Ltd, 8/3 Asaf Ali Road, New Delhi 110002',
      '1800-103-1644, daburcares@dabur.com',
      'India'
    ),
    declarations: {
      mrpText: '₹120.00 (incl. of all taxes)',
      mrpValue: 120,
      hasInclusiveOfTaxes: true,
      netQuantityText: '250 g',
      netQuantityValue: 250,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '18 Months from packaging',
      manufacturerName: 'Dabur India Limited',
      manufacturerAddress: '8/3, Asaf Ali Road, New Delhi 110002',
      packerOrImporter: 'Dabur India Ltd',
      consumerCarePhone: '1800-103-1644',
      consumerCareEmail: 'daburcares@dabur.com',
      consumerCareAddress: 'Kaushambi, Ghaziabad 201010',
      countryOfOrigin: 'India',
      rawOcrText: 'DABUR 100% PURE HONEY NET WT 250 g MRP RS 120.00 (INCLUSIVE OF ALL TAXES) PKD 08/2026 DABUR INDIA LTD NEW DELHI 1800-103-1644 DABURCARES@DABUR.COM COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (250 g)', measuredHeightMm: 4.3, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1000g: min 4.0mm)', sampleText: '250 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 9. Aashirvaad Atta 5kg - Compliant
  {
    id: 'INSP-2026-009',
    timestamp: '2026-09-02T18:20:00Z',
    productName: 'Aashirvaad Shudh Chakki Whole Wheat Atta',
    brand: 'ITC Limited',
    category: 'Staples & Grains',
    packageHeightMm: 380,
    packageWidthMm: 260,
    imageUrl: generateLabelSvg(
      'ITC Aashirvaad',
      'Shudh Chakki Atta 5kg',
      '₹245.00 (incl. of all taxes)',
      '5 kg',
      '08/2026',
      'ITC Limited, 37 J.L. Nehru Road, Kolkata 700071',
      '1800-425-44444, itccares@itc.in',
      'India'
    ),
    declarations: {
      mrpText: '₹245.00 (incl. of all taxes)',
      mrpValue: 245,
      hasInclusiveOfTaxes: true,
      netQuantityText: '5 kg',
      netQuantityValue: 5000,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '3 Months from packaging',
      manufacturerName: 'ITC Limited',
      manufacturerAddress: 'Virginia House, 37 J.L. Nehru Road, Kolkata 700071, West Bengal',
      packerOrImporter: 'ITC Limited',
      consumerCarePhone: '1800-425-44444',
      consumerCareEmail: 'itccares@itc.in',
      consumerCareAddress: 'ITC Quality Care Cell, PO Box 592, Bengaluru 560001',
      countryOfOrigin: 'India',
      rawOcrText: 'ITC AASHIRVAAD SHUDH CHAKKI ATTA NET WEIGHT: 5 kg MRP Rs 245.00 INCL OF ALL TAXES PKD 08/2026 ITC LIMITED KOLKATA 700071 ITCCARES@ITC.IN 1800-425-44444 COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (5 kg)', measuredHeightMm: 6.8, requiredMinHeightMm: 6.0, isCompliant: true, statutoryRule: 'Rule 8 Table (>1kg: min 6.0mm)', sampleText: '5 kg' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 10. Catch Garam Masala 100g - Compliant
  {
    id: 'INSP-2026-010',
    timestamp: '2026-09-02T19:00:00Z',
    productName: 'Catch Super Garam Masala Powder',
    brand: 'DS Group',
    category: 'Spices & Condiments',
    packageHeightMm: 120,
    packageWidthMm: 80,
    imageUrl: generateLabelSvg(
      'Catch Spices',
      'Super Garam Masala 100g',
      '₹88.00 (incl. of all taxes)',
      '100 g',
      '07/2026',
      'DS Spiceco Pvt Ltd, Sector 67, Noida 201309',
      '0120-4032200, feedback@catchfoods.com',
      'India'
    ),
    declarations: {
      mrpText: '₹88.00 (incl. of all taxes)',
      mrpValue: 88,
      hasInclusiveOfTaxes: true,
      netQuantityText: '100 g',
      netQuantityValue: 100,
      netQuantityUnit: 'g',
      mfgMonthYear: '07/2026',
      bestBefore: '12 Months from manufacturing',
      manufacturerName: 'DS Spiceco Pvt Ltd',
      manufacturerAddress: 'Plot No. 4828, Sector 67, Noida 201309, Uttar Pradesh',
      packerOrImporter: 'DS Spiceco Pvt Ltd',
      consumerCarePhone: '0120-4032200',
      consumerCareEmail: 'feedback@catchfoods.com',
      consumerCareAddress: 'Noida 201309',
      countryOfOrigin: 'India',
      rawOcrText: 'CATCH SUPER GARAM MASALA NET QUANTITY 100 g MRP Rs. 88.00 INCLUSIVE OF ALL TAXES MFD 07/2026 DS SPICECO NOIDA FEEDBACK@CATCHFOODS.COM 0120-4032200 PRODUCED IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (100 g)', measuredHeightMm: 2.2, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table (50g - 200g: min 2.0mm)', sampleText: '100 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 11. [NON-COMPLIANT] Nutri-Crisp Cookies 200g - RULE 8 FONT SIZE VIOLATION
  {
    id: 'INSP-2026-011',
    timestamp: '2026-09-03T09:15:00Z',
    productName: 'Nutri-Crisp Roasted Almond Butter Cookies',
    brand: 'Nutri-Crisp',
    category: 'Packaged Foods',
    packageHeightMm: 160,
    packageWidthMm: 90,
    imageUrl: generateLabelSvg(
      'Nutri-Crisp',
      'Almond Butter Cookies 200g',
      '₹60.00 (incl. of all taxes)',
      '200 g',
      '08/2026',
      'Apex Bakers Pvt Ltd, Peenya Industrial Area, Bengaluru 560058',
      '080-28392111, contact@nutricrisp.in',
      'India',
      'netQtyFont'
    ),
    declarations: {
      mrpText: '₹60.00 (incl. of all taxes)',
      mrpValue: 60,
      hasInclusiveOfTaxes: true,
      netQuantityText: '200 g',
      netQuantityValue: 200,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '6 Months from packaging',
      manufacturerName: 'Apex Bakers Pvt Ltd',
      manufacturerAddress: 'Phase 2, Peenya Industrial Area, Bengaluru 560058',
      packerOrImporter: 'Apex Bakers Pvt Ltd',
      consumerCarePhone: '080-28392111',
      consumerCareEmail: 'contact@nutricrisp.in',
      consumerCareAddress: 'Bengaluru 560058',
      countryOfOrigin: 'India',
      rawOcrText: 'NUTRI-CRISP ROASTED ALMOND COOKIES Net Qty: 200g (tiny print) MRP Rs 60.00 (INCL ALL TAXES) PKD 08/2026 APEX BAKERS BENGALURU CONTACT@NUTRICRISP.IN 080-28392111 COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      {
        fieldName: 'Net Quantity Numeral (200g)',
        measuredHeightMm: 1.1,
        requiredMinHeightMm: 2.0,
        isCompliant: false,
        statutoryRule: 'Rule 8, Table 1 (50g - 200g: mandatory minimum 2.0mm)',
        sampleText: '200g',
      },
      {
        fieldName: 'MRP Numeral (60.00)',
        measuredHeightMm: 1.3,
        requiredMinHeightMm: 2.0,
        isCompliant: false,
        statutoryRule: 'Rule 8 (Numerals mandatory minimum 2.0mm)',
        sampleText: '60.00',
      },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Non-exempt standard retail packaging' },
    noticeGrading: {
      grade: 'MODERATE',
      severityScore: 45,
      compoundingPenaltyInr: 10000,
      statutorySections: ['Rule 8, PCR 2011', 'Section 36(1) of Legal Metrology Act, 2009'],
      violationCount: 2,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Numeral height of Net Quantity is only 1.1mm, violating statutory minimum 2.0mm under Rule 8 Table 1.',
        'MRP numeral height (1.3mm) is illegible and below statutory minimum threshold.',
      ],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
    supervisorNotes: 'Font calibration confirmed with optical micrometry. Inspection notice required.',
  },

  // 12. [NON-COMPLIANT] Saffron Herbal Face Serum 30ml - MISSING CONSUMER CARE (Rule 6(1)(h))
  {
    id: 'INSP-2026-012',
    timestamp: '2026-09-03T10:45:00Z',
    productName: 'Saffron Radiant Herbal Face Glow Serum',
    brand: 'VedaBotanica',
    category: 'Cosmetics & Skincare',
    packageHeightMm: 110,
    packageWidthMm: 45,
    imageUrl: generateLabelSvg(
      'VedaBotanica',
      'Herbal Face Serum 30ml',
      '₹499.00 (incl. of all taxes)',
      '30 ml',
      '06/2026',
      'Veda Labs, Industrial Estate, Haridwar 249403',
      '', // Missing consumer care
      'India',
      'consumerCare'
    ),
    declarations: {
      mrpText: '₹499.00 (incl. of all taxes)',
      mrpValue: 499,
      hasInclusiveOfTaxes: true,
      netQuantityText: '30 ml',
      netQuantityValue: 30,
      netQuantityUnit: 'ml',
      mfgMonthYear: '06/2026',
      bestBefore: '24 Months from mfg',
      manufacturerName: 'Veda Labs Private Limited',
      manufacturerAddress: 'Plot 12, Industrial Estate, Haridwar - 249403, Uttarakhand',
      packerOrImporter: 'Veda Labs Pvt Ltd',
      consumerCarePhone: '',
      consumerCareEmail: '',
      consumerCareAddress: '',
      countryOfOrigin: 'India',
      rawOcrText: 'VEDABOTANICA SAFFRON FACE SERUM NET VOL 30 ml MRP RS 499.00 INCL ALL TAXES MFD 06/2026 MFD BY VEDA LABS HARIDWAR MADE IN INDIA [NO CONSUMER CARE CELL OR HELPLINE DECLARED]',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (30 ml)', measuredHeightMm: 1.2, requiredMinHeightMm: 1.0, isCompliant: true, statutoryRule: 'Rule 8 Table (≤50ml: min 1.0mm)', sampleText: '30 ml' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Non-exempt pre-packaged cosmetic' },
    noticeGrading: {
      grade: 'MODERATE',
      severityScore: 55,
      compoundingPenaltyInr: 15000,
      statutorySections: ['Rule 6(1)(h), PCR 2011', 'Section 36(1) LM Act 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Total omission of Consumer Care Cell contact details (telephone number, email address, physical address) mandated under Rule 6(1)(h).',
      ],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 13. [NON-COMPLIANT] SonicBass Wireless Earbuds - MISSING COUNTRY OF ORIGIN (Rule 6(1)(g))
  {
    id: 'INSP-2026-013',
    timestamp: '2026-09-03T11:50:00Z',
    productName: 'SonicBass True Wireless Stereo ANC Earbuds',
    brand: 'SonicBass',
    category: 'Consumer Electronics',
    packageHeightMm: 120,
    packageWidthMm: 120,
    imageUrl: generateLabelSvg(
      'SonicBass',
      'Wireless ANC Earbuds',
      '₹1,999.00 (incl. of all taxes)',
      '1 Unit (Earbuds + Case)',
      '05/2026',
      'Imported & Marketed by AudioTech India Pvt Ltd, Andheri East, Mumbai 400069',
      '1800-419-0099, support@sonicbass.in',
      '', // Missing country of origin
      'countryOfOrigin'
    ),
    declarations: {
      mrpText: '₹1,999.00 (incl. of all taxes)',
      mrpValue: 1999,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 N',
      netQuantityValue: 1,
      netQuantityUnit: 'unit',
      mfgMonthYear: '05/2026',
      bestBefore: 'N/A (Electronic)',
      manufacturerName: 'AudioTech India Pvt Ltd',
      manufacturerAddress: 'Building B, Marol Industrial Area, Andheri East, Mumbai 400069',
      packerOrImporter: 'AudioTech India Pvt Ltd (Importer)',
      consumerCarePhone: '1800-419-0099',
      consumerCareEmail: 'support@sonicbass.in',
      consumerCareAddress: 'Andheri East, Mumbai 400069',
      countryOfOrigin: '',
      rawOcrText: 'SONICBASS TRUE WIRELESS STEREO EARBUDS NET QUANTITY 1 UNIT MRP RS 1999.00 INCL ALL TAXES MONTH & YEAR OF IMPORT 05/2026 IMPORTED BY AUDIOTECH INDIA PVT LTD MUMBAI SUPPORT@SONICBASS.IN 1800-419-0099 [COUNTRY OF ORIGIN OMITTED]',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 Unit)', measuredHeightMm: 2.5, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 (Standard numeral height)', sampleText: '1 Unit' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Imported electronic package subject to full PCR 2011 declarations' },
    noticeGrading: {
      grade: 'SEVERE',
      severityScore: 75,
      compoundingPenaltyInr: 25000,
      statutorySections: ['Rule 6(1)(g), PCR 2011', 'Section 18 & 36(1) of Legal Metrology Act, 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Country of Origin / Assembly is completely missing on imported electronic commodity packaging, a serious violation under Rule 6(1)(g).',
      ],
    },
    status: 'NOTICE_ISSUED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 14. [NON-COMPLIANT / PERSONA A] Golden Harvest Basmati Rice - OVERCHARGING CROSS-CHECK
  {
    id: 'INSP-2026-014',
    timestamp: '2026-09-03T13:20:00Z',
    productName: 'Golden Harvest Royal Aged Basmati Rice 1kg',
    brand: 'Golden Harvest',
    category: 'Grains & Rice',
    packageHeightMm: 280,
    packageWidthMm: 170,
    imageUrl: generateLabelSvg(
      'Golden Harvest',
      'Royal Basmati Rice 1kg',
      '₹180.00 (incl. of all taxes)',
      '1 kg',
      '08/2026',
      'Harvest Agro Mills, GT Road, Karnal 132001, Haryana',
      '1800-200-9988, care@goldenharvest.com',
      'India',
      'mrp'
    ),
    declarations: {
      mrpText: '₹180.00 (incl. of all taxes)',
      mrpValue: 180,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 kg',
      netQuantityValue: 1000,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '24 Months from packaging',
      manufacturerName: 'Harvest Agro Mills',
      manufacturerAddress: 'GT Road, Karnal 132001, Haryana',
      packerOrImporter: 'Harvest Agro Mills',
      consumerCarePhone: '1800-200-9988',
      consumerCareEmail: 'care@goldenharvest.com',
      consumerCareAddress: 'Karnal 132001',
      countryOfOrigin: 'India',
      rawOcrText: 'GOLDEN HARVEST ROYAL AGED BASMATI RICE NET WEIGHT 1 kg MRP Rs. 180.00 INCLUSIVE OF ALL TAXES PKD 08/2026 HARVEST AGRO MILLS KARNAL 1800-200-9988 CARE@GOLDENHARVEST.COM COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 kg)', measuredHeightMm: 4.5, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1kg: min 4.0mm)', sampleText: '1 kg' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged commodity' },
    overchargeCheck: {
      packageMrp: 180,
      listingPrice: 215,
      differenceAmount: 35,
      percentageOvercharge: 19.44,
      isOvercharging: true,
      platform: 'QuickCart Express / E-Commerce',
      listingTitle: 'Golden Harvest Royal Aged Basmati Rice, 1000g Pouch',
      violationRule: 'Rule 18(2) PCR 2011 & Section 36(1) Legal Metrology Act, 2009',
    },
    noticeGrading: {
      grade: 'SEVERE',
      severityScore: 90,
      compoundingPenaltyInr: 25000,
      statutorySections: ['Rule 18(2), PCR 2011', 'Section 36(1) of Legal Metrology Act, 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'E-Commerce listing price (₹215.00) exceeds the physical package MRP (₹180.00) by ₹35.00 (+19.4%). Direct violation of Rule 18(2) & Section 36(1).',
      ],
    },
    status: 'NOTICE_ISSUED',
    inspectorName: 'Inspector A. Verma (E-Commerce Cyber Cell)',
    inspectorRole: 'supervisor',
    supervisorNotes: 'Evidence captured from e-commerce listing catalog and physical warehouse audit batch. Section 36(1) compounding notice served to platform.',
  },

  // 15. [NON-COMPLIANT] ChocoSwirl Cake Mix 400g - MISSING MFG DATE (Rule 6(1)(d))
  {
    id: 'INSP-2026-015',
    timestamp: '2026-09-03T14:40:00Z',
    productName: 'ChocoSwirl Instant Eggless Chocolate Cake Mix',
    brand: 'ChocoSwirl',
    category: 'Bakery & Dessert Mix',
    packageHeightMm: 210,
    packageWidthMm: 140,
    imageUrl: generateLabelSvg(
      'ChocoSwirl',
      'Eggless Cake Mix 400g',
      '₹140.00 (incl. of all taxes)',
      '400 g',
      '', // Missing mfg date
      'Delight Foods, GIDC Naroda, Ahmedabad 382330',
      '079-22819000, help@chocoswirl.in',
      'India',
      'mfgDate'
    ),
    declarations: {
      mrpText: '₹140.00 (incl. of all taxes)',
      mrpValue: 140,
      hasInclusiveOfTaxes: true,
      netQuantityText: '400 g',
      netQuantityValue: 400,
      netQuantityUnit: 'g',
      mfgMonthYear: '',
      bestBefore: 'Best before 9 months from date of packing (date not printed)',
      manufacturerName: 'Delight Foods LLP',
      manufacturerAddress: 'Phase 1, GIDC Naroda, Ahmedabad 382330, Gujarat',
      packerOrImporter: 'Delight Foods LLP',
      consumerCarePhone: '079-22819000',
      consumerCareEmail: 'help@chocoswirl.in',
      consumerCareAddress: 'Ahmedabad 382330',
      countryOfOrigin: 'India',
      rawOcrText: 'CHOCOSWIRL INSTANT EGGLESS CAKE MIX NET WT 400 g MRP RS 140.00 INCL ALL TAXES MFD DATE: [BLANK] DELIGHT FOODS AHMEDABAD HELP@CHOCOSWIRL.IN 079-22819000 COUNTRY OF ORIGIN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (400 g)', measuredHeightMm: 4.1, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200g - 1000g: min 4.0mm)', sampleText: '400 g' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Perishable food mix requires mandatory manufacturing date' },
    noticeGrading: {
      grade: 'MODERATE',
      severityScore: 60,
      compoundingPenaltyInr: 15000,
      statutorySections: ['Rule 6(1)(d), PCR 2011', 'Section 36(1) of Legal Metrology Act, 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Failure to declare month and year of manufacture or pre-packing on perishable food package, violating Rule 6(1)(d).',
      ],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 16. [NON-COMPLIANT] Apex Disinfectant 500ml - MISSING 'INCLUSIVE OF ALL TAXES'
  {
    id: 'INSP-2026-016',
    timestamp: '2026-09-03T15:30:00Z',
    productName: 'Apex Surface & Floor Disinfectant Liquid 500ml',
    brand: 'Apex Chemical',
    category: 'Household & Cleaning',
    packageHeightMm: 220,
    packageWidthMm: 90,
    imageUrl: generateLabelSvg(
      'Apex Chemical',
      'Surface Disinfectant 500ml',
      '₹110.00 (Taxes Extra)', // Illegal tax statement
      '500 ml',
      '07/2026',
      'Apex Clean Labs, MIDC Rabale, Navi Mumbai 400701',
      '022-27608899, info@apexclean.in',
      'India',
      'mrp'
    ),
    declarations: {
      mrpText: '₹110.00 (Taxes Extra)',
      mrpValue: 110,
      hasInclusiveOfTaxes: false,
      netQuantityText: '500 ml',
      netQuantityValue: 500,
      netQuantityUnit: 'ml',
      mfgMonthYear: '07/2026',
      bestBefore: '24 Months from packaging',
      manufacturerName: 'Apex Clean Labs',
      manufacturerAddress: 'TTC Industrial Area, MIDC Rabale, Navi Mumbai 400701',
      packerOrImporter: 'Apex Clean Labs',
      consumerCarePhone: '022-27608899',
      consumerCareEmail: 'info@apexclean.in',
      consumerCareAddress: 'Navi Mumbai 400701',
      countryOfOrigin: 'India',
      rawOcrText: 'APEX SURFACE DISINFECTANT NET VOLUME 500 ml MRP Rs 110.00 (TAXES EXTRA) PKD 07/2026 APEX CLEAN LABS NAVI MUMBAI INFO@APEXCLEAN.IN 022-27608899 MADE IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (500 ml)', measuredHeightMm: 4.1, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200ml - 1000ml: min 4.0mm)', sampleText: '500 ml' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Standard pre-packaged household disinfectant' },
    noticeGrading: {
      grade: 'SEVERE',
      severityScore: 70,
      compoundingPenaltyInr: 20000,
      statutorySections: ['Rule 6(1)(e), PCR 2011', 'Section 36(1) LM Act 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Retail sale price declared as "₹110.00 Taxes Extra" in contravention of Rule 6(1)(e), which strictly mandates "Maximum Retail Price (MRP) Rs. ... inclusive of all taxes".',
      ],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 17. [NON-COMPLIANT] ProGrip Cable 1.5m - MISSING IMPORTER/PACKER FULL DETAILS
  {
    id: 'INSP-2026-017',
    timestamp: '2026-09-03T16:15:00Z',
    productName: 'ProGrip Fast Braided Type-C Charging Cable 1.5m',
    brand: 'ProGrip',
    category: 'Consumer Electronics',
    packageHeightMm: 150,
    packageWidthMm: 70,
    imageUrl: generateLabelSvg(
      'ProGrip',
      'Type-C Braided Cable 1.5m',
      '₹299.00 (incl. of all taxes)',
      '1 N (Length 1.5 m)',
      '07/2026',
      'Marketed by PG Trade (Incomplete address)', // Incomplete
      'Email: care@progrip.com',
      'China',
      'mfg'
    ),
    declarations: {
      mrpText: '₹299.00 (incl. of all taxes)',
      mrpValue: 299,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 N (Length 1.5 m)',
      netQuantityValue: 1,
      netQuantityUnit: 'unit',
      mfgMonthYear: '07/2026',
      bestBefore: 'N/A',
      manufacturerName: 'PG Trade',
      manufacturerAddress: '', // Incomplete
      packerOrImporter: 'PG Trade (Address not provided)',
      consumerCarePhone: '',
      consumerCareEmail: 'care@progrip.com',
      consumerCareAddress: '',
      countryOfOrigin: 'China',
      rawOcrText: 'PROGRIP FAST BRAIDED TYPE-C CABLE LENGTH 1.5m NET QTY 1 N MRP RS 299.00 INCL OF ALL TAXES PKD 07/2026 MARKETED BY PG TRADE CARE@PROGRIP.COM COUNTRY OF ORIGIN: CHINA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 N)', measuredHeightMm: 2.1, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 (Standard numeral height)', sampleText: '1 N' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Commercial electronic accessory' },
    noticeGrading: {
      grade: 'MODERATE',
      severityScore: 65,
      compoundingPenaltyInr: 15000,
      statutorySections: ['Rule 6(1)(a), PCR 2011', 'Rule 6(1)(h), PCR 2011', 'Section 36(1) LM Act 2009'],
      violationCount: 2,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'Complete name and postal address of the importer/packer omitted under Rule 6(1)(a).',
        'Telephone number and postal address for Consumer Care omitted under Rule 6(1)(h).',
      ],
    },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 18. [EXEMPT - Rule 26(a)] AyurRelief Pain Balm 5g - Small Package
  {
    id: 'INSP-2026-018',
    timestamp: '2026-09-03T16:50:00Z',
    productName: 'AyurRelief Fast Acting Herbal Headache Balm 5g',
    brand: 'AyurRelief',
    category: 'Ayurvedic & Healthcare',
    packageHeightMm: 35,
    packageWidthMm: 35,
    imageUrl: generateLabelSvg(
      'AyurRelief',
      'Pain Balm 5g [EXEMPT]',
      '₹15.00',
      '5 g',
      '08/2026',
      'Ayur Remedies Ltd, Haridwar',
      'care@ayurrelief.com',
      'India'
    ),
    declarations: {
      mrpText: '₹15.00',
      mrpValue: 15,
      hasInclusiveOfTaxes: true,
      netQuantityText: '5 g',
      netQuantityValue: 5,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '36 Months from mfg',
      manufacturerName: 'Ayur Remedies Ltd',
      manufacturerAddress: 'Haridwar 249401',
      packerOrImporter: 'Ayur Remedies Ltd',
      consumerCarePhone: '1800-11-2233',
      consumerCareEmail: 'care@ayurrelief.com',
      consumerCareAddress: 'Haridwar 249401',
      countryOfOrigin: 'India',
      rawOcrText: 'AYURRELIEF HERBAL PAIN BALM NET WT 5g MRP RS 15 PKD 08/2026 AYUR REMEDIES HARIDWAR CARE@AYURRELIEF.COM INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (5 g)', measuredHeightMm: 0.9, requiredMinHeightMm: 0, isCompliant: true, statutoryRule: 'Exempt under Rule 26(a)', sampleText: '5 g' },
    ],
    exemption: {
      isExempt: true,
      clause: 'Rule 26(a), PCR 2011',
      reason: 'Statutorily exempt from Chapter II declarations: Net weight is 5g, which is less than or equal to 10g (small package exemption).',
    },
    noticeGrading: {
      grade: 'MINOR',
      severityScore: 0,
      compoundingPenaltyInr: 0,
      statutorySections: [],
      violationCount: 0,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 0,
      summaryOfInfractions: [],
    },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 19. [EXEMPT - Rule 26(b)] Annapurna Wheat Jute Bag 65kg - Agricultural Produce >50kg
  {
    id: 'INSP-2026-019',
    timestamp: '2026-09-03T17:20:00Z',
    productName: 'Annapurna Raw Whole Wheat Grain Jute Sacks 65kg',
    brand: 'Annapurna Mandi',
    category: 'Agricultural Bulk',
    packageHeightMm: 950,
    packageWidthMm: 600,
    imageUrl: generateLabelSvg(
      'Annapurna',
      'Wheat Grain 65kg [EXEMPT]',
      'N/A (Wholesale Mandi)',
      '65 kg',
      '08/2026',
      'APMC Mandi Yard, Khanna 141401, Punjab',
      'N/A Wholesale',
      'India'
    ),
    declarations: {
      mrpText: 'Wholesale Mandi Rate',
      mrpValue: null,
      hasInclusiveOfTaxes: false,
      netQuantityText: '65 kg',
      netQuantityValue: 65,
      netQuantityUnit: 'kg',
      mfgMonthYear: '08/2026',
      bestBefore: 'Harvest 2026',
      manufacturerName: 'Khanna Farmer Producer Co',
      manufacturerAddress: 'APMC Mandi Yard, Khanna 141401, Punjab',
      packerOrImporter: 'Khanna Mandi',
      consumerCarePhone: '',
      consumerCareEmail: '',
      consumerCareAddress: '',
      countryOfOrigin: 'India',
      rawOcrText: 'ANNAPURNA RAW WHOLE WHEAT GRAIN NET WEIGHT 65 kg HARVEST 08/2026 KHANNA APMC PUNJAB FOR WHOLESALE / BULK DISTRIBUTION ONLY',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (65 kg)', measuredHeightMm: 12.0, requiredMinHeightMm: 0, isCompliant: true, statutoryRule: 'Exempt under Rule 26(b)', sampleText: '65 kg' },
    ],
    exemption: {
      isExempt: true,
      clause: 'Rule 26(b), PCR 2011',
      reason: 'Statutorily exempt: Agricultural produce contained in packages exceeding 50 kilograms.',
    },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer K. Patel (Badge #LM-118)',
    inspectorRole: 'field_officer',
  },

  // 20. [EXEMPT - Rule 26(c)] Chef's Delight Hotel Counter Biryani Box - Restaurant Counter
  {
    id: 'INSP-2026-020',
    timestamp: '2026-09-03T17:55:00Z',
    productName: "Chef's Delight Special Hyderabadi Dum Biryani Box",
    brand: "Chef's Delight",
    category: 'Fresh Food Counter',
    packageHeightMm: 180,
    packageWidthMm: 180,
    imageUrl: generateLabelSvg(
      "Chef's Delight",
      'Counter Biryani [EXEMPT]',
      '₹280.00 (Over Counter)',
      'Approx 450 g',
      'Packed today for instant consumption',
      'Grand Palace Hotel, Banjara Hills, Hyderabad 500034',
      '040-23351122, roomservice@grandpalace.com',
      'India'
    ),
    declarations: {
      mrpText: '₹280.00 (Restaurant Bill)',
      mrpValue: 280,
      hasInclusiveOfTaxes: true,
      netQuantityText: 'Approx 450 g',
      netQuantityValue: 450,
      netQuantityUnit: 'g',
      mfgMonthYear: 'Freshly packed on order',
      bestBefore: 'Consume within 3 hours',
      manufacturerName: 'Grand Palace Hotel Restaurant',
      manufacturerAddress: 'Road No 1, Banjara Hills, Hyderabad 500034, Telangana',
      packerOrImporter: "Chef's Delight Counter",
      consumerCarePhone: '040-23351122',
      consumerCareEmail: 'roomservice@grandpalace.com',
      consumerCareAddress: 'Hyderabad 500034',
      countryOfOrigin: 'India',
      rawOcrText: "CHEF'S DELIGHT FRESH HOT BIRYANI PACKED AT RESTAURANT COUNTER GRAND PALACE HOTEL HYDERABAD CONSUME IMMEDIATELY",
    },
    fontValidations: [
      { fieldName: 'Fresh Counter Pack', measuredHeightMm: 3.5, requiredMinHeightMm: 0, isCompliant: true, statutoryRule: 'Exempt under Rule 26(c)', sampleText: 'Fresh' },
    ],
    exemption: {
      isExempt: true,
      clause: 'Rule 26(c), PCR 2011',
      reason: 'Statutorily exempt: Fast food items packed by restaurants or hotels across the counter for direct customer pickup.',
    },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 21. [NON-COMPLIANT / PERSONA A] Vedic Pure Ghee 1L - DUAL PRICING & SEVERE OVERCHARGING
  {
    id: 'INSP-2026-021',
    timestamp: '2026-09-03T18:30:00Z',
    productName: 'Vedic Organic Bilona Cow Desi Ghee 1 Litre Tin',
    brand: 'Vedic Farms',
    category: 'Dairy & Ghee',
    packageHeightMm: 210,
    packageWidthMm: 120,
    imageUrl: generateLabelSvg(
      'Vedic Farms',
      'Organic Cow Ghee 1 Litre',
      '₹650.00 (incl. of all taxes)',
      '1 L',
      '08/2026',
      'Vedic Agro Products, Sikar Road, Jaipur 302013, Rajasthan',
      '0141-2890011, contact@vedicfarms.in',
      'India',
      'mrp'
    ),
    declarations: {
      mrpText: '₹650.00 (incl. of all taxes)',
      mrpValue: 650,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 L',
      netQuantityValue: 1000,
      netQuantityUnit: 'ml',
      mfgMonthYear: '08/2026',
      bestBefore: '12 Months from packaging',
      manufacturerName: 'Vedic Agro Products LLP',
      manufacturerAddress: 'Plot 55, Sikar Road, Jaipur 302013, Rajasthan',
      packerOrImporter: 'Vedic Agro Products LLP',
      consumerCarePhone: '0141-2890011',
      consumerCareEmail: 'contact@vedicfarms.in',
      consumerCareAddress: 'Jaipur 302013',
      countryOfOrigin: 'India',
      rawOcrText: 'VEDIC FARMS ORGANIC BILONA COW GHEE NET VOLUME 1 LITRE MRP RS 650.00 (INCLUSIVE OF ALL TAXES) PKD 08/2026 VEDIC AGRO JAIPUR CONTACT@VEDICFARMS.IN 0141-2890011 MADE IN INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 L)', measuredHeightMm: 4.5, requiredMinHeightMm: 4.0, isCompliant: true, statutoryRule: 'Rule 8 Table (200ml - 1000ml: min 4.0mm)', sampleText: '1 L' },
    ],
    exemption: { isExempt: false, clause: '', reason: 'Non-exempt retail dairy packaging' },
    overchargeCheck: {
      packageMrp: 650,
      listingPrice: 720,
      differenceAmount: 70,
      percentageOvercharge: 10.77,
      isOvercharging: true,
      platform: 'ShopBazaar Direct / Quick Delivery App',
      listingTitle: 'Vedic Farms Pure Desi Cow Ghee (Tin 1000ml) - Listing MRP fake ₹800, Sale Price ₹720',
      violationRule: 'Rule 18(2) PCR 2011 & Dual Pricing Prohibition under Legal Metrology Act',
    },
    noticeGrading: {
      grade: 'SEVERE',
      severityScore: 95,
      compoundingPenaltyInr: 25000,
      statutorySections: ['Rule 18(2), PCR 2011', 'Section 36(1) of Legal Metrology Act, 2009'],
      violationCount: 1,
      offenceType: 'FIRST_OFFENCE',
      showCauseNoticeDays: 15,
      summaryOfInfractions: [
        'E-Commerce entity listed selling price is ₹720.00 whereas actual factory packaging MRP is ₹650.00. Excess extraction of ₹70.00 per unit (+10.8%). Direct breach of Section 36(1).',
      ],
    },
    status: 'NOTICE_ISSUED',
    inspectorName: 'Inspector A. Verma (E-Commerce Cyber Cell)',
    inspectorRole: 'supervisor',
  },

  // 22. [EXEMPT - Rule 26(a)] Everfresh Mint Tooth Drops 8ml
  {
    id: 'INSP-2026-022',
    timestamp: '2026-09-03T19:10:00Z',
    productName: 'Everfresh Instant Clove & Mint Toothache Drops 8ml',
    brand: 'Everfresh',
    category: 'Ayurvedic & Healthcare',
    packageHeightMm: 40,
    packageWidthMm: 25,
    imageUrl: generateLabelSvg(
      'Everfresh',
      'Tooth Drops 8ml [EXEMPT]',
      '₹22.00',
      '8 ml',
      '07/2026',
      'Everfresh Pharma, Solan 173205, HP',
      'care@everfresh.com',
      'India'
    ),
    declarations: {
      mrpText: '₹22.00',
      mrpValue: 22,
      hasInclusiveOfTaxes: true,
      netQuantityText: '8 ml',
      netQuantityValue: 8,
      netQuantityUnit: 'ml',
      mfgMonthYear: '07/2026',
      bestBefore: '36 Months from mfg',
      manufacturerName: 'Everfresh Pharma Labs',
      manufacturerAddress: 'Solan 173205, Himachal Pradesh',
      packerOrImporter: 'Everfresh Pharma Labs',
      consumerCarePhone: '1800-44-5566',
      consumerCareEmail: 'care@everfresh.com',
      consumerCareAddress: 'Solan 173205',
      countryOfOrigin: 'India',
      rawOcrText: 'EVERFRESH TOOTH DROPS NET VOL 8 ml MRP RS 22.00 MFD 07/2026 EVERFRESH PHARMA SOLAN HP INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (8 ml)', measuredHeightMm: 0.8, requiredMinHeightMm: 0, isCompliant: true, statutoryRule: 'Exempt under Rule 26(a)', sampleText: '8 ml' },
    ],
    exemption: {
      isExempt: true,
      clause: 'Rule 26(a), PCR 2011',
      reason: 'Statutorily exempt: Net volume is 8ml, which is less than or equal to 10ml (small liquid package exemption).',
    },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 23. [RULE 26 CARVE-OUT] Rajshree Premium Pan Masala 4g
  {
    id: 'INSP-2026-023',
    timestamp: '2026-09-03T19:30:00Z',
    productName: 'Rajshree Premium Pan Masala 4g',
    brand: 'Rajshree',
    category: 'Pan Masala / Supari Mix',
    genericName: 'Pan Masala',
    commodity_category: 'pan_masala',
    commodityCategory: 'pan_masala',
    packageHeightMm: 70,
    packageWidthMm: 55,
    imageUrl: generateLabelSvg(
      'Rajshree',
      'Pan Masala 4g [RULE 26 CARVE-OUT]',
      '₹5.00',
      '4 g',
      '08/2026',
      'Rajshree Products Pvt Ltd, Kanpur, UP',
      '1800-22-3344, care@rajshree.com',
      'India'
    ),
    declarations: {
      genericName: 'Pan Masala',
      commodityCategory: 'pan_masala',
      commodity_category: 'pan_masala',
      mrpText: '₹5.00 (incl. of all taxes)',
      mrpValue: 5,
      hasInclusiveOfTaxes: true,
      netQuantityText: '4 g',
      netQuantityValue: 4,
      netQuantityUnit: 'g',
      mfgMonthYear: '08/2026',
      bestBefore: '6 Months from packaging',
      manufacturerName: 'Rajshree Products Pvt Ltd',
      manufacturerAddress: 'Industrial Area, Kanpur, Uttar Pradesh',
      packerOrImporter: 'Rajshree Products Pvt Ltd',
      consumerCarePhone: '1800-22-3344',
      consumerCareEmail: 'care@rajshree.com',
      consumerCareAddress: 'Customer Support, Kanpur, UP',
      countryOfOrigin: 'India',
      rawOcrText: 'RAJSHREE PAN MASALA NET WT 4 g MRP RS 5.00 INCL OF ALL TAXES PKD 08/2026 MFD BY RAJSHREE PRODUCTS KANPUR UP INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (4 g)', measuredHeightMm: 2.1, requiredMinHeightMm: 1.0, isCompliant: true, statutoryRule: 'Rule 8 Table (Package Area < 50cm²)', sampleText: '4 g' },
      { fieldName: 'MRP (₹5.00)', measuredHeightMm: 2.2, requiredMinHeightMm: 1.0, isCompliant: true, statutoryRule: 'Rule 8 Table (Package Area < 50cm²)', sampleText: '₹5.00' },
    ],
    exemption: {
      isExempt: false,
      clause: 'Rule 26 Carve-Out (Dec 2025 Gazette Notification)',
      reason: 'NON-EXEMPT: Under the Legal Metrology (Packaged Commodities) December 2025 Amendment, Pan Masala and related areca nut/zarda products are statutorily excluded from Rule 26(a) small-package exemptions. All Rule 6 mandatory declarations are enforceable regardless of net quantity (even if ≤ 10g).',
      carveOutApplied: true,
    },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'VERIFIED',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },

  // 24. [UNDETERMINED CATEGORY] Aura Brass Decorative Artifact
  {
    id: 'INSP-2026-024',
    timestamp: '2026-09-03T20:00:00Z',
    productName: 'Aura Metallic Desk Ornament',
    brand: 'Aura Living',
    category: 'Undetermined Category',
    genericName: 'Brass Miniature Figurine',
    commodity_category: 'undetermined',
    commodityCategory: 'undetermined',
    packageHeightMm: 120,
    packageWidthMm: 80,
    imageUrl: generateLabelSvg(
      'Aura Living',
      'Desk Ornament [UNDETERMINED CATEGORY]',
      '₹850.00',
      '1 N',
      '08/2026',
      'Aura Handicrafts, Moradabad, UP',
      'care@auraliving.in',
      'India'
    ),
    declarations: {
      genericName: 'Brass Miniature Figurine',
      commodityCategory: 'undetermined',
      commodity_category: 'undetermined',
      mrpText: '₹850.00 (incl. of all taxes)',
      mrpValue: 850,
      hasInclusiveOfTaxes: true,
      netQuantityText: '1 N',
      netQuantityValue: 1,
      netQuantityUnit: 'N',
      mfgMonthYear: '08/2026',
      bestBefore: '',
      manufacturerName: 'Aura Handicrafts',
      manufacturerAddress: 'Brass Ware Cluster, Moradabad, Uttar Pradesh',
      packerOrImporter: 'Aura Handicrafts',
      consumerCarePhone: '',
      consumerCareEmail: 'care@auraliving.in',
      consumerCareAddress: 'Moradabad, UP',
      countryOfOrigin: 'India',
      rawOcrText: 'AURA LIVING BRASS MINIATURE FIGURINE NET QTY 1 N MRP RS 850.00 INCL ALL TAXES PKD 08/2026 MORADABAD INDIA',
    },
    fontValidations: [
      { fieldName: 'Net Quantity (1 N)', measuredHeightMm: 2.5, requiredMinHeightMm: 2.0, isCompliant: true, statutoryRule: 'Rule 8 Table', sampleText: '1 N' },
    ],
    exemption: {
      isExempt: false,
      clause: '',
      reason: 'Standard commercial pre-packaged commodity subject to Chapter II provisions.',
    },
    noticeGrading: { grade: 'MINOR', severityScore: 0, compoundingPenaltyInr: 0, statutorySections: [], violationCount: 0, offenceType: 'FIRST_OFFENCE', showCauseNoticeDays: 0, summaryOfInfractions: [] },
    status: 'PENDING_REVIEW',
    inspectorName: 'Officer R. Sharma (Badge #LM-402)',
    inspectorRole: 'field_officer',
  },
];
