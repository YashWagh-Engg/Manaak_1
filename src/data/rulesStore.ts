import { LegalRuleDefinition } from '../types';

export const INITIAL_RULES: LegalRuleDefinition[] = [
  {
    ruleCode: 'RULE_6_MANDATORY_DECLARATIONS',
    title: 'Rule 6 - Mandatory Declarations on Pre-Packaged Commodities',
    category: 'DECLARATIONS',
    description: 'Every package shall bear legible, unambiguous, and conspicuous mandatory declarations under Rule 6(1) of Legal Metrology (Packaged Commodities) Rules, 2011.',
    statutoryReference: 'Rule 6(1)(a)-(h), PCR 2011 & Sec 18 LM Act 2009',
    enabled: true,
    parameters: {
      requireMrp: true,
      requireTaxInclusiveStatement: true,
      requireNetQuantity: true,
      requireMfgDate: true,
      requireBestBeforeForFoods: true,
      requireManufacturerAddress: true,
      requireConsumerCare: true,
      requireCountryOfOrigin: true,
      strictTaxPhraseMatch: false, // allows "incl. of all taxes" or "inclusive of all taxes"
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Chief Metrology Admin',
  },
  {
    ruleCode: 'RULE_7_8_FONT_SPECIFICATIONS',
    title: 'Rule 7 & 8 - Minimum Font Height for Numerals and Letters',
    category: 'FONT_SPECIFICATIONS',
    description: 'Minimum height of numeral and letters expressing net quantity and other declarations based on net weight/measure under Rule 8 Table.',
    statutoryReference: 'Rule 8, Table 1 (Minimum Height of Numerals), PCR 2011',
    enabled: true,
    parameters: {
      tiers: [
        { maxWeightG: 50, minHeightMm: 1.0, blownMinHeightMm: 2.0 },
        { maxWeightG: 200, minHeightMm: 2.0, blownMinHeightMm: 4.0 },
        { maxWeightG: 1000, minHeightMm: 4.0, blownMinHeightMm: 6.0 },
        { maxWeightG: 999999, minHeightMm: 6.0, blownMinHeightMm: 6.0 },
      ],
      tolerancePercent: 5.0, // 5% measurement tolerance for optical perspective
      enforceOnMrp: true,
      enforceOnNetQty: true,
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Chief Metrology Admin',
  },
  {
    ruleCode: 'RULE_26_EXEMPTIONS',
    title: 'Rule 26 - Statutory Exemptions from Packaged Commodities Rules',
    category: 'EXEMPTIONS',
    description: 'Packages that are legally exempt from the application of PCR 2011 requirements.',
    statutoryReference: 'Rule 26(a)-(e), PCR 2011',
    enabled: true,
    parameters: {
      smallPackageThresholdGramsOrMl: 10, // <= 10g or 10ml exempt
      bulkAgricultureThresholdKg: 50, // > 50kg agricultural produce exempt
      allowRestaurantCounterPack: true,
      allowIndustrialConsumerExemption: true,
      exemptMedicinesUnderDpco: true,
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Chief Metrology Admin',
  },
  {
    ruleCode: 'RULE_18_2_OVERCHARGING_CHECK',
    title: 'Rule 18(2) & Sec 36(1) - Prohibition of Overcharging above MRP',
    category: 'OVERCHARGING',
    description: 'No retail dealer, e-commerce entity, or person shall sell any commodity in packed form at a price exceeding the retail sale price (MRP). Also prohibits dual MRP.',
    statutoryReference: 'Rule 18(2), PCR 2011 & Section 36(1) LM Act 2009',
    enabled: true,
    parameters: {
      strictZeroTolerance: true,
      flagDualPricing: true,
      considerConvenienceFeeAsOvercharge: true,
      defaultPlatformToleranceInr: 0.0,
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Chief Metrology Admin',
  },
  {
    ruleCode: 'NOTICE_GRADING_COMPOUNDING',
    title: 'Statutory Notice Grading & Compounding Formula (Sec 36(1) & 49)',
    category: 'PENALTIES',
    description: 'Calculates compounding penalty and notice severity under Section 36(1) and Section 49 of Legal Metrology Act, 2009.',
    statutoryReference: 'Section 36(1) & Section 48/49, LM Act 2009',
    enabled: true,
    parameters: {
      minorBaseFineInr: 5000,
      moderateBaseFineInr: 10000,
      severeBaseFineInr: 25000,
      secondOffenceMultiplier: 2.0,
      showCauseNoticePeriodDays: 15,
      maxCompoundingLimitInr: 50000,
    },
    lastUpdated: new Date().toISOString(),
    updatedBy: 'Chief Metrology Admin',
  },
];
