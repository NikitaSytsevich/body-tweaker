/**
 * Общие типы для приложения
 */

import type { ComponentType, SVGProps } from 'react';

/**
 * Тип для иконок компонентов из lucide-react
 * Иконки lucide-react - это React компоненты, принимающие SVG пропсы
 */
export type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Тип для настроек уведомлений
 */
export interface NotificationSettings {
  fasting: boolean;
}

/**
 * Тип для записи истории
 */
export interface HistoryRecord {
  id: string;
  type: 'fasting' | 'breathing';
  scheme: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
}

/**
 * Тип для анимации иконок
 */
export interface IconAnimation {
  scaleX?: number | number[];
  rotate?: number | number[];
  x?: number | number[];
  y?: number | number[];
  scale?: number | number[];
  transition?: {
    duration?: number;
    ease?: string;
    times?: number[];
  };
}

/**
 * Тип для опций сегментированного контрола
 */
export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: string;
  icon: IconType;
}
