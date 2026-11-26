import type { CategoryMetadata, Topic } from '../types';
import { relationshipTopics } from './topics/relationship';
import { moneyValuesTopics } from './topics/moneyValues';
import { lifestyleTopics } from './topics/lifestyle';
import { pastInnerTopics } from './topics/pastInner';
import { futureTopics } from './topics/future';
import { intimacyTopics } from './topics/intimacy';

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'all',
    label: 'すべて (100問)',
    shortLabel: 'すべて',
    emoji: '✨',
    color: 'from-rose-500 to-purple-500',
    bgGradient: 'bg-gradient-to-r from-rose-500/10 to-purple-500/10',
    borderColor: 'border-rose-500/40',
    badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    badgeText: 'text-rose-400',
  },
  {
    id: 'relationship',
    label: 'ふたりの関係・本音',
    shortLabel: 'ふたりの関係',
    emoji: '💕',
    color: 'from-pink-500 to-rose-500',
    bgGradient: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/40',
    badgeBg: 'bg-pink-500/20 text-pink-200 border-pink-500/30',
    badgeText: 'text-pink-400',
  },
  {
    id: 'money-values',
    label: 'お金・リベシティ・価値観',
    shortLabel: 'お金・価値観',
    emoji: '🦁',
    color: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    id: 'lifestyle',
    label: '生活スタイル・相性',
    shortLabel: '生活・相性',
    emoji: '🏡',
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  {
    id: 'past-inner',
    label: '過去・素の自分',
    shortLabel: '過去・素の自分',
    emoji: '🌙',
    color: 'from-indigo-500 to-blue-500',
    bgGradient: 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10',
    borderColor: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
    badgeText: 'text-indigo-400',
  },
  {
    id: 'future',
    label: 'これからの未来',
    shortLabel: 'これから・未来',
    emoji: '🚀',
    color: 'from-violet-500 to-fuchsia-500',
    bgGradient: 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10',
    borderColor: 'border-violet-500/40',
    badgeBg: 'bg-violet-500/20 text-violet-200 border-violet-500/30',
    badgeText: 'text-violet-400',
  },
  {
    id: 'intimacy',
    label: 'ドキッと・距離感',
    shortLabel: '距離感・スキンシップ',
    emoji: '🔥',
    color: 'from-red-500 to-pink-500',
    bgGradient: 'bg-gradient-to-r from-red-500/10 to-pink-500/10',
    borderColor: 'border-red-500/40',
    badgeBg: 'bg-rose-500/25 text-rose-200 border-rose-400/40',
    badgeText: 'text-rose-400',
  },
];

export const PRESET_TOPICS: Topic[] = [
  ...relationshipTopics,
  ...moneyValuesTopics,
  ...lifestyleTopics,
  ...pastInnerTopics,
  ...futureTopics,
  ...intimacyTopics,
];
