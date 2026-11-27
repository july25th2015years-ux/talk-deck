import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Topic } from './types';
import { PRESET_TOPICS } from './data/topics';
import { Header } from './components/Header';
import { TopicCard } from './components/TopicCard';
import { ActionButtons } from './components/ActionButtons';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

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

  // Count of topics that have been seen
  const seenCount = useMemo(() => {
    return PRESET_TOPICS.filter((t) => seenTopicIds.has(t.id)).length;
  }, [seenTopicIds]);

  // Draw Next Topic (Guarantees NO repeats until full 100-question cycle finishes)
  const handleNextTopic = useCallback(() => {
    if (PRESET_TOPICS.length === 0) return;

    const unshown = PRESET_TOPICS.filter((t) => !seenTopicIds.has(t.id));

    // All 100 topics have been shown (1周完了!)
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

      const candidates =
        PRESET_TOPICS.length > 1
          ? PRESET_TOPICS.filter((t) => t.id !== currentTopic.id)
          : PRESET_TOPICS;
      const next = candidates[Math.floor(Math.random() * candidates.length)];

      updateSeenTopicIds(new Set([next.id]));

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
  }, [seenTopicIds, currentTopic.id, history, historyIndex, updateSeenTopicIds]);

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
    if (window.confirm('これまでに出た質問の履歴をリセットして、100問を最初からシャッフルする？')) {
      updateSeenTopicIds(new Set([currentTopic.id]));
    }
  }, [currentTopic.id, updateSeenTopicIds]);

  // Select a topic from Favorites
  const handleSelectFavoriteTopic = useCallback(
    (topic: Topic) => {
      setCurrentTopic(topic);
      setIsFlipped(false);
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(topic);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
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
          <span>🎉 100問を1周完走！カードをリシャッフルしたよ</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Card View */}
      <main className="flex-1 flex flex-col items-center justify-center py-2">
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
          seenCount={seenCount}
          totalCount={PRESET_TOPICS.length}
          onResetCycle={handleResetCycle}
        />
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
