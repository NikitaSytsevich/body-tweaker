import { articles } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="article-theme font-article -mx-4 -mt-2 min-h-full animate-in fade-in duration-500">
      <div className="px-6 pt-10 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--article-border)] bg-[color:var(--article-surface)] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[color:var(--article-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--article-accent)]" />
          База знаний
        </div>
        <h1 className="mt-5 text-[38px] font-semibold leading-[1.05] tracking-tight text-[color:var(--article-text)]">
          Статьи
        </h1>
        <div className="mt-3 h-[3px] w-16 rounded-full bg-[color:var(--article-accent)]" />
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-[color:var(--article-muted)]">
          Полезные материалы о голодании, питании и здоровье. Читайте в удобном формате, сохраняйте идеи и
          возвращайтесь к важному.
        </p>
      </div>

      <div className="space-y-4 px-4 pb-28">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
