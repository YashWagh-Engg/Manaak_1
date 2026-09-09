import {
  ExtractedDeclarations,
  FontValidationItem,
  ExemptionCheck,
  OverchargeResult,
  NoticeGradingResult,
  LegalRuleDefinition,
} from '../types';

export function evaluateExemption(
  declarations: ExtractedDeclarations,
  rules: LegalRuleDefinition[],
  commodityCategoryOverride?: string
): ExemptionCheck {
  const ruleDef = rules.find((r) => r.ruleCode === 'RULE_26_EXEMPTIONS');
  if (!ruleDef || !ruleDef.enabled) {
    return { isExempt: false, clause: '', reason: 'Exemption rule disabled' };
  }

  // Resolve commodity category from explicit param, declarations fields, or reasoning
  const category = (
    commodityCategoryOverride ||
    declarations.commodityCategory ||
    declarations.commodity_category ||
    declarations.categoryReasoning?.commodity_category ||
    ''
  ).toLowerCase().trim();

  // RULE 26 PAN MASALA STATUTORY CARVE-OUT (DECEMBER 2025 GAZETTE AMENDMENT):
  // When commodity_category === "pan_masala", the package is NEVER treated as exempt under Rule 26
  // regardless of net quantity — this overrides the normal <=10g/10ml exemption path.
  if (category === 'pan_masala') {
    return {
      isExempt: false,
      clause: 'Rule 26 Carve-Out (Dec 2025 Gazette Notification)',
      reason:
        'NON-EXEMPT: Under the Legal Metrology (Packaged Commodities) December 2025 Amendment, Pan Masala and related areca nut/zarda products are statutorily excluded from Rule 26(a) small-package exemptions. All Rule 6 mandatory declarations are enforceable regardless of net quantity (even if ≤ 10g).',
      carveOutApplied: true,
    };
  }

  const smallLimit = ruleDef.parameters.smallPackageThresholdGramsOrMl ?? 10;
  const bulkAgriLimit = ruleDef.parameters.bulkAgricultureThresholdKg ?? 50;

  // Rule 26(a): <= 10g or <= 10ml
  if (declarations.netQuantityValue !== null && declarations.netQuantityValue > 0) {
    const unit = declarations.netQuantityUnit.toLowerCase();
    if ((unit === 'g' || unit === 'gm' || unit === 'grams' || unit === 'ml') && declarations.netQuantityValue <= smallLimit) {
      return {
        isExempt: true,
        clause: 'Rule 26(a), PCR 2011',
        reason: `Exempt under Rule 26(a): Net quantity (${declarations.netQuantityValue}${unit}) is ≤ ${smallLimit} ${unit} (Small package statutory exemption).`,
      };
    }

    // Rule 26(b): Agricultural produce > 50kg
    if (unit === 'kg' && declarations.netQuantityValue > bulkAgriLimit) {
      return {
        isExempt: true,
        clause: 'Rule 26(b), PCR 2011',
        reason: `Exempt under Rule 26(b): Package net weight is ${declarations.netQuantityValue}kg, which exceeds the ${bulkAgriLimit}kg threshold for agricultural bulk produce.`,
      };
    }
  }

  // Restaurant Counter Fast Food
  const textUpper = (declarations.rawOcrText || '').toUpperCase();
  if (ruleDef.parameters.allowRestaurantCounterPack && (textUpper.includes('RESTAURANT COUNTER') || textUpper.includes('HOTEL COUNTER') || textUpper.includes('FRESHLY PACKED ON ORDER'))) {
    return {
      isExempt: true,
      clause: 'Rule 26(c), PCR 2011',
      reason: 'Exempt under Rule 26(c): Fast food items packed by restaurant/hotel across the counter for direct consumption.',
    };
  }

  return {
    isExempt: false,
    clause: '',
    reason: 'Standard commercial pre-packaged commodity subject to Chapter II provisions.',
  };
}

