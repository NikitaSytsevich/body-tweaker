import { useEffect, useMemo, useState } from 'react';
import { AnimatedEmoji } from './AnimatedEmoji';
import {
  type EmojiContext,
  allowAllForContext,
  getRandomLocalStickerName,
  getSafeEmojiQuery,
  getStickerConfig,
} from '../../utils/emoji';

interface TelegramStickerProps {
  context?: EmojiContext;
  size?: number;
  className?: string;
  fallback?: string;
  loop?: boolean;
  autoplay?: boolean;
  set?: string;
  emoji?: string;
  allowAll?: boolean;
}

type StickerItem = { file_id: string; emoji?: string };

const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

const readCache = (cacheKey: string): StickerItem[] | null => {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; stickers: StickerItem[] };
    if (!parsed?.timestamp || !parsed.stickers) return null;
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed.stickers;
  } catch {
    return null;
  }
};

const writeCache = (cacheKey: string, stickers: StickerItem[]) => {
  try {
    sessionStorage.setItem(
      cacheKey,
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
  set,
  emoji,
  allowAll,
}: TelegramStickerProps) => {
  const [stickerSrc, setStickerSrc] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const fallbackName = useMemo(() => getRandomLocalStickerName(context), [context]);
  const resolvedSet = useMemo(() => set || getStickerConfig(context).set, [context, set]);
  const resolvedEmoji = useMemo(() => emoji ?? getSafeEmojiQuery(context), [context, emoji]);
  const resolvedAllowAll = useMemo(() => (
    allowAll ?? allowAllForContext(context)
  ), [allowAll, context]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const cacheKey = `bt_tg_stickers_${context}_${resolvedSet}_${resolvedEmoji}_${resolvedAllowAll ? 'all' : 'filter'}`;
        const cached = readCache(cacheKey);
        let stickers = cached ?? [];

        if (!stickers.length) {
          const params = new URLSearchParams();
          params.set('set', resolvedSet);
          if (resolvedAllowAll) {
            params.set('all', '1');
          } else if (resolvedEmoji) {
            params.set('emoji', resolvedEmoji);
          }
          const res = await fetch(`/api/stickers?${params.toString()}`);
          if (!res.ok) throw new Error('Sticker list failed');
          const json = await res.json();
          stickers = Array.isArray(json.stickers) ? json.stickers : [];
          if (stickers.length) writeCache(cacheKey, stickers);
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
  }, [context, resolvedAllowAll, resolvedEmoji, resolvedSet]);

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
