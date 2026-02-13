import { articlesMeta } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="min-h-full animate-in fade-in duration-500 pb-28">
      <div className="px-1 pt-6 pb-5">
        <div className="rounded-[30px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/90 backdrop-blur-xl px-5 py-5 shadow-[var(--app-shadow-soft)]">
          <div className="inline-flex items-center gap-2 tg-chip">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--tg-accent)]" />
            База знаний
          </div>
          <h1 className="mt-4 text-[34px] font-semibold leading-[1.04] tracking-tight app-header">
            Статьи
          </h1>
          <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed app-muted">
            Понятные материалы о голодании, питании и восстановлении. Спокойный формат чтения без лишнего шума.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {articlesMeta.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
