import { Flame, Droplets, Zap, Shield, Sparkles, Brain, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface FastingScheme {
  id: string;
  title: string;
  hours: number;
  description: string;
  color: string;
  icon: LucideIcon;
}

export const FASTING_SCHEMES: FastingScheme[] = [
  {
    id: '24h',
    title: '24ч: База аутофагии',
    hours: 24,
    description: 'Суточная пауза. Полное истощение гликогена и запуск очищения клеток.',
    color: 'text-blue-500',
    icon: Droplets
  },
  {
    id: '36h',
    title: '36ч: Метаболический сброс',
    hours: 36,
    description: 'Глубокий кетоз. Активация сжигания жира (+300%).',
    color: 'text-emerald-500',
    icon: Flame
  },
  {
    id: '48h',
    title: '48ч: Иммунная перезагрузка',
    hours: 48,
    description: 'Пик гормона роста. Начало распада старых иммунных клеток.',
    color: 'text-violet-500',
    icon: Shield
  },
  {
    id: '72h',
    title: '72ч: Регенерация (3 суток)',
    hours: 72,
    description: 'Полное обновление иммунитета. Активация стволовых клеток.',
    color: 'text-rose-500',
    icon: Zap
  },
  {
    id: '96h',
    title: '96ч: Нейрогенез (4 суток)',
    hours: 96,
    description: 'Максимальная выработка BDNF. Восстановление нейронных связей мозга.',
    color: 'text-indigo-500',
    icon: Brain
  },
  {
    id: '120h',
    title: '120ч: Омоложение (5 суток)',
    hours: 120,
    description: 'Снижение воспаления. Глубокое удаление старых клеток (сенолитиков).',
    color: 'text-fuchsia-500',
    icon: Sparkles
  },
  {
    id: '168h',
    title: '168ч: Полное обновление (7 дней)',
    hours: 168,
    description: 'Экстремальный протокол. Системная перезагрузка всего организма.',
    color: 'text-amber-500',
    icon: Star
  }
];
