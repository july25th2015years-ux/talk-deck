export type Category = 
  | 'all'
  | 'business' 
  | 'first-meet' 
  | 'friends' 
  | 'dating' 
  | 'deep-questions';

export type IntimacyLevel = 1 | 2 | 3; // 1: 初対面・安心, 2: 打ち解け, 3: 親密・ディープ

export interface Topic {
  id: string;
  category: Exclude<Category, 'all'>;
  level: IntimacyLevel;
  title: string;
  depthQuestions: string[];
  expansionTips: string;
  cautionTips?: string;
  isCustom?: boolean;
}

export interface CategoryMetadata {
  id: Category;
  label: string;
  emoji: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
}
