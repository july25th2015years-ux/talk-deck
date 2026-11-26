import type { Category, GeminiConfig, Topic } from '../types';

const STORAGE_KEY = 'talkdeck_gemini_config';

export function getStoredGeminiConfig(): GeminiConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredGeminiConfig(config: GeminiConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Gemini config:', e);
  }
}

export function removeStoredGeminiConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove Gemini config:', e);
  }
}

interface GenerateTopicParams {
  scene: string;
  categoryId: Exclude<Category, 'all'>;
  categoryLabel: string;
  mood: string;
  notes?: string;
}

export async function generateCustomTopicWithGemini(
  params: GenerateTopicParams,
  config: GeminiConfig
): Promise<Topic> {
  if (!config.apiKey) {
    throw new Error('Gemini APIキーが設定されていません。設定画面からキーを入力してください。');
  }

  const model = config.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const prompt = `
あなたは付き合って2ヶ月程度の恋人同士が、より親密になりお互いの価値観を深く知るためのトークカード作成プロデューサーです。
2人は一緒にスマホ画面を見ながらカードを引き、交代で答え合います。リベシティ会員同士なので、お金や価値観マップ、5つの力などの話題もオープンに話せます。

以下の条件に合わせて、少し踏み込んでいて温かく盛り上がる「トークカード」を1つ作成してください。
口調は恋人同士の自然なタメ口で統一してください。

【条件】
- シチュエーション: ${params.scene}
- テーマ: ${params.categoryLabel}
- 雰囲気・ねらい: ${params.mood}
${params.notes ? `- キーワード: ${params.notes}` : ''}

以下のJSONフォーマットのみを返してください。余計なマークダウン装飾や前置きは不要です。
{
  "title": "メインの質問文（恋人同士の自然なタメ口・お互いが交代で答えられる表現）",
  "depthQuestions": [
    "話をさらに広げる深掘り質問1（自然なタメ口）",
    "話をさらに広げる深掘り質問2（自然なタメ口）",
    "話をさらに広げる深掘り質問3（自然なタメ口）"
  ],
  "expansionTips": "2人で楽しく会話を広げるコツ（親しみやすい口調）",
  "cautionTips": "お互いが安心して話すために大切にしたいポイント（優しい口調）"
}
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `APIリクエストに失敗しました (Status: ${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('AIから応答を受信できませんでした。もう一度お試しください。');
  }

  try {
    const cleanedText = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const parsed = JSON.parse(cleanedText);

    return {
      id: `ai-${Date.now()}`,
      category: params.categoryId,
      level: 2,
      title: parsed.title || '最近ふたりで過ごした中で、一番ホッとした瞬間っていつだった？',
      depthQuestions: Array.isArray(parsed.depthQuestions)
        ? parsed.depthQuestions
        : ['そのときどんな気持ちだった？'],
      expansionTips: parsed.expansionTips || 'まずは自分から少し照れながら話してみると、相手も本音を出しやすくなるよ。',
      cautionTips: parsed.cautionTips || '違いが見えてもジャッジせず、お互いの気持ちを受け止め合おう。',
      isCustom: true,
    };
  } catch (err) {
    console.error('Failed to parse AI response:', text, err);
    throw new Error('AIの応答データの解析に失敗しました。');
  }
}

export async function expandTopicWithGemini(
  topic: Topic,
  userNote: string,
  config: GeminiConfig
): Promise<{ newDepthQuestions: string[]; tailoredAdvice: string }> {
  if (!config.apiKey) {
    throw new Error('Gemini APIキーが設定されていません。');
  }

  const model = config.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const prompt = `
付き合って2ヶ月程度の恋人同士が、2人でスマホ画面を見ながら以下の質問について話しています。
現在の流れに合わせて、さらに親密になれる「追加の深掘り質問（3つ）」と「会話のアドバイス」を提案してください。
口調は恋人同士の自然なタメ口にしてください。

【現在の質問】
${topic.title}

【ここまでの流れ・相手の反応】
${userNote || 'お互いに答えたところで、ここからもう少し踏み込んで本音や価値観を語り合いたいです。'}

以下のJSONフォーマットのみを返してください。
{
  "newDepthQuestions": [
    "さらに踏み込む質問1（タメ口）",
    "さらに踏み込む質問2（タメ口）",
    "さらに踏み込む質問3（タメ口）"
  ],
  "tailoredAdvice": "2人の距離がもっと縮まるための温かいアドバイス"
}
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        response_mime_type: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `APIエラー (Status: ${response.status})`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('応答が空でした。');
  }

  const cleanedText = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  const parsed = JSON.parse(cleanedText);
  return {
    newDepthQuestions: parsed.newDepthQuestions || [],
    tailoredAdvice: parsed.tailoredAdvice || '',
  };
}
