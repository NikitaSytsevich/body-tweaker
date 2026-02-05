export type EmojiContext = 'fasting' | 'breathing' | 'generic';

const LOCAL_TGS_BY_CONTEXT: Record<EmojiContext, string[]> = {
  fasting: ['fire', 'trophy', 'sparkles', 'rocket'],
  breathing: ['wind', 'sparkles', 'check'],
  generic: ['sparkles', 'check', 'book', 'rocket', 'fire', 'trophy', 'wind'],
};

const SAFE_EMOJI_BY_CONTEXT: Record<EmojiContext, string[]> = {
  fasting: ['🔥', '🏆', '✨', '🚀'],
  breathing: ['🌬️', '✨', '✅'],
  generic: ['✨', '✅', '📘', '🚀', '🔥', '🏆', '🌬️'],
};

const lastByContext: Record<EmojiContext, string | undefined> = {
  fasting: undefined,
  breathing: undefined,
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

export const getRandomLocalStickerName = (context: EmojiContext = 'generic') => {
  const list = LOCAL_TGS_BY_CONTEXT[context] ?? LOCAL_TGS_BY_CONTEXT.generic;
  return pickRandom(context, list);
};

export const getSafeEmojiQuery = (context: EmojiContext = 'generic') => {
  const list = SAFE_EMOJI_BY_CONTEXT[context] ?? SAFE_EMOJI_BY_CONTEXT.generic;
  return list.join(',');
};
