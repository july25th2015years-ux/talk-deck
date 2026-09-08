// scripts/verifyCounts.js
import { firstMeetTopics } from '../src/data/topics/firstMeet.ts';
import { businessTopics } from '../src/data/topics/business.ts';
import { friendsTopics } from '../src/data/topics/friends.ts';
import { datingTopics } from '../src/data/topics/dating.ts';
import { deepQuestionsTopics } from '../src/data/topics/deepQuestions.ts';

const sets = [
  { name: 'first-meet', topics: firstMeetTopics },
  { name: 'business', topics: businessTopics },
  { name: 'friends', topics: friendsTopics },
  { name: 'dating', topics: datingTopics },
  { name: 'deep-questions', topics: deepQuestionsTopics },
];

let total = 0;
let hasError = false;

for (const s of sets) {
  const lv1 = s.topics.filter(t => t.level === 1);
  const lv2 = s.topics.filter(t => t.level === 2);
  const lv3 = s.topics.filter(t => t.level === 3);

  console.log(`[${s.name}] total: ${s.topics.length}, Lv.1: ${lv1.length}, Lv.2: ${lv2.length}, Lv.3: ${lv3.length}`);
  total += s.topics.length;

  if (lv1.length !== 100 || lv2.length !== 100 || lv3.length !== 100) {
    console.error(`ERROR in ${s.name}: Count mismatch!`);
    hasError = true;
  }
}

console.log(`Total Topics: ${total}`);
if (total !== 1500 || hasError) {
  process.exit(1);
} else {
  console.log('Verification PASSED: Exactly 1,500 topics across 15 category/level combinations!');
}
