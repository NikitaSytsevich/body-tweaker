import { howToPrepare } from './how-to-prepare';
import { howToExit } from './how-to-exit';
import { fluidBiohacking } from './fluid-biohacking'; // 👈

export const articles = [
  howToPrepare,
  fluidBiohacking, // 👈 Лучше поставить посередине (логически: до, во время, после)
  howToExit,
];

export const getArticleById = (id: string) => articles.find(article => article.id === id);