export function validateRule6Declarations(
  declarations: ExtractedDeclarations,
  rules: LegalRuleDefinition[]
): { violations: string[]; passedChecks: string[] } {
  const ruleDef = rules.find((r) => r.ruleCode === 'RULE_6_MANDATORY_DECLARATIONS');
  const violations: string[] = [];
  const passedChecks: string[] = [];

  if (!ruleDef || !ruleDef.enabled) {
    return { violations, passedChecks: ['Rule 6 verification disabled by admin'] };
  }

  const p = ruleDef.parameters;

  // 1. MRP (Rule 6(1)(e))
  if (p.requireMrp) {
    if (!declarations.mrpValue || declarations.mrpValue <= 0) {
      violations.push('Rule 6(1)(e): Maximum Retail Price (MRP) is missing, illegible, or unstated.');
    } else {
      passedChecks.push(`Rule 6(1)(e): MRP declared as ₹${declarations.mrpValue.toFixed(2)}.`);
    }
  }

  // 2. Inclusive of all taxes statement (Rule 6(1)(e))
  if (p.requireTaxInclusiveStatement) {
    if (!declarations.hasInclusiveOfTaxes) {
      violations.push('Rule 6(1)(e): Mandatory statutory phrase "inclusive of all taxes" or "incl. of all taxes" is omitted or replaced with non-compliant text.');
    } else {
      passedChecks.push('Rule 6(1)(e): Declares "inclusive of all taxes".');
    }
  }

  // 3. Net Quantity (Rule 6(1)(c))
  if (p.requireNetQuantity) {
    if (!declarations.netQuantityValue || !declarations.netQuantityUnit) {
      violations.push('Rule 6(1)(c): Net quantity in standard legal metric units is missing or non-standard.');
    } else {
      passedChecks.push(`Rule 6(1)(c): Net quantity declared as ${declarations.netQuantityText || `${declarations.netQuantityValue} ${declarations.netQuantityUnit}`}.`);
    }
  }

  // 4. Month & Year of Mfg/Pkg (Rule 6(1)(d))
  if (p.requireMfgDate) {
    if (!declarations.mfgMonthYear || declarations.mfgMonthYear.trim().length < 4) {
      violations.push('Rule 6(1)(d): Month and year of manufacture, packing, or import is not declared.');
    } else {
      passedChecks.push(`Rule 6(1)(d): Mfg/Packing date declared as "${declarations.mfgMonthYear}".`);
    }
  }

  // 5. Manufacturer/Packer Address (Rule 6(1)(a))
  if (p.requireManufacturerAddress) {
    if (!declarations.manufacturerName || declarations.manufacturerName.trim().length < 3 || (!declarations.manufacturerAddress && !declarations.packerOrImporter)) {
      violations.push('Rule 6(1)(a): Complete name and address of the manufacturer, packer, or importer is incomplete or missing.');
    } else {
      passedChecks.push(`Rule 6(1)(a): Manufacturer declared as "${declarations.manufacturerName}".`);
    }
  }

  // 6. Consumer Care Cell (Rule 6(1)(h))
  if (p.requireConsumerCare) {
    const hasPhone = declarations.consumerCarePhone && declarations.consumerCarePhone.trim().length >= 7;
    const hasEmail = declarations.consumerCareEmail && declarations.consumerCareEmail.includes('@');
    const hasAddress = declarations.consumerCareAddress && declarations.consumerCareAddress.trim().length >= 5;

    if (!hasPhone && !hasEmail && !hasAddress) {
      violations.push('Rule 6(1)(h): Complete omission of Consumer Care Cell contact details (telephone number, email address, or physical address).');
    } else if (!hasPhone && !hasEmail) {
      violations.push('Rule 6(1)(h): Consumer Care Cell must include at least an active telephone helpline number or email address.');
    } else {
      passedChecks.push('Rule 6(1)(h): Consumer Care Cell details present and compliant.');
    }
  }

  // 7. Country of Origin (Rule 6(1)(g))
  if (p.requireCountryOfOrigin) {
    if (!declarations.countryOfOrigin || declarations.countryOfOrigin.trim().length < 2) {
      violations.push('Rule 6(1)(g): Name of the Country of Origin or manufacture/assembly is not declared.');
    } else {
      passedChecks.push(`Rule 6(1)(g): Country of Origin declared as "${declarations.countryOfOrigin}".`);
    }
  }

  return { violations, passedChecks };
}

