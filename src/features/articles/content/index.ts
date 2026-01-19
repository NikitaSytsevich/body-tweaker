// src/features/articles/content/index.ts

import { howToPrepare } from './how-to-prepare';
import { fluidBiohacking } from './fluid-biohacking';
import { howToExit } from './how-to-exit';
import { livingFood } from './living-food';

export const articles = [
  // 1. С чего начать (Вход)
  howToPrepare,
  
  // 2. Как не сорваться (Процесс)
  fluidBiohacking,
  
  // 3. Самое важное (Выход)
  howToExit,
  
  // 4. Глобальная цель (Философия и Питание)
  livingFood,
];

// Хелпер для поиска статьи по ID (используется в роутинге)
export const getArticleById = (id: string) => articles.find(article => article.id === id);
