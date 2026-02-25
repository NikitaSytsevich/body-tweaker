export type StickerId =
  | 'sparkles'
  | 'fire'
  | 'rocket'
  | 'trophy'
  | 'check'
  | 'wind'
  | 'book'
  | 'drop'
  | 'bolt'
  | 'sun';

export interface StickerDefinition {
  id: StickerId;
  source: string;
  fallbackEmoji: string;
  label: string;
}

export const STICKER_CATALOG: Record<StickerId, StickerDefinition> = {
  sparkles: {
    id: 'sparkles',
    source: '/stickers/sparkles.json',
    fallbackEmoji: '✨',
    label: 'Искры'
  },
  fire: {
    id: 'fire',
    source: '/stickers/fire.json',
    fallbackEmoji: '🔥',
    label: 'Огонь'
  },
  rocket: {
    id: 'rocket',
    source: '/stickers/rocket.json',
    fallbackEmoji: '🚀',
    label: 'Ракета'
  },
  trophy: {
    id: 'trophy',
    source: '/stickers/trophy.json',
    fallbackEmoji: '🏆',
    label: 'Кубок'
  },
  check: {
    id: 'check',
    source: '/stickers/check.json',
    fallbackEmoji: '✅',
    label: 'Галочка'
  },
  wind: {
    id: 'wind',
    source: '/stickers/wind.json',
    fallbackEmoji: '🌬️',
    label: 'Ветер'
  },
  book: {
    id: 'book',
    source: '/stickers/book.json',
    fallbackEmoji: '💡',
    label: 'Идея'
  },
  drop: {
    id: 'drop',
    source: '/stickers/drop.json',
    fallbackEmoji: '💧',
    label: 'Сдвиг'
  },
  bolt: {
    id: 'bolt',
    source: '/stickers/bolt.json',
    fallbackEmoji: '⚡',
    label: 'Переключение'
  },
  sun: {
    id: 'sun',
    source: '/stickers/sun.json',
    fallbackEmoji: '🌞',
    label: 'Устойчивость'
  }
};

export const getStickerDefinition = (id: string): StickerDefinition | null =>
  Object.prototype.hasOwnProperty.call(STICKER_CATALOG, id)
    ? STICKER_CATALOG[id as StickerId]
    : null;
