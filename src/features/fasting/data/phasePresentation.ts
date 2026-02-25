import type { StickerId } from '../../stickers/stickerCatalog';

export const PHASE_STICKER_BY_ID: Record<number, StickerId> = {
  1: 'book',
  2: 'drop',
  3: 'fire',
  4: 'bolt',
  5: 'rocket',
  6: 'wind',
  7: 'trophy',
  8: 'sun',
  9: 'check'
};

export const PHASE_CUE_BY_ID: Record<number, string> = {
  1: 'Энергия поступает из последней пищи',
  2: 'Инсулиновый профиль мягко снижается',
  3: 'Печень активнее расходует гликоген',
  4: 'Организм переключает топливный режим',
  5: 'Кетоновые пути становятся заметнее',
  6: 'Кетоз стабилизируется в фоне',
  7: 'Метаболизм работает устойчиво',
  8: 'Продленный режим требует аккуратности',
  9: 'Критична дисциплина и контроль выхода'
};

export const getPhaseSticker = (phaseId: number): StickerId =>
  PHASE_STICKER_BY_ID[phaseId] ?? 'sparkles';

export const getPhaseCue = (phaseId: number): string =>
  PHASE_CUE_BY_ID[phaseId] ?? 'Организм проходит очередной этап метаболического перехода.';
