export interface BreathLevel {
  id: number;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
}

export const BREATH_LEVELS: BreathLevel[] = [
  { id: 0, name: "Уровень 0 (Начальный)", inhale: 4, hold: 16, exhale: 8 },
  { id: 1, name: "Уровень 1", inhale: 5, hold: 20, exhale: 10 },
  { id: 2, name: "Уровень 2", inhale: 6, hold: 24, exhale: 12 },
  { id: 3, name: "Уровень 3", inhale: 7, hold: 28, exhale: 14 },
  { id: 4, name: "Уровень 4", inhale: 8, hold: 32, exhale: 16 },
  { id: 5, name: "Уровень 5", inhale: 9, hold: 36, exhale: 18 },
  { id: 6, name: "Уровень 6", inhale: 10, hold: 40, exhale: 20 },
  { id: 7, name: "Уровень 7", inhale: 12, hold: 48, exhale: 24 },
  { id: 8, name: "Уровень 8", inhale: 13, hold: 52, exhale: 26 },
  { id: 9, name: "Уровень 9", inhale: 15, hold: 60, exhale: 30 },
  { id: 10, name: "Уровень 10 (Мастер)", inhale: 20, hold: 80, exhale: 40 },
  { id: 11, name: "Уровень 11 (Гуру)", inhale: 24, hold: 96, exhale: 48 },
  { id: 12, name: "Уровень 12 (Абсолют)", inhale: 36, hold: 144, exhale: 72 },
];