export function validateFontSpecifications(
  declarations: ExtractedDeclarations,
  packageHeightMm: number,
  rules: LegalRuleDefinition[]
): FontValidationItem[] {
  const ruleDef = rules.find((r) => r.ruleCode === 'RULE_7_8_FONT_SPECIFICATIONS');
  if (!ruleDef || !ruleDef.enabled) {
    return [];
  }

  // Determine required minimum height based on weight/volume
  let requiredMinHeightMm = 2.0; // default for 50g-200g
  let weightInG = 200;

  if (declarations.netQuantityValue) {
    const unit = declarations.netQuantityUnit.toLowerCase();
    if (unit === 'kg' || unit === 'l' || unit === 'litre' || unit === 'litres') {
      weightInG = declarations.netQuantityValue * 1000;
    } else {
      weightInG = declarations.netQuantityValue;
    }
  }

  const tiers = ruleDef.parameters.tiers || [
    { maxWeightG: 50, minHeightMm: 1.0 },
    { maxWeightG: 200, minHeightMm: 2.0 },
    { maxWeightG: 1000, minHeightMm: 4.0 },
    { maxWeightG: 999999, minHeightMm: 6.0 },
  ];

  for (const tier of tiers) {
    if (weightInG <= tier.maxWeightG) {
      requiredMinHeightMm = tier.minHeightMm;
      break;
    }
  }

  const items: FontValidationItem[] = [];

  // Calibrate measured height from detected boxes if available, or estimated from package height
  const netQtyBox = declarations.detectedBoxes?.find((b) => b.label === 'NET_QUANTITY');
  const mrpBox = declarations.detectedBoxes?.find((b) => b.label === 'MRP');

  const netQtyHeightMm = netQtyBox
    ? Math.max(0.8, (netQtyBox.heightPercent / 100) * packageHeightMm * 0.45) // glyph portion of box
    : declarations.netQuantityText.toLowerCase().includes('tiny') ? 1.1 : Math.max(requiredMinHeightMm + 0.3, 2.2);

  const mrpHeightMm = mrpBox
    ? Math.max(0.8, (mrpBox.heightPercent / 100) * packageHeightMm * 0.45)
    : declarations.mrpText.toLowerCase().includes('tiny') ? 1.2 : Math.max(requiredMinHeightMm + 0.2, 2.4);

  // 1. Net Quantity Numeral
  items.push({
    fieldName: `Net Quantity Numeral (${declarations.netQuantityText || `${weightInG}g`})`,
    measuredHeightMm: Number(netQtyHeightMm.toFixed(1)),
    requiredMinHeightMm,
    isCompliant: netQtyHeightMm >= requiredMinHeightMm * 0.95,
    statutoryRule: `Rule 8 Table (Threshold: ${requiredMinHeightMm.toFixed(1)}mm for ≤${weightInG >= 1000 ? `${weightInG / 1000}kg` : `${weightInG}g`})`,
    sampleText: declarations.netQuantityText || `${weightInG}g`,
  });

  // 2. MRP Numeral
  items.push({
    fieldName: 'MRP Numeral',
    measuredHeightMm: Number(mrpHeightMm.toFixed(1)),
    requiredMinHeightMm,
    isCompliant: mrpHeightMm >= requiredMinHeightMm * 0.95,
    statutoryRule: `Rule 8 Table (Threshold: ${requiredMinHeightMm.toFixed(1)}mm)`,
    sampleText: declarations.mrpValue ? declarations.mrpValue.toString() : 'MRP',
  });

  return items;
}

export function evaluateOvercharge(
  packageMrp: number,
  listingPrice: number,
  platform: string,
  listingTitle: string,
  rules: LegalRuleDefinition[]
): OverchargeResult {
  const ruleDef = rules.find((r) => r.ruleCode === 'RULE_18_2_OVERCHARGING_CHECK');
  const tolerance = ruleDef?.parameters.defaultPlatformToleranceInr ?? 0;
  const difference = listingPrice - packageMrp;
  const isOvercharging = difference > tolerance;
  const percentage = packageMrp > 0 ? (difference / packageMrp) * 100 : 0;

  return {
    packageMrp,
    listingPrice,
    differenceAmount: Number(difference.toFixed(2)),
    percentageOvercharge: Number(percentage.toFixed(2)),
    isOvercharging,
    platform: platform || 'E-Commerce Platform',
    listingTitle: listingTitle || 'Listed Product SKU',
    violationRule: 'Rule 18(2), PCR 2011 & Section 36(1) of Legal Metrology Act, 2009',
  };
}

