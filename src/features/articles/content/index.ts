import { howToPrepare } from './how-to-prepare';
import { fluidBiohacking } from './fluid-biohacking';
import { howToExit } from './how-to-exit';
// Новые
import { bombardPsychology } from './bombard-psychology';
import { chinaStudy } from './china-study';
import { mucuslessDiet } from './mucusless-diet';
import { waterTruth } from './water-truth';

export const articles = [
  // 1. Основы (Практика)
  howToPrepare,
  fluidBiohacking,
  howToExit,
  
  // 2. Психология и Мотивация
  bombardPsychology,
  
  // 3. Питание и Философия
  chinaStudy,
  mucuslessDiet,
  
  // 4. Альтернативный взгляд
  waterTruth,
];

export const getArticleById = (id: string) => articles.find(article => article.id === id);
