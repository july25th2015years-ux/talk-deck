import type { GeminiConfig, Topic } from '../types';

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
  category: string;
  relationship: string;
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

  const model = config.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const prompt = `
あなたは優秀なコミュニケーション・雑談のプロフェッショナルです。
以下のシチュエーションに合わせて、気まずい沈黙をなくし、自然に盛り上がって相手との心理的距離が縮まる「雑談の話題」を1つ考案してください。

【シチュエーション条件】
- カテゴリ/場面: ${params.category}
- 相手との関係性: ${params.relationship}
- 場の雰囲気・目的: ${params.mood}
${params.notes ? `- 特記事項/キーワード: ${params.notes}` : ''}

以下のJSONフォーマットのみを返してください。余計なマークダウン装飾や前置きは不要です。
{
  "title": "メインの質問・話題の投げかけ文（相手が答えやすく自然な敬体または親しい口調）",
  "depthQuestions": [
    "話を広げるための深掘り質問1",
    "話を広げるための深掘り質問2",
    "話を広げるための深掘り質問3"
  ],
  "expansionTips": "会話をスムーズに弾ませるためのコツや、自分から話すべき具体例の出し方",
  "cautionTips": "気をつけるべきNGな聞き方や地雷ポイント"
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
        temperature: 0.7,
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
    // クリーニングしてJSONパース
    const cleanedText = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    const parsed = JSON.parse(cleanedText);

    return {
      id: `ai-${Date.now()}`,
      category: 'deep-questions',
      level: 2,
      title: parsed.title || '最近どんなことで心が動きましたか？',
      depthQuestions: Array.isArray(parsed.depthQuestions) ? parsed.depthQuestions : ['それについてもっと教えてください'],
      expansionTips: parsed.expansionTips || '相手の言葉を繰り返しながら共感を示しましょう。',
      cautionTips: parsed.cautionTips || 'プライベートに踏み込みすぎないよう注意しましょう。',
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

  const model = config.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const prompt = `
以下の話題について、現在の相手の反応やシチュエーションに合わせて、さらに会話を盛り上げるための「追加の切り返し質問（3つ）」と「アドバイス」を提案してください。

【現在の話題】
${topic.title}

【現在の状況・相手の反応】
${userNote || '相手は少し興味を持って答えてくれましたが、ここからもっと話を広げたいです。'}

以下のJSONフォーマットのみを返してください。
{
  "newDepthQuestions": [
    "相手の反応を受けた次の切り返し質問1",
    "相手の反応を受けた次の切り返し質問2",
    "相手の反応を受けた次の切り返し質問3"
  ],
  "tailoredAdvice": "この状況で会話をスムーズに展開するためのアドバイス"
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
        temperature: 0.7,
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
