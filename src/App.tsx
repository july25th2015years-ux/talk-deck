import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Category, IntimacyLevel, Topic } from './types';
import { CATEGORIES, PRESET_TOPICS } from './data/topics';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { LevelFilter } from './components/LevelFilter';
import { TopicCard } from './components/TopicCard';
import { ActionButtons } from './components/ActionButtons';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import confetti from 'canvas-confetti';
import { MessageCircleHeart, Sparkles } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'talkdeck_couple_favorites_v2';
const SEEN_STORAGE_KEY = 'talkdeck_couple_seen_ids_v2';

function loadInitialDeckState(): { initialTopic: Topic; initialSeen: Set<string> } {
  const validPresetIds = new Set(PRESET_TOPICS.map((t) => t.id));
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(
          (id): id is string => typeof id === 'string' && validPresetIds.has(id)
        );
        if (cleaned.length > 0) {
          const seenSet = new Set(cleaned);
          const unshown = PRESET_TOPICS.filter((t) => !seenSet.has(t.id));
          if (unshown.length > 0) {
            const pick = unshown[Math.floor(Math.random() * unshown.length)];
            seenSet.add(pick.id);
            localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(seenSet)));
            return { initialTopic: pick, initialSeen: seenSet };
          }
          return {
            initialTopic: PRESET_TOPICS[Math.floor(Math.random() * PRESET_TOPICS.length)],
            initialSeen: seenSet,
          };
        }
      }
    }
  } catch {
    // Ignore storage errors in private mode
  }

  const first = PRESET_TOPICS[0];
  const initialSeen = new Set([first.id]);
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([first.id]));
  } catch {
    // Ignore storage errors
  }
  return { initialTopic: first, initialSeen };
}

