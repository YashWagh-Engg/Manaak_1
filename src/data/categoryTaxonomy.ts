export interface CategoryTaxonomyEntry {
  category: string;
  displayName: string;
  keywords: string[];
  standardSizeSchedule: string | null;
  rule26CarveOut: boolean;
  regulatoryNotes: string;
}

export interface CategorizationResult {
  commodity_category: string;
  categoryName: string;
  declaredGenericName: string;
  matchedKeyword: string | null;
  standardSizeSchedule: string | null;
  isUndetermined: boolean;
  hasRule26CarveOut: boolean;
  explainerText: string;
  ruleReference: string;
}

export const CATEGORY_TAXONOMY: CategoryTaxonomyEntry[] = [
  // 1. Pan Masala, Supari Mix, Zarda (Statutory Dec 2025 Carve-out active)
  {
    category: 'pan_masala',
    displayName: 'Pan Masala & Areca Nut Preparations',
    keywords: [
      'pan masala',
      'paan masala',
      'supari mix',
      'supari',
      'zarda',
      'gutkha',
      'gutka',
      'scented supari',
      'flavoured supari',
      'flavored supari',
      'areca nut',
      'betel nut preparation',
      'mouth freshener pan masala',
    ],
    standardSizeSchedule: 'Second Schedule, Item 19 / Rule 5 (Pan Masala Packaging Norms)',
    rule26CarveOut: true,
    regulatoryNotes:
      'December 2025 Gazette Amendment Carve-Out: Pan Masala packages are strictly excluded from Rule 26(a) small-package exemptions (≤10g/ml). All Rule 6 mandatory declarations are mandatory regardless of net quantity.',
  },

  // 2. Bathing & Toilet Soaps
  {
    category: 'bath_product',
    displayName: 'Bathing & Toilet Soaps',
    keywords: [
      'bathing soap',
      'toilet soap',
      'beauty soap',
      'bath soap',
      'soap bar',
      'body wash',
      'cleansing bar',
      'antiseptic soap',
      'glycerin soap',
    ],
    standardSizeSchedule: 'Second Schedule, Item 2 (Toilet Soap / Bathing Soap)',
    rule26CarveOut: false,
    regulatoryNotes: 'Rule 5 standard packaging sizes prescribed in Second Schedule, Item 2.',
  },

  // 3. Detergents & Washing Powders
  {
    category: 'detergent',
    displayName: 'Detergents & Laundry Cleansers',
    keywords: [
      'detergent powder',
      'washing powder',
      'laundry detergent',
      'detergent bar',
      'washing bar',
      'dishwash bar',
      'dishwash liquid',
      'fabric detergent',
      'liquid detergent',
    ],
    standardSizeSchedule: 'Second Schedule, Item 11 (Detergent Powder / Washing Cleansers)',
    rule26CarveOut: false,
    regulatoryNotes: 'Rule 5 standard mass packaging intervals apply under Second Schedule, Item 11.',
  },

  // 4. Biscuits, Cookies & Baked Snacks
  {
    category: 'food_snack',
    displayName: 'Biscuits, Cookies & Baked Snacks',
    keywords: [
      'biscuit',
      'biscuits',
      'cookies',
      'cookie',
      'gluco biscuits',
      'butter cookies',
      'rusk',
      'wafer',
      'crackers',
      'namkeen',
      'potato chips',
      'snack food',
      'extruded snacks',
    ],
    standardSizeSchedule: 'Second Schedule, Item 1 (Biscuits & Baked Confectionery)',
    rule26CarveOut: false,
    regulatoryNotes: 'Specified packaging weights under Second Schedule, Item 1.',
  },

  // 5. Shampoos & Hair Oils
  {
    category: 'hair_care',
    displayName: 'Hair Care (Shampoos & Hair Oils)',
    keywords: [
      'shampoo',
      'hair oil',
      'hair conditioner',
      'scalp tonic',
      'hair cleanser',
      'hair serum',
      'amla hair oil',
      'coconut hair oil',
    ],
    standardSizeSchedule: 'Second Schedule, Item 16 (Hair Oils & Shampoos)',
    rule26CarveOut: false,
    regulatoryNotes: 'Prescribed standard volume declarations under Second Schedule, Item 16.',
  },

  // 6. Milk & Dairy Products
  {
    category: 'dairy_milk',
    displayName: 'Milk & Fresh Dairy Commodities',
    keywords: [
      'milk',
      'toned milk',
      'homogenised milk',
      'homogenized milk',
      'pasteurized milk',
      'pasteurised milk',
      'cow milk',
      'double toned milk',
      'full cream milk',
      'curd',
      'dahi',
      'paneer',
      'butter',
      'dairy whitener',
    ],
    standardSizeSchedule: 'Second Schedule, Item 4 (Milk & Dairy Products)',
    rule26CarveOut: false,
    regulatoryNotes: 'Mandatory standard volume declarations under Second Schedule, Item 4.',
  },

  // 7. Edible Vegetable Oils, Vanaspati & Ghee
  {
    category: 'edible_oil',
    displayName: 'Edible Vegetable Oils & Ghee',
    keywords: [
      'edible oil',
      'cooking oil',
      'vegetable oil',
      'sunflower oil',
      'mustard oil',
      'soyabean oil',
      'groundnut oil',
      'refined oil',
      'vanaspati',
      'ghee',
      'desi ghee',
      'blended edible vegetable oil',
    ],
    standardSizeSchedule: 'Second Schedule, Item 5 (Edible Oils, Vanaspati & Ghee)',
    rule26CarveOut: false,
    regulatoryNotes: 'Mandatory volume / mass declarations under Second Schedule, Item 5.',
  },

  // 8. Edible Salt
  {
    category: 'edible_salt',
    displayName: 'Edible Common Salt',
    keywords: [
      'salt',
      'table salt',
      'iodised salt',
      'iodized salt',
      'vacuum evaporated salt',
      'rock salt',
      'edible salt',
    ],
    standardSizeSchedule: 'Second Schedule, Item 14 (Table Salt / Edible Common Salt)',
    rule26CarveOut: false,
    regulatoryNotes: 'Standard sizes prescribed under Second Schedule, Item 14.',
  },

  // 9. Tea & Coffee
  {
    category: 'tea_coffee',
    displayName: 'Tea & Coffee Commodities',
    keywords: [
      'tea',
      'chai',
      'tea leaves',
      'black tea',
      'green tea',
      'coffee',
      'instant coffee',
      'coffee chicory blend',
      'filter coffee',
    ],
    standardSizeSchedule: 'Second Schedule, Item 3 (Tea and Coffee)',
    rule26CarveOut: false,
    regulatoryNotes: 'Standard weights prescribed under Second Schedule, Item 3.',
  },

  // 10. Packaged Drinking Water & Beverages
  {
    category: 'packaged_water',
    displayName: 'Packaged Drinking Water & Beverages',
    keywords: [
      'packaged drinking water',
      'mineral water',
      'drinking water',
      'aerated water',
      'carbonated beverage',
      'soft drink',
      'fruit beverage',
      'fruit juice',
    ],
    standardSizeSchedule: 'Second Schedule, Item 15 (Packaged Drinking Water & Aerated Beverages)',
    rule26CarveOut: false,
    regulatoryNotes: 'Standard volume increments under Second Schedule, Item 15.',
  },

  // 11. Toothpaste & Oral Care
  {
    category: 'oral_care',
    displayName: 'Toothpaste & Oral Hygiene',
    keywords: [
      'toothpaste',
      'tooth powder',
      'dental cream',
      'mouthwash',
      'toothache drops',
    ],
    standardSizeSchedule: 'Second Schedule, Item 17 (Toothpaste & Dentifrice)',
    rule26CarveOut: false,
    regulatoryNotes: 'Standard mass intervals prescribed under Second Schedule, Item 17.',
  },

  // 12. Cereals, Pulses & Foodgrains
  {
    category: 'cereals_pulses',
    displayName: 'Foodgrains, Cereals & Pulses',
    keywords: [
      'rice',
      'wheat flour',
      'atta',
      'maida',
      'suji',
      'rawa',
      'dal',
      'pulses',
      'foodgrains',
      'besan',
    ],
    standardSizeSchedule: 'Second Schedule, Item 6 (Foodgrains, Cereals and Pulses)',
    rule26CarveOut: false,
    regulatoryNotes: 'Rule 5 standard mass packaging intervals apply under Second Schedule, Item 6.',
  },
];

