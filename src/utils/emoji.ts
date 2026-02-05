export type EmojiContext = 'fasting' | 'breathing' | 'generic' | 'welcome';

type StickerConfig = {
  set: string;
  emoji?: string[];
  allowAll?: boolean;
  localFallback: string[];
};

const STICKER_CONFIG_BY_CONTEXT: Record<EmojiContext, StickerConfig> = {
  fasting: {
    set: 'fullduck',
    allowAll: true,
    localFallback: ['fire', 'trophy', 'sparkles', 'rocket'],
  },
  breathing: {
    set: 'fullduck',
    allowAll: true,
    localFallback: ['wind', 'sparkles', 'check'],
  },
  welcome: {
    set: 'animatedemojies',
    emoji: ['👋', '✨', '😊', '🎉'],
    localFallback: ['sparkles', 'rocket', 'trophy'],
  },
  generic: {
    set: 'animatedemojies',
    emoji: ['✨', '✅', '📘', '🚀', '🔥', '🏆', '🌬️', '👋'],
    localFallback: ['sparkles', 'check', 'book', 'rocket', 'fire', 'trophy', 'wind'],
  },
};

const lastByContext: Record<EmojiContext, string | undefined> = {
  fasting: undefined,
  breathing: undefined,
  welcome: undefined,
  generic: undefined,
};

const pickRandom = (context: EmojiContext, list: string[]) => {
  if (!list.length) return 'sparkles';
  const last = lastByContext[context];
  let pick = list[Math.floor(Math.random() * list.length)];
  if (list.length > 1 && pick === last) {
    const index = list.indexOf(pick);
    pick = list[(index + 1) % list.length];
  }
  lastByContext[context] = pick;
  return pick;
};

export const getStickerConfig = (context: EmojiContext = 'generic') =>
  STICKER_CONFIG_BY_CONTEXT[context] ?? STICKER_CONFIG_BY_CONTEXT.generic;

export const getRandomLocalStickerName = (context: EmojiContext = 'generic') => {
  const list = getStickerConfig(context).localFallback;
  return pickRandom(context, list);
};

export const getSafeEmojiQuery = (context: EmojiContext = 'generic') => {
  const list = getStickerConfig(context).emoji ?? [];
  return list.join(',');
};

export const allowAllForContext = (context: EmojiContext = 'generic') =>
  Boolean(getStickerConfig(context).allowAll);
