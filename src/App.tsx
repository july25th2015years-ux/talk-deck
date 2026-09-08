import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Category, IntimacyLevel, Topic, GeminiConfig } from './types';
import { PRESET_TOPICS } from './data/topics';
import { getStoredGeminiConfig, saveStoredGeminiConfig, removeStoredGeminiConfig } from './services/gemini';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { LevelFilter } from './components/LevelFilter';
import { TopicCard } from './components/TopicCard';
import { ActionButtons } from './components/ActionButtons';
import { SettingsModal } from './components/SettingsModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CustomTopicModal } from './components/CustomTopicModal';
import { AiExpandModal } from './components/AiExpandModal';
import confetti from 'canvas-confetti';
import { MessageCircleHeart, Sparkles } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'talkdeck_favorites';
const SEEN_STORAGE_KEY = 'talkdeck_seen_topic_ids';

export const App: React.FC = () => {
  // Config & Modals
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCustomTopicOpen, setIsCustomTopicOpen] = useState(false);
  const [isAiExpandOpen, setIsAiExpandOpen] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedLevel, setSelectedLevel] = useState<IntimacyLevel | 'all'>('all');

  // Topics & History
  const [customTopics, setCustomTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic>(PRESET_TOPICS[0]);
  const [history, setHistory] = useState<Topic[]>([PRESET_TOPICS[0]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Cycle tracking (questions shown so far without repetition)
  const [seenTopicIds, setSeenTopicIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(SEEN_STORAGE_KEY);
      if (raw) {
        return new Set(JSON.parse(raw));
      }
    } catch {}
    return new Set([PRESET_TOPICS[0].id]);
  });
  const [cycleCompletedToast, setCycleCompletedToast] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<Topic[]>([]);

  // Load Initial Settings & Favorites
  useEffect(() => {
    const storedConfig = getStoredGeminiConfig();
    if (storedConfig) {
      setGeminiConfig(storedConfig);
    }

    try {
      const savedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
    }
  }, []);

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

  // Combine Preset + Custom Topics
  const allAvailableTopics = useMemo(() => {
    return [...customTopics, ...PRESET_TOPICS];
  }, [customTopics]);

  // Filtered Topics based on current selections
  const filteredTopics = useMemo(() => {
    return allAvailableTopics.filter((t) => {
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || t.level === selectedLevel;
      return matchCategory && matchLevel;
    });
  }, [allAvailableTopics, selectedCategory, selectedLevel]);

  // Count of topics in current filter that have been seen
  const seenInFilterCount = useMemo(() => {
    return filteredTopics.filter((t) => seenTopicIds.has(t.id)).length;
  }, [filteredTopics, seenTopicIds]);

  // Draw Next Topic (Guarantees NO repeats until full cycle finishes)
  const handleNextTopic = useCallback(() => {
    if (filteredTopics.length === 0) return;

    // 1. Find unshown topics in the current active filter
    const unshown = filteredTopics.filter((t) => !seenTopicIds.has(t.id));

    // 2. If ALL topics in this filter have been shown (1周完了!)
    if (unshown.length === 0) {
      // Show celebratory notification
      setCycleCompletedToast(true);
      setTimeout(() => setCycleCompletedToast(false), 3500);

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#38bdf8', '#fbbf24'],
        });
      } catch {}

      // Reset seen status for topics belonging to this filter
      const nextSeen = new Set(seenTopicIds);
      filteredTopics.forEach((t) => nextSeen.delete(t.id));

      // Pick a random topic for the new round
      const candidates = filteredTopics.length > 1
        ? filteredTopics.filter((t) => t.id !== currentTopic.id)
        : filteredTopics;
      const randomIndex = Math.floor(Math.random() * candidates.length);
      const next = candidates[randomIndex];

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

    // 3. Normal draw: pick strictly from unshown candidates
    const candidates = unshown.filter((t) => t.id !== currentTopic.id);
    const targetPool = candidates.length > 0 ? candidates : unshown;
    const randomIndex = Math.floor(Math.random() * targetPool.length);
    const next = targetPool[randomIndex];

    const nextSeen = new Set(seenTopicIds);
    nextSeen.add(next.id);
    updateSeenTopicIds(nextSeen);

    // If this was the last question of the cycle
    if (unshown.length === 1) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#ec4899', '#6366f1'],
        });
      } catch {}
    } else if (next.level === 3) {
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.75 },
          colors: ['#a855f7', '#ec4899', '#6366f1'],
        });
      } catch {}
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
    if (window.confirm('現在のカテゴリ・親密度の出題履歴をリセットして、最初からシャッフルしますか？')) {
      const nextSeen = new Set(seenTopicIds);
      filteredTopics.forEach((t) => nextSeen.delete(t.id));
      nextSeen.add(currentTopic.id);
      updateSeenTopicIds(nextSeen);
    }
  }, [seenTopicIds, filteredTopics, currentTopic.id, updateSeenTopicIds]);

  // If filter changes and current topic doesn't match, pick an unshown one in the new filter
  useEffect(() => {
    if (filteredTopics.length > 0) {
      const isCurrentMatching = filteredTopics.some((t) => t.id === currentTopic.id);
      if (!isCurrentMatching) {
        const unshown = filteredTopics.filter((t) => !seenTopicIds.has(t.id));
        const pool = unshown.length > 0 ? unshown : filteredTopics;
        const next = pool[Math.floor(Math.random() * pool.length)];
        setCurrentTopic(next);
        setIsFlipped(false);
        updateSeenTopicIds(new Set([...seenTopicIds, next.id]));
      }
    }
  }, [filteredTopics, currentTopic.id, seenTopicIds, updateSeenTopicIds]);

  // Toggle Favorite
  const handleToggleFavorite = () => {
    const exists = favorites.some((f) => f.id === currentTopic.id);
    if (exists) {
      saveFavorites(favorites.filter((f) => f.id !== currentTopic.id));
    } else {
      saveFavorites([currentTopic, ...favorites]);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
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
  }, [handleNextTopic, handlePrevTopic]);

  // When AI generates a custom topic
  const handleCustomTopicGenerated = (newTopic: Topic) => {
    setCustomTopics((prev) => [newTopic, ...prev]);
    setCurrentTopic(newTopic);
    setIsFlipped(false);
    updateSeenTopicIds(new Set([...seenTopicIds, newTopic.id]));

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTopic);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38bdf8', '#fbbf24'],
      });
    } catch {}
  };

  // Append questions from AI expand
  const handleAppendQuestions = (newQuestions: string[], newAdvice: string) => {
    setCurrentTopic((prev) => ({
      ...prev,
      depthQuestions: [...prev.depthQuestions, ...newQuestions],
      expansionTips: `${prev.expansionTips} 【AIアドバイス】${newAdvice}`,
    }));
  };

  // Config handlers
  const handleSaveConfig = (cfg: GeminiConfig) => {
    setGeminiConfig(cfg);
    saveStoredGeminiConfig(cfg);
  };

  const handleRemoveConfig = () => {
    setGeminiConfig(null);
    removeStoredGeminiConfig();
  };

  const isCurrentFavorite = favorites.some((f) => f.id === currentTopic.id);

  // Daily conversation advice tips
  const tips = [
    '💡 会話の黄金比は「相手7割・自分3割」。聞き手に回るほど相手は満足します。',
    '✨ 相手の答えをオウム返ししながら「それいいですね！」と共感すると親近感が急上昇します。',
    '🤝 会話が途切れても慌てずに。笑顔でうなずくだけで安心感が生まれます。',
    '🎯 まずは自分から小さな失敗談や具体例を話すと、相手も本音を話しやすくなります。',
  ];
  const todayTip = tips[new Date().getDate() % tips.length];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative">
      {/* 1周完了トースト通知 */}
      {cycleCompletedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl border border-purple-400/60 flex items-center gap-2 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>🎉 すべての質問を1周しました！デッキをリシャッフルしました</span>
        </div>
      )}

      {/* Top Header */}
      <div>
        <Header
          favoritesCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCustomTopic={() => setIsCustomTopicOpen(true)}
          hasApiKey={!!geminiConfig?.apiKey}
        />

        {/* Category Filter Tabs */}
        <div className="pt-3">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Intimacy Level Filter */}
        <div className="pt-1">
          <LevelFilter
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
          />
        </div>
      </div>

      {/* Main Card View */}
      <main className="flex-1 flex flex-col items-center justify-center py-2">
        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-slate-400 max-w-sm space-y-3">
            <MessageCircleHeart className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              条件に一致する話題がありません
            </p>
            <p className="text-xs text-slate-500">
              カテゴリまたは親密度レベルのフィルター条件を変更してください。
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium"
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
              onOpenAiExpand={() => setIsAiExpandOpen(true)}
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
      <footer className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-4 border-t border-slate-900 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] sm:text-xs text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>{todayTip}</span>
        </div>
        <p className="text-[11px] text-slate-600">
          TalkDeck &bull; 雑談ネタ＆深掘り質問アシスタント &bull; GitHub Pages Ready
        </p>
      </footer>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={geminiConfig}
        onSaveConfig={handleSaveConfig}
        onRemoveConfig={handleRemoveConfig}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectTopic={(t) => {
          setCurrentTopic(t);
          setIsFlipped(false);
        }}
        onRemoveFavorite={(id) => {
          saveFavorites(favorites.filter((f) => f.id !== id));
        }}
        onClearAll={() => {
          saveFavorites([]);
        }}
      />

      <CustomTopicModal
        isOpen={isCustomTopicOpen}
        onClose={() => setIsCustomTopicOpen(false)}
        config={geminiConfig}
        onTopicGenerated={handleCustomTopicGenerated}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <AiExpandModal
        isOpen={isAiExpandOpen}
        onClose={() => setIsAiExpandOpen(false)}
        topic={currentTopic}
        config={geminiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onAppendQuestions={handleAppendQuestions}
      />
    </div>
  );
};

export default App;