export const App: React.FC = () => {
  const [{ initialTopic, initialSeen }] = useState(() => loadInitialDeckState());

  // Drawer
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedLevel, setSelectedLevel] = useState<IntimacyLevel | 'all'>('all');

  // Topics & History
  const [currentTopic, setCurrentTopic] = useState<Topic>(initialTopic);
  const [history, setHistory] = useState<Topic[]>([initialTopic]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Cycle tracking (questions shown so far without repetition)
  const [seenTopicIds, setSeenTopicIds] = useState<Set<string>>(initialSeen);
  const [cycleCompletedToast, setCycleCompletedToast] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<Topic[]>(() => {
    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        const parsed: unknown = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          return parsed as Topic[];
        }
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
    return [];
  });

  // Save Favorites on update
  const saveFavorites = (newFavs: Topic[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs));
    } catch (e) {
      console.error('Failed to persist favorites:', e);
    }
  };

  // Helper to update seen topic IDs in state and localStorage
  const updateSeenTopicIds = useCallback((newSet: Set<string>) => {
    setSeenTopicIds(newSet);
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch (e) {
      console.error('Failed to persist seen topic IDs:', e);
    }
  }, []);

  // Topic counts by category (respecting current level filter)
  const countsByCategory = useMemo(() => {
    const counts = {} as Record<Category, number>;
    for (const cat of CATEGORIES) {
      counts[cat.id] = 0;
    }
    for (const topic of PRESET_TOPICS) {
      if (selectedLevel === 'all' || topic.level === selectedLevel) {
        counts.all += 1;
        counts[topic.category] = (counts[topic.category] ?? 0) + 1;
      }
    }
    return counts;
  }, [selectedLevel]);

  // Filtered Topics based on current selections
  const filteredTopics = useMemo(() => {
    return PRESET_TOPICS.filter((t) => {
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || t.level === selectedLevel;
      return matchCategory && matchLevel;
    });
  }, [selectedCategory, selectedLevel]);

  // Count of topics in current filter that have been seen
  const seenInFilterCount = useMemo(() => {
    return filteredTopics.filter((t) => seenTopicIds.has(t.id)).length;
  }, [filteredTopics, seenTopicIds]);

  // Draw Next Topic (Guarantees NO repeats until full cycle finishes)
  const handleNextTopic = useCallback(() => {
    if (filteredTopics.length === 0) return;

    const unshown = filteredTopics.filter((t) => !seenTopicIds.has(t.id));

    // All topics in this filter have been shown (1周完了!)
    if (unshown.length === 0) {
      setCycleCompletedToast(true);
      setTimeout(() => setCycleCompletedToast(false), 3500);

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24'],
        });
      } catch {
        // Ignore confetti errors
      }

      const nextSeen = new Set(seenTopicIds);
      filteredTopics.forEach((t) => nextSeen.delete(t.id));

      const candidates =
        filteredTopics.length > 1
          ? filteredTopics.filter((t) => t.id !== currentTopic.id)
          : filteredTopics;
      const next = candidates[Math.floor(Math.random() * candidates.length)];

      nextSeen.add(next.id);
      updateSeenTopicIds(nextSeen);

      setIsFlipped(false);
      setCurrentTopic(next);

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return;
    }

    // Normal draw: pick strictly from unshown candidates
    const candidates = unshown.filter((t) => t.id !== currentTopic.id);
    const targetPool = candidates.length > 0 ? candidates : unshown;
    const next = targetPool[Math.floor(Math.random() * targetPool.length)];

    const nextSeen = new Set(seenTopicIds);
    nextSeen.add(next.id);
    updateSeenTopicIds(nextSeen);

    if (unshown.length === 1) {
      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#f43f5e', '#ec4899', '#a855f7'],
        });
      } catch {
        // Ignore confetti errors
      }
    } else if (next.level === 3) {
      try {
        confetti({
          particleCount: 22,
          spread: 50,
          origin: { y: 0.75 },
          colors: ['#f43f5e', '#ec4899', '#fbbf24'],
        });
      } catch {
        // Ignore confetti errors
      }
    }

    setIsFlipped(false);
    setCurrentTopic(next);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(next);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [filteredTopics, seenTopicIds, currentTopic.id, history, historyIndex, updateSeenTopicIds]);

  // Navigate Previous Topic in History
  const handlePrevTopic = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentTopic(history[prevIndex]);
      setIsFlipped(false);
    }
  }, [history, historyIndex]);

  // Reset cycle manually
  const handleResetCycle = useCallback(() => {
    if (window.confirm('表示中のカテゴリ・レベルの履歴をリセットして、最初からシャッフルする？')) {
      const nextSeen = new Set(seenTopicIds);
      filteredTopics.forEach((t) => nextSeen.delete(t.id));
      nextSeen.add(currentTopic.id);
      updateSeenTopicIds(nextSeen);
    }
  }, [seenTopicIds, filteredTopics, currentTopic.id, updateSeenTopicIds]);

  // Handle Filter Changes cleanly
  const pickTopicForFilter = useCallback(
    (nextCat: Category, nextLvl: IntimacyLevel | 'all') => {
      const matching = PRESET_TOPICS.filter((t) => {
        const matchCategory = nextCat === 'all' || t.category === nextCat;
        const matchLevel = nextLvl === 'all' || t.level === nextLvl;
        return matchCategory && matchLevel;
      });
      if (matching.length === 0) return;
      if (matching.some((t) => t.id === currentTopic.id)) return;

      const unshown = matching.filter((t) => !seenTopicIds.has(t.id));
      const pool = unshown.length > 0 ? unshown : matching;
      const next = pool[Math.floor(Math.random() * pool.length)];

      setCurrentTopic(next);
      setIsFlipped(false);
      updateSeenTopicIds(new Set([...seenTopicIds, next.id]));

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(next);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [currentTopic.id, seenTopicIds, updateSeenTopicIds, history, historyIndex]
  );

  const handleSelectCategory = useCallback(
    (cat: Category) => {
      setSelectedCategory(cat);
      pickTopicForFilter(cat, selectedLevel);
    },
    [pickTopicForFilter, selectedLevel]
  );

  const handleSelectLevel = useCallback(
    (lvl: IntimacyLevel | 'all') => {
      setSelectedLevel(lvl);
      pickTopicForFilter(selectedCategory, lvl);
    },
    [pickTopicForFilter, selectedCategory]
  );

  // Select a topic from Favorites without filter override conflict
  const handleSelectFavoriteTopic = useCallback(
    (topic: Topic) => {
      const matchesCurrent =
        (selectedCategory === 'all' || topic.category === selectedCategory) &&
        (selectedLevel === 'all' || topic.level === selectedLevel);
      if (!matchesCurrent) {
        setSelectedCategory('all');
        setSelectedLevel('all');
      }
      setCurrentTopic(topic);
      setIsFlipped(false);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(topic);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [selectedCategory, selectedLevel, history, historyIndex]
  );

  // Toggle Favorite
  const handleToggleFavorite = () => {
    const exists = favorites.some((f) => f.id === currentTopic.id);
    if (exists) {
      saveFavorites(favorites.filter((f) => f.id !== currentTopic.id));
    } else {
      saveFavorites([currentTopic, ...favorites]);
    }
  };

  // Keyboard Shortcuts (PC convenience)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      if (isFavoritesOpen) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleNextTopic();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevTopic();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextTopic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextTopic, handlePrevTopic, isFavoritesOpen]);

  const isCurrentFavorite = favorites.some((f) => f.id === currentTopic.id);

  // Couple conversation tips
  const tips = [
    '💞 答えに正解はないよ。「そういう考え方もあるんだ！」と違いを楽しむと一気に仲良くなれるよ。',
    '🦁 お金や将来の話も、今は「知れてよかった！」の作戦会議。気楽に本音を出し合ってみてね。',
    '🌙 ちょっと照れる質問は、まず自分から素直に答えてみると相手も話しやすくなるよ。',
    '✨ 盛り上がった質問や覚えておきたい本音は、右上のブックマークで残しておけるよ。',
  ];
  const todayTip = tips[new Date().getDate() % tips.length];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0f0d1a] bg-[radial-gradient(ellipse_at_top,_rgba(244,63,94,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(168,85,247,0.10),_transparent_55%)] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-x-hidden safe-top safe-bottom">
      {/* 1周完了トースト通知 */}
      {cycleCompletedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-gradient-to-r from-rose-600 to-purple-600 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-2xl border border-rose-300/50 flex items-center justify-center gap-2 animate-slide-up text-center">
          <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
          <span>🎉 このデッキを1周完走！カードをリシャッフルしたよ</span>
        </div>
      )}

      {/* Top Header & Filters */}
      <div>
        <Header
          favoritesCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
        />

        {/* Category Filter Tabs */}
        <div className="pt-2.5 sm:pt-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            countsByCategory={countsByCategory}
          />
        </div>

        {/* Depth Level Filter */}
        <div className="pt-1">
          <LevelFilter
            selectedLevel={selectedLevel}
            onSelectLevel={handleSelectLevel}
          />
        </div>
      </div>

      {/* Main Card View */}
      <main className="flex-1 flex flex-col items-center justify-center py-2">
        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-slate-400 max-w-sm space-y-3">
            <MessageCircleHeart className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              この条件のカードがまだないよ
            </p>
            <p className="text-xs text-slate-500">
              カテゴリまたは深さレベルのフィルターを変更してみてね。
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-medium"
            >
              フィルターをリセット
            </button>
          </div>
        ) : (
          <>
            <TopicCard
              topic={currentTopic}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped((prev) => !prev)}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            <ActionButtons
              onNext={handleNextTopic}
              onPrev={handlePrevTopic}
              canPrev={historyIndex > 0}
              onFlip={() => setIsFlipped((prev) => !prev)}
              isFlipped={isFlipped}
              seenCount={seenInFilterCount}
              totalCount={filteredTopics.length}
              onResetCycle={handleResetCycle}
            />
          </>
        )}
      </main>

      {/* Bottom Advice & Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-4 border-t border-white/10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl sm:rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs text-rose-200/90 leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          <span>{todayTip}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          TalkDeck &bull; ふたりをもっと知る100の質問
        </p>
      </footer>

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectTopic={handleSelectFavoriteTopic}
        onRemoveFavorite={(id) => {
          saveFavorites(favorites.filter((f) => f.id !== id));
        }}
        onClearAll={() => {
          saveFavorites([]);
        }}
      />
    </div>
  );
};

export default App;
