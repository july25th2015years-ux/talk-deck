import type { CategoryMetadata, Topic } from '../types';
import { firstMeetTopics } from './topics/firstMeet';
import { businessTopics } from './topics/business';
import { friendsTopics } from './topics/friends';
import { datingTopics } from './topics/dating';
import { deepQuestionsTopics } from './topics/deepQuestions';

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'all',
    label: 'すべて',
    emoji: '✨',
    color: 'from-indigo-500 to-purple-500',
    bgGradient: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
    borderColor: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/20 text-indigo-300',
    badgeText: 'text-indigo-400',
  },
  {
    id: 'first-meet',
    label: '初対面・アイスブレイク',
    emoji: '🌱',
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/20 text-emerald-300',
    badgeText: 'text-emerald-400',
  },
  {
    id: 'business',
    label: '職場・ビジネス',
    emoji: '💼',
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/40',
    badgeBg: 'bg-blue-500/20 text-blue-300',
    badgeText: 'text-blue-400',
  },
  {
    id: 'friends',
    label: 'プライベート・友人',
    emoji: '☕',
    color: 'from-amber-500 to-orange-500',
    bgGradient: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/20 text-amber-300',
    badgeText: 'text-amber-400',
  },
  {
    id: 'dating',
    label: 'デート・恋愛',
    emoji: '🥂',
    color: 'from-pink-500 to-rose-500',
    bgGradient: 'bg-gradient-to-r from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-500/40',
    badgeBg: 'bg-pink-500/20 text-pink-300',
    badgeText: 'text-pink-400',
  },
  {
    id: 'deep-questions',
    label: 'もしも・深掘り',
    emoji: '🔮',
    color: 'from-violet-500 to-fuchsia-500',
    bgGradient: 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10',
    borderColor: 'border-violet-500/40',
    badgeBg: 'bg-violet-500/20 text-violet-300',
    badgeText: 'text-violet-400',
  },
];

export const PRESET_TOPICS: Topic[] = [
  ...firstMeetTopics,
  ...businessTopics,
  ...friendsTopics,
  ...datingTopics,
  ...deepQuestionsTopics,
];
