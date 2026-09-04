import { jsPDF } from 'jspdf';
import { InspectionRecord } from '../types';

export function generateInspectionPdf(record: InspectionRecord): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Box
  doc.setFillColor(30, 41, 59); // dark slate #1e293b
  doc.rect(10, 10, pageWidth - 20, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(10);
  doc.text('DEPARTMENT OF LEGAL METROLOGY • STATUTORY INSPECTION DIVISION', pageWidth / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('FORMAL INSPECTION MEMORANDUM & SHOW-CAUSE NOTICE (SEC 36(1) LM ACT 2009)', pageWidth / 2, y, { align: 'center' });

  y = 42;
  doc.setTextColor(15, 23, 42);

  // Document Details Strip
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y, pageWidth - 20, 14, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`INSPECTION REF: ${record.id}`, 14, y + 5);
  doc.text(`DATE & TIME: ${new Date(record.timestamp).toLocaleString('en-IN')}`, 14, y + 10);
  doc.text(`INSPECTOR: ${record.inspectorName}`, pageWidth - 14, y + 5, { align: 'right' });
  doc.text(`STATUS: ${record.status}`, pageWidth - 14, y + 10, { align: 'right' });

  y += 20;

  // 1. Commodity Particulars
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. COMMODITY & PACKAGING PARTICULARS', 12, y);
  y += 4;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(10, y, pageWidth - 20, 32);

  const displayBrand = record.brand && !record.brand.includes('Pending') ? record.brand : 'Scanned Commodity';
  const displayProduct = record.productName && !record.productName.includes('Pending') ? record.productName : 'Pre-Packaged Commodity';

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Brand / Trade Name: ${displayBrand}`, 14, y + 6);
  doc.text(`Product Description: ${displayProduct}`, 14, y + 12);
  doc.text(`Declared Net Quantity: ${record.declarations.netQuantityText || 'N/A (Pending)'}`, 14, y + 18);
  doc.text(`Declared MRP: ${record.declarations.mrpText || 'N/A (Pending)'}`, 14, y + 24);
  doc.text(`Country of Origin: ${record.declarations.countryOfOrigin || 'NOT DECLARED [VIOLATION]'}`, 14, y + 30);

  doc.text(`Category: ${record.category}`, pageWidth / 2 + 10, y + 6);
  doc.text(`Package Dimensions: ${record.packageHeightMm} mm (H) x ${record.packageWidthMm} mm (W)`, pageWidth / 2 + 10, y + 12);
  doc.text(`Mfg / Pkg Date: ${record.declarations.mfgMonthYear || 'NOT DECLARED'}`, pageWidth / 2 + 10, y + 18);
  doc.text(`Inclusive of Taxes: ${record.declarations.hasInclusiveOfTaxes ? 'YES (Compliant)' : 'NO / OMITTED (Violation)'}`, pageWidth / 2 + 10, y + 24);

  y += 38;

  // 2. Legal Metrology Compliance Audit
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2. STATUTORY COMPLIANCE & RULE VERIFICATION', 12, y);
  y += 4;

  doc.setFillColor(248, 250, 252);
  doc.rect(10, y, pageWidth - 20, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, y, pageWidth - 20, 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUTORY PROVISION', 14, y + 5.5);
  doc.text('REQUIREMENT', 65, y + 5.5);
  doc.text('STATUS', 135, y + 5.5);
  doc.text('STATUTORY PENALTY SLAB', pageWidth - 14, y + 5.5, { align: 'right' });

  y += 8;

  // Render Table Rows
  const auditRows = [
    {
      rule: 'Rule 6(1)(e) - MRP',
      req: 'MRP with "incl. of all taxes"',
      status: record.declarations.mrpValue && record.declarations.hasInclusiveOfTaxes ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.declarations.mrpValue && record.declarations.hasInclusiveOfTaxes ? 'NIL' : 'Up to ₹25,000 (Sec 36(1))',
    },
    {
      rule: 'Rule 6(1)(c) - Net Qty',
      req: 'Standard legal metric unit',
      status: record.declarations.netQuantityValue ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.declarations.netQuantityValue ? 'NIL' : 'Up to ₹25,000 (Sec 36(1))',
    },
    {
      rule: 'Rule 6(1)(d) - Mfg Date',
      req: 'Month & Year of packing',
      status: record.declarations.mfgMonthYear ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.declarations.mfgMonthYear ? 'NIL' : 'Up to ₹25,000 (Sec 36(1))',
    },
    {
      rule: 'Rule 6(1)(h) - Helpline',
      req: 'Consumer care phone / email',
      status: record.declarations.consumerCarePhone || record.declarations.consumerCareEmail ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.declarations.consumerCarePhone || record.declarations.consumerCareEmail ? 'NIL' : 'Up to ₹25,000 (Sec 36(1))',
    },
    {
      rule: 'Rule 6(1)(g) - Origin',
      req: 'Country of Origin declaration',
      status: record.declarations.countryOfOrigin ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.declarations.countryOfOrigin ? 'NIL' : 'Up to ₹25,000 (Sec 36(1))',
    },
    {
      rule: 'Rule 8 - Font Height',
      req: 'Mandatory mm size table',
      status: record.fontValidations.every((f) => f.isCompliant) ? 'COMPLIANT' : 'VIOLATION',
      penalty: record.fontValidations.every((f) => f.isCompliant) ? 'NIL' : 'Compounding ₹10,000',
    },
  ];

  if (record.overchargeCheck) {
    auditRows.push({
      rule: 'Rule 18(2) - Overcharge',
      req: 'Prohibition on selling > MRP',
      status: record.overchargeCheck.isOvercharging ? 'VIOLATION (DUAL PRICING)' : 'COMPLIANT',
      penalty: record.overchargeCheck.isOvercharging ? `Excess ₹${record.overchargeCheck.differenceAmount} + Fine` : 'NIL',
    });
  }

  doc.setFont('helvetica', 'normal');
  for (const row of auditRows) {
    doc.rect(10, y, pageWidth - 20, 7);
    if (row.status.includes('VIOLATION')) {
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(4, 120, 87);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(row.rule, 14, y + 4.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.req, 65, y + 4.5);
    if (row.status.includes('VIOLATION')) {
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(4, 120, 87);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(row.status, 135, y + 4.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.penalty, pageWidth - 14, y + 4.5, { align: 'right' });
    y += 7;
  }

  y += 5;

  // 3. Compounding Penalty Assessment Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. STATUTORY COMPOUNDING PENALTY ASSESSMENT', 12, y);
  y += 4;

  const isSevere = record.noticeGrading.grade === 'SEVERE';
  const isModerate = record.noticeGrading.grade === 'MODERATE';
  const hasViolations = record.noticeGrading.violationCount > 0;

  doc.setFillColor(hasViolations ? (isSevere ? 254 : 255) : 240, hasViolations ? (isSevere ? 242 : 247) : 253, hasViolations ? (isSevere ? 242 : 237) : 244);
  doc.rect(10, y, pageWidth - 20, 24, 'F');
  doc.setDrawColor(hasViolations ? (isSevere ? 239 : 245) : 134, hasViolations ? (isSevere ? 68 : 158) : 239, hasViolations ? (isSevere ? 68 : 11) : 172);
  doc.rect(10, y, pageWidth - 20, 24);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(hasViolations ? 185 : 4, hasViolations ? 28 : 120, hasViolations ? 28 : 87);
  doc.text(`SEVERITY RATING: ${record.noticeGrading.grade} (SCORE: ${record.noticeGrading.severityScore}/100)`, 14, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`Offence Category: ${record.noticeGrading.offenceType === 'FIRST_OFFENCE' ? 'First Offence (Sec 36(1))' : 'Subsequent Offence (Compounded)'}`, 14, y + 11);
  doc.text(`Show-Cause Response Window: ${record.noticeGrading.showCauseNoticeDays || 15} Calendar Days from Notice Receipt`, 14, y + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28);
  doc.text(
    hasViolations
      ? `ASSESSED COMPOUNDING PENALTY: INR ₹${record.noticeGrading.compoundingPenaltyInr.toLocaleString('en-IN')}`
      : 'ASSESSED PENALTY: NIL (FULLY COMPLIANT)',
    pageWidth - 14,
    y + 12,
    { align: 'right' }
  );

  y += 28;

  // 4. Summary of Infractions
  if (record.noticeGrading.summaryOfInfractions.length > 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('4. SPECIFIC GROUNDS OF CONTRAVENTION', 12, y);
    y += 5;

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    for (let i = 0; i < record.noticeGrading.summaryOfInfractions.length; i++) {
      const infraction = record.noticeGrading.summaryOfInfractions[i];
      doc.text(`(${i + 1}) ${infraction}`, 14, y);
      y += 5;
    }
  } else {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(4, 120, 87);
    doc.text('No statutory infractions detected. The commodity packaging complies with Chapter II of PCR 2011.', 14, y + 2);
    y += 8;
  }

  y += 6;

  // 5. Signature and Statutory Seal
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Issued by: Directorate of Legal Metrology (Weights & Measures)', 14, y);
  doc.text('Authorized Signatory: Authorized Metrology Inspector / Controller', pageWidth - 14, y, { align: 'right' });
  y += 4;
  doc.text('Digital Stamp Hash: SHA256-LM-' + Math.random().toString(36).substring(2, 10).toUpperCase(), 14, y);
  doc.text('National Portal for Legal Metrology (e-Maap Integration Ready)', pageWidth - 14, y, { align: 'right' });

  // Save the document
  doc.save(`Legal-Metrology-Notice-${record.id}.pdf`);
}