/**
 * Controlled Category Lookup
 * Maps declared generic name text to statutory regulatory categories.
 * DO NOT GUESS: If the generic name does not match any controlled taxonomy entry,
 * it returns "undetermined" requiring officer manual review.
 */
export function lookupCategoryByGenericName(declaredGenericName?: string | null): CategorizationResult {
  const rawText = (declaredGenericName || '').trim();
  const lowerText = rawText.toLowerCase();

  // If no generic name provided or string is empty, mark as undetermined
  if (!lowerText) {
    return {
      commodity_category: 'undetermined',
      categoryName: 'Undetermined Category',
      declaredGenericName: rawText,
      matchedKeyword: null,
      standardSizeSchedule: null,
      isUndetermined: true,
      hasRule26CarveOut: false,
      explainerText: 'Category could not be automatically determined — officer review required',
      ruleReference: 'Rule 6(1)(b) PCR 2011 Generic Name Verification',
    };
  }

  // Find matching taxonomy entry
  // Prioritize longer keyword matches first to avoid partial conflicts (e.g. "hair oil" before "oil")
  let bestMatch: { entry: CategoryTaxonomyEntry; keyword: string } | null = null;
  let bestLength = 0;

  for (const entry of CATEGORY_TAXONOMY) {
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      // Match if the keyword exists as substring or whole word in lowerText
      if (lowerText.includes(kwLower)) {
        if (kwLower.length > bestLength) {
          bestMatch = { entry, keyword: kw };
          bestLength = kwLower.length;
        }
      }
    }
  }

  if (bestMatch) {
    const { entry, keyword } = bestMatch;
    return {
      commodity_category: entry.category,
      categoryName: entry.displayName,
      declaredGenericName: rawText,
      matchedKeyword: keyword,
      standardSizeSchedule: entry.standardSizeSchedule,
      isUndetermined: false,
      hasRule26CarveOut: entry.rule26CarveOut,
      explainerText: `Matched generic name "${rawText}" to statutory keyword "${keyword}" in category "${entry.displayName}". Traceable to Rule 6(1)(b) label text.`,
      ruleReference: `Rule 6(1)(b) & ${entry.standardSizeSchedule || 'Rule 5 Schedule'}`,
    };
  }

  // FALLBACK — DO NOT GUESS:
  // If the generic_name text doesn't confidently match any taxonomy entry,
  // set commodity_category to "undetermined" and display a clear UI flag.
  return {
    commodity_category: 'undetermined',
    categoryName: 'Undetermined Category',
    declaredGenericName: rawText,
    matchedKeyword: null,
    standardSizeSchedule: null,
    isUndetermined: true,
    hasRule26CarveOut: false,
    explainerText: 'Category could not be automatically determined — officer review required',
    ruleReference: 'Rule 6(1)(b) PCR 2011 Generic Name Verification',
  };
}
