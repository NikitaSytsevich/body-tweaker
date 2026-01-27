import type { Article } from '../types';

const modules = import.meta.glob('./*.tsx', {
  eager: true,
});

/**
 * Порядок статей: подготовка → голодание → питание → сыроедение → особые случаи → выход
 */
const ORDER: Record<string, number> = {
  // Подготовка
  'how-to-prepare': 1,

  // Фундамент голодания
  'shelton-fasting-art': 10,
  'bragg-miracle-fasting': 11,

  // Наука о питании
  'china-study': 20,
  'greger-how-not-to-die': 21,
  'furman-eat-to-live': 22,

  // Питание и этика
  'meat-for-weaklings': 30,

  // Сыроедение
  'raw-food-monodiet': 40,

  // Особые случаи (безопасность)
  'smoking-and-fasting': 45,
  'diabetes-fasting': 46,

  // Выход
  'how-to-exit': 50,
};

export const articles: Article[] = Object.values(modules)
  .map((mod) => {
    const module = mod as Record<string, unknown>;
    if (module.default) return module.default as Article;
    return Object.values(module)[0] as Article;
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
