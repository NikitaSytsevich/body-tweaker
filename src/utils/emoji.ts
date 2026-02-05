const EMOJI_SETS: Record<string, string[]> = {
  fasting: ['fire', 'trophy', 'sparkles', 'rocket'],
  breathing: ['wind', 'sparkles', 'check'],
  generic: ['sparkles', 'check', 'book', 'rocket', 'fire', 'trophy', 'wind'],
};

type EmojiContext = 'fasting' | 'breathing' | 'generic';

const lastByContext: Record<EmojiContext, string | undefined> = {
  fasting: undefined,
  breathing: undefined,
  generic: undefined,
};

export const getRandomTelegramEmoji = (context: EmojiContext = 'generic') => {
  const pool = EMOJI_SETS[context] ?? EMOJI_SETS.generic;
  if (pool.length === 0) return 'sparkles';

  const last = lastByContext[context];
  let pick = pool[Math.floor(Math.random() * pool.length)];

  if (pool.length > 1 && pick === last) {
    const index = pool.indexOf(pick);
    pick = pool[(index + 1) % pool.length];
  }

  lastByContext[context] = pick;
  return pick;
};
