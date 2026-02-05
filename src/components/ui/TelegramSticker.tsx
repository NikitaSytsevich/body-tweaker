import { useEffect, useMemo, useState } from 'react';
import { AnimatedEmoji } from './AnimatedEmoji';
import {
  type EmojiContext,
  getRandomLocalStickerName,
  getSafeEmojiQuery,
} from '../../utils/emoji';

interface TelegramStickerProps {
  context?: EmojiContext;
  size?: number;
  className?: string;
  fallback?: string;
  loop?: boolean;
  autoplay?: boolean;
}

type StickerItem = { file_id: string; emoji?: string };

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const getCacheKey = (context: EmojiContext) => `bt_tg_stickers_${context}`;

const readCache = (context: EmojiContext): StickerItem[] | null => {
  try {
    const raw = sessionStorage.getItem(getCacheKey(context));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; stickers: StickerItem[] };
    if (!parsed?.timestamp || !parsed.stickers) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.stickers;
  } catch {
    return null;
  }
};

const writeCache = (context: EmojiContext, stickers: StickerItem[]) => {
  try {
    sessionStorage.setItem(
      getCacheKey(context),
      JSON.stringify({ timestamp: Date.now(), stickers })
    );
  } catch {
    // ignore
  }
};

export const TelegramSticker = ({
  context = 'generic',
  size = 160,
  className,
  fallback = '✨',
  loop = true,
  autoplay = true,
}: TelegramStickerProps) => {
  const [stickerSrc, setStickerSrc] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const fallbackName = useMemo(() => getRandomLocalStickerName(context), [context]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const cached = readCache(context);
        let stickers = cached ?? [];

        if (!stickers.length) {
          const emojiQuery = getSafeEmojiQuery(context);
          const res = await fetch(`/api/stickers?emoji=${encodeURIComponent(emojiQuery)}`);
          if (!res.ok) throw new Error('Sticker list failed');
          const json = await res.json();
          stickers = Array.isArray(json.stickers) ? json.stickers : [];
          if (stickers.length) writeCache(context, stickers);
        }

        if (!stickers.length) throw new Error('No stickers');
        const pick = stickers[Math.floor(Math.random() * stickers.length)];
        const url = `/api/sticker-file?file_id=${encodeURIComponent(pick.file_id)}`;
        if (!cancelled) setStickerSrc(url);
      } catch {
        if (!cancelled) setUseLocalFallback(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [context]);

  if (useLocalFallback) {
    return (
      <AnimatedEmoji
        name={fallbackName}
        size={size}
        className={className}
        fallback={fallback}
        loop={loop}
        autoplay={autoplay}
      />
    );
  }

  return (
    <AnimatedEmoji
      src={stickerSrc ?? undefined}
      size={size}
      className={className}
      fallback={fallback}
      loop={loop}
      autoplay={autoplay}
    />
  );
};
