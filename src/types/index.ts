export type Category =
  | 'all'
  | 'relationship'
  | 'money-values'
  | 'lifestyle'
  | 'past-inner'
  | 'future'
  | 'intimacy';

export type IntimacyLevel = 1 | 2 | 3; // 1: ちょっと踏み込む, 2: 本音・価値観, 3: ディープ・未来

export interface Topic {
  id: string;
  category: Exclude<Category, 'all'>;
  level: IntimacyLevel;
  title: string;
  depthQuestions: string[];
  expansionTips: string;
  cautionTips?: string;
}

export interface CategoryMetadata {
  id: Category;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}
