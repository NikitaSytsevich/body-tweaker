import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DEFAULT_SET = process.env.TELEGRAM_STICKER_SET || 'animatedemojies';
const DEFAULT_SAFE_EMOJI = '✨,🔥,🚀,🏆,🌬️,✅,📘';
const SAFE_EMOJI = (process.env.TELEGRAM_SAFE_EMOJI || DEFAULT_SAFE_EMOJI)
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean);

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

let cached: { key: string; expires: number; data: unknown } | null = null;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!BOT_TOKEN) {
    return response.status(500).json({ ok: false, error: 'BOT token missing' });
  }

  const setName = typeof request.query.set === 'string' ? request.query.set : DEFAULT_SET;
  const emojiQuery = typeof request.query.emoji === 'string' ? request.query.emoji : '';
  const emojiFilter = emojiQuery
    ? emojiQuery.split(',').map((e) => decodeURIComponent(e).trim()).filter(Boolean)
    : SAFE_EMOJI;

  const cacheKey = `${setName}|${emojiFilter.join(',')}`;
  const now = Date.now();
  if (cached && cached.key === cacheKey && cached.expires > now) {
    response.setHeader('Cache-Control', 'public, max-age=300');
    return response.status(200).json(cached.data);
  }

  try {
    const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getStickerSet?name=${encodeURIComponent(setName)}`;
    const apiResponse = await fetch(apiUrl);
    const payload = await apiResponse.json();

    if (!payload?.ok) {
      return response.status(500).json({ ok: false, error: payload?.description || 'Telegram API error' });
    }

    const stickers = (payload.result?.stickers || [])
      .filter((sticker: any) => sticker?.is_animated)
      .filter((sticker: any) => {
        if (!emojiFilter.length) return true;
        return sticker?.emoji && emojiFilter.includes(sticker.emoji);
      })
      .map((sticker: any) => ({
        file_id: sticker.file_id,
        emoji: sticker.emoji,
      }));

    const data = {
      ok: true,
      set: setName,
      count: stickers.length,
      stickers,
    };

    cached = { key: cacheKey, expires: now + CACHE_TTL_MS, data };
    response.setHeader('Cache-Control', 'public, max-age=300');
    return response.status(200).json(data);
  } catch (error) {
    console.error('[Telegram Stickers] Error:', error);
    return response.status(500).json({ ok: false, error: 'Unexpected error' });
  }
}
