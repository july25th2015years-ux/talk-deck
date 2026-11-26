// scripts/verifyCounts.js
import { relationshipTopics } from '../src/data/topics/relationship.ts';
import { moneyValuesTopics } from '../src/data/topics/moneyValues.ts';
import { lifestyleTopics } from '../src/data/topics/lifestyle.ts';
import { pastInnerTopics } from '../src/data/topics/pastInner.ts';
import { futureTopics } from '../src/data/topics/future.ts';
import { intimacyTopics } from '../src/data/topics/intimacy.ts';

const sets = [
  { name: 'relationship', topics: relationshipTopics },
  { name: 'money-values', topics: moneyValuesTopics },
  { name: 'lifestyle', topics: lifestyleTopics },
  { name: 'past-inner', topics: pastInnerTopics },
  { name: 'future', topics: futureTopics },
  { name: 'intimacy', topics: intimacyTopics },
];

let total = 0;
let hasError = false;
const seenIds = new Set();
const seenTitles = new Set();

for (const s of sets) {
  const lv1 = s.topics.filter((t) => t.level === 1);
  const lv2 = s.topics.filter((t) => t.level === 2);
  const lv3 = s.topics.filter((t) => t.level === 3);

  console.log(
    `[${s.name}] total: ${s.topics.length}, Lv.1: ${lv1.length}, Lv.2: ${lv2.length}, Lv.3: ${lv3.length}`
  );
  total += s.topics.length;

  for (const t of s.topics) {
    if (seenIds.has(t.id)) {
      console.error(`DUPLICATE ID: ${t.id}`);
      hasError = true;
    }
    seenIds.add(t.id);

    if (seenTitles.has(t.title)) {
      console.error(`DUPLICATE TITLE: ${t.title}`);
      hasError = true;
    }
    seenTitles.add(t.title);

    if (!t.depthQuestions || t.depthQuestions.length < 3) {
      console.error(`INSUFFICIENT DEPTH QUESTIONS in ${t.id}`);
      hasError = true;
    }
  }
}

const allTopics = sets.flatMap((s) => s.topics);
const lv1Total = allTopics.filter((t) => t.level === 1).length;
const lv2Total = allTopics.filter((t) => t.level === 2).length;
const lv3Total = allTopics.filter((t) => t.level === 3).length;

console.log(`Total Topics: ${total} (Lv.1: ${lv1Total}, Lv.2: ${lv2Total}, Lv.3: ${lv3Total})`);
if (total !== 100 || hasError) {
  process.exit(1);
} else {
  console.log('Verification PASSED: Exactly 100 unique couple topics across 6 categories!');
}
