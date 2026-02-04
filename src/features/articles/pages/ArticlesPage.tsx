import { articlesMeta } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="min-h-full animate-in fade-in duration-500">
      <div className="px-1 pt-6 pb-6">
        <div className="inline-flex items-center gap-2 tg-chip">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--tg-accent)]" />
          База знаний
        </div>
        <h1 className="mt-5 text-[34px] font-semibold leading-[1.05] tracking-tight app-header">
          Статьи
        </h1>
        <div className="mt-3 h-[3px] w-16 rounded-full bg-[color:var(--tg-accent)]" />
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed app-muted">
          Полезные материалы о голодании, питании и здоровье. Читайте в удобном формате, сохраняйте идеи и
          возвращайтесь к важному.
        </p>
      </div>

      <div className="space-y-4 pb-28">
        {articlesMeta.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
