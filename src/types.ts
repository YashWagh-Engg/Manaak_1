export type UserRole = 'field_officer' | 'supervisor' | 'admin';

export interface BoundingBox {
  topPercent: number;
  leftPercent: number;
  widthPercent: number;
  heightPercent: number;
  label: string;
  confidence: number;
  text?: string;
  polygon?: [number, number][];
}

export interface PaddleOcrTextLine {
  polygon: [number, number][]; // 4 points [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] in percent (0-100)
  text: string;
  confidence: number;
  label?: string;
  measuredHeightMm?: number;
}

export interface PaddleOcrResult {
  engine: string;
  detectionModel: string;
  recognitionModel: string;
  directionClassifier: string;
  directionAngle: number;
  textLines: PaddleOcrTextLine[];
  processingTimeMs: number;
}

export interface ExtractedDeclarations {
  mrpText: string;
  mrpValue: number | null;
  hasInclusiveOfTaxes: boolean;
  netQuantityText: string;
  netQuantityValue: number | null;
  netQuantityUnit: string;
  mfgMonthYear: string;
  bestBefore: string;
  manufacturerName: string;
  manufacturerAddress: string;
  packerOrImporter: string;
  consumerCarePhone: string;
  consumerCareEmail: string;
  consumerCareAddress: string;
  countryOfOrigin: string;
  rawOcrText: string;
  detectedBoxes?: BoundingBox[];
  paddleOcrResult?: PaddleOcrResult;
  isFallback?: boolean;
  fallbackReason?: string;
  extractionMethod?: 'gemini_multimodal' | 'fallback_sample';
}

export interface FontValidationItem {
  fieldName: string;
  measuredHeightMm: number;
  requiredMinHeightMm: number;
  isCompliant: boolean;
  statutoryRule: string;
  sampleText: string;
}

export interface ExemptionCheck {
  isExempt: boolean;
  clause: string;
  reason: string;
}

export interface OverchargeResult {
  listingPrice: number;
  packageMrp: number;
  differenceAmount: number;
  percentageOvercharge: number;
  isOvercharging: boolean;
  platform: string;
  listingTitle: string;
  violationRule: string;
}

export type NoticeGrade = 'MINOR' | 'MODERATE' | 'SEVERE';

export interface NoticeGradingResult {
  grade: NoticeGrade;
  severityScore: number;
  compoundingPenaltyInr: number;
  statutorySections: string[];
  violationCount: number;
  offenceType: 'FIRST_OFFENCE' | 'SUBSEQUENT_OFFENCE';
  showCauseNoticeDays: number;
  summaryOfInfractions: string[];
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  productName: string;
  brand: string;
  category: string;
  packageHeightMm: number;
  packageWidthMm: number;
  imageUrl: string;
  declarations: ExtractedDeclarations;
  fontValidations: FontValidationItem[];
  exemption: ExemptionCheck;
  overchargeCheck?: OverchargeResult;
  noticeGrading: NoticeGradingResult;
  status: 'PENDING_REVIEW' | 'VERIFIED' | 'NOTICE_ISSUED' | 'DISMISSED';
  inspectorName: string;
  inspectorRole: UserRole;
  supervisorNotes?: string;
  isFallback?: boolean;
  fallbackReason?: string;
  extractionMethod?: 'gemini_multimodal' | 'fallback_sample';
}

export interface LegalRuleDefinition {
  ruleCode: string;
  title: string;
  category: 'DECLARATIONS' | 'FONT_SPECIFICATIONS' | 'EXEMPTIONS' | 'OVERCHARGING' | 'PENALTIES';
  description: string;
  statutoryReference: string;
  enabled: boolean;
  parameters: Record<string, any>;
  lastUpdated: string;
  updatedBy: string;
}

export interface E2ETestStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  latencyMs?: number;
  details?: string;
}
