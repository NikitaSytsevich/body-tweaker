import type { Article } from '../types';

const modules = import.meta.glob('./*.tsx', {
  eager: true,
});

/**
 * Ручная логическая карта порядка
 * (UI не трогаем, статьи не переписываем)
 */
const ORDER: Record<string, number> = {
  'how-to-prepare': 1,
  'fluid-biohacking': 2,
  'water-truth': 3,

  'mucusless-diet': 10,
  'living-food': 11,
  'china-study': 12,
  'bombard-psychology': 13,

  'how-to-exit': 20,
};

export const articles: Article[] = Object.values(modules)
  .map((mod: any) => {
    if (mod.default) return mod.default;
    return Object.values(mod)[0];
  })
  .filter((article): article is Article => Boolean(article && article.id))
  .sort((a, b) => {
    const orderA = ORDER[a.id] ?? 999;
    const orderB = ORDER[b.id] ?? 999;
    return orderA - orderB;
  });

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};