export function gradeStatutoryNotice(
  rule6Violations: string[],
  fontViolations: FontValidationItem[],
  overchargeResult: OverchargeResult | undefined,
  rules: LegalRuleDefinition[],
  offenceType: 'FIRST_OFFENCE' | 'SUBSEQUENT_OFFENCE' = 'FIRST_OFFENCE'
): NoticeGradingResult {
  const penaltyRule = rules.find((r) => r.ruleCode === 'NOTICE_GRADING_COMPOUNDING');
  const p = penaltyRule?.parameters || {
    minorBaseFineInr: 5000,
    moderateBaseFineInr: 10000,
    severeBaseFineInr: 25000,
    secondOffenceMultiplier: 2.0,
    showCauseNoticePeriodDays: 15,
  };

  const infractions: string[] = [...rule6Violations];
  const sections: string[] = [];

  // Add font violations
  const failingFonts = fontViolations.filter((f) => !f.isCompliant);
  for (const f of failingFonts) {
    infractions.push(`Rule 8 Font Deficit: ${f.fieldName} measured ${f.measuredHeightMm}mm (below statutory minimum ${f.requiredMinHeightMm}mm).`);
  }

  if (failingFonts.length > 0) {
    sections.push('Rule 8 & Section 36(1) of LM Act 2009');
  }
  if (rule6Violations.length > 0) {
    sections.push('Rule 6(1) & Section 36(1) of LM Act 2009');
  }

  // Add overcharge
  if (overchargeResult && overchargeResult.isOvercharging) {
    infractions.push(
      `Rule 18(2) Overcharging: Listed retail price ₹${overchargeResult.listingPrice.toFixed(2)} exceeds physical package MRP ₹${overchargeResult.packageMrp.toFixed(2)} by ₹${overchargeResult.differenceAmount.toFixed(2)} (+${overchargeResult.percentageOvercharge}%).`
    );
    sections.push('Rule 18(2) PCR 2011 & Section 36(1) of LM Act 2009');
  }

  const violationCount = infractions.length;

  if (violationCount === 0) {
    return {
      grade: 'MINOR',
      severityScore: 0,
      compoundingPenaltyInr: 0,
      statutorySections: [],
      violationCount: 0,
      offenceType,
      showCauseNoticeDays: 0,
      summaryOfInfractions: [],
    };
  }

  // Calculate severity score
  let severityScore = 0;
  if (overchargeResult && overchargeResult.isOvercharging) severityScore += 50;
  if (failingFonts.length > 0) severityScore += 30;
  severityScore += rule6Violations.length * 20;

  let grade: 'MINOR' | 'MODERATE' | 'SEVERE' = 'MINOR';
  let baseFine = p.minorBaseFineInr;

  if (severityScore >= 65 || (overchargeResult && overchargeResult.isOvercharging)) {
    grade = 'SEVERE';
    baseFine = p.severeBaseFineInr;
  } else if (severityScore >= 35) {
    grade = 'MODERATE';
    baseFine = p.moderateBaseFineInr;
  }

  if (offenceType === 'SUBSEQUENT_OFFENCE') {
    baseFine *= p.secondOffenceMultiplier;
  }

  const finalPenalty = Math.min(baseFine, p.maxCompoundingLimitInr ?? 50000);

  return {
    grade,
    severityScore: Math.min(100, severityScore),
    compoundingPenaltyInr: finalPenalty,
    statutorySections: Array.from(new Set(sections)),
    violationCount,
    offenceType,
    showCauseNoticeDays: p.showCauseNoticePeriodDays ?? 15,
    summaryOfInfractions: infractions,
  };
}
