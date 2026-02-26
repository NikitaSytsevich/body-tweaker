import type { Article, ArticleMeta } from '../types';
import { ARTICLE_META } from './metadata';

type ArticleModule = Record<string, unknown>;

const ARTICLE_IMPORTERS: Record<string, () => Promise<ArticleModule>> = {
  'how-to-prepare': () => import('./how-to-prepare'),
  'fasting-day-regimen': () => import('./fasting-day-regimen'),
  'six-stages-rdt': () => import('./six-stages-rdt'),
  'acidotic-crisis': () => import('./acidotic-crisis'),
  'inpatient-vs-home': () => import('./inpatient-vs-home'),
  'exit-mistakes': () => import('./exit-mistakes'),
  'shelton-fasting-art': () => import('./shelton-fasting-art'),
  'bragg-miracle-fasting': () => import('./bragg-miracle-fasting'),
  'preventive-short-fasts': () => import('./preventive-short-fasts'),
  'movement-during-fasting': () => import('./movement-during-fasting'),
  'skin-detox-hygiene': () => import('./skin-detox-hygiene'),
  'fractional-method': () => import('./fractional-method'),
  'china-study': () => import('./china-study'),
  'greger-how-not-to-die': () => import('./greger-how-not-to-die'),
  'furman-eat-to-live': () => import('./furman-eat-to-live'),
  'meat-for-weaklings': () => import('./meat-for-weaklings'),
  'raw-food-monodiet': () => import('./raw-food-monodiet'),
  'smoking-and-fasting': () => import('./smoking-and-fasting'),
  'diabetes-fasting': () => import('./diabetes-fasting'),
  'how-to-exit': () => import('./how-to-exit'),
};

const resolveArticleModule = (module: ArticleModule): Article | undefined => {
  if (module.default) return module.default as Article;
  for (const value of Object.values(module)) {
    if (value && typeof value === 'object' && 'content' in (value as Article)) {
      return value as Article;
    }
  }
  return undefined;
};

export const articlesMeta: ArticleMeta[] = ARTICLE_META;

export const getArticleMetaById = (id: string): ArticleMeta | undefined => {
  return articlesMeta.find(article => article.id === id);
};

export const loadArticleById = async (id: string): Promise<Article | undefined> => {
  const importer = ARTICLE_IMPORTERS[id];
  if (!importer) return undefined;
  const module = await importer();
  return resolveArticleModule(module);
};
