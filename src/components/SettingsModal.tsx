import React, { useState, useEffect } from 'react';
import type { GeminiConfig } from '../types';
import { 
  X, 
  Key, 
  Check, 
  ExternalLink, 
  Trash2, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Cpu
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GeminiConfig | null;
  onSaveConfig: (cfg: GeminiConfig) => void;
  onRemoveConfig: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onRemoveConfig,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      setApiKey(config.apiKey);
      setModel(config.model || 'gemini-1.5-flash');
    } else {
      setApiKey('');
      setModel('gemini-1.5-flash');
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      apiKey: apiKey.trim(),
      model,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleRemove = () => {
    if (window.confirm('保存されているGemini APIキーを削除しますか？')) {
      onRemoveConfig();
      setApiKey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-200 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Google Gemini API 設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:outline-none text-sm text-white placeholder-slate-600 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <span>Google AI Studioから無料で取得できます。</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
              >
                キー取得ページ
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              使用モデル
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:outline-none text-sm text-white"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash（高速・推奨）</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro（高精度）</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              セキュリティと利用について
            </div>
            <p>
              APIキーはお使いのブラウザのLocalStorageにのみ保存されます。サーバーを介さずブラウザから直接Gemini
              APIに接続します。
            </p>
            <p className="text-slate-500">
              ※APIキーを設定しなくても、全5カテゴリのプリセット話題集はすべて無料でご利用いただけます。
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2">
            {config?.apiKey ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium border border-rose-800/40 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                削除
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/30"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    保存完了
                  </>
                ) : (
                  '設定を保存'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
