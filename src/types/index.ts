export type Category =
  | 'blanket'
  | 'laundry_basket'
  | 'hangers'
  | 'fan'
  | 'heater'
  | 'shoes'
  | 'cleaning_supplies'
  | 'clothing'
  | 'other';

export type Condition = 'good' | 'worn' | 'unclear';
export type Confidence = 'high' | 'medium' | 'low';
export type Rule = 'accept' | 'reject' | 'ask';

export interface OrgRule {
  rule: Rule;
  note?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'shelter' | 'thrift' | 'campus_group' | 'other';
  address: string;
  hours: string;
  website?: string;
  lastVerified: string;
  isSample: boolean;
  badgeNumber: string;
  themeColor: 'lime' | 'coral' | 'blue' | 'emerald';
  acceptsDescription: string;
  rules: Record<Category, OrgRule>;
}

export interface DetectedItem {
  id: string;
  category: Category;
  label: string;
  quantity: number;
  condition: Condition;
  confidence: Confidence;
  note?: string;
  needsConditionCheck?: boolean;
  conditionCheckQuestion?: string;
  isConditionConfirmed?: boolean;
}

export interface AnalysisResponse {
  items: DetectedItem[];
  detectedSummary?: string;
}

export interface MatchGroup {
  organization: Organization;
  items: DetectedItem[];
}

export interface MatchResult {
  stops: MatchGroup[];
  unmatched: DetectedItem[];
  pendingChecks: DetectedItem[];
}

export interface SamplePile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  items: DetectedItem[];
}
