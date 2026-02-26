import { AnimatedSticker } from '../../../components/ui/AnimatedSticker';
import { articlesMeta } from '../content';
import { ArticleCard } from '../components/ArticleCard';

const COLLECTION_CHIPS = ['📚 База знаний', '🧠 Практика', '🌿 Безопасность'];

export const ArticlesPage = () => {
  return (
    <div className="min-h-full pb-28">
      <section className="relative overflow-hidden rounded-[38px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] p-5 shadow-[var(--app-shadow-card)]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl animate-article-glow" />
        <div className="pointer-events-none absolute -right-12 -bottom-20 h-56 w-56 rounded-full bg-emerald-400/18 blur-3xl animate-article-glow" style={{ animationDelay: '-1.8s' }} />

        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] app-muted">Body Tweaker Library</p>
          <h2 className="mt-3 max-w-[28rem] text-[34px] leading-[1.06] tracking-tight app-header font-[Georgia,Cambria,'Times_New_Roman',serif]">
            Статьи, к которым хочется возвращаться
          </h2>
          <p className="mt-3 max-w-[32rem] text-[15px] leading-[1.65] app-muted">
            🎯 Выбрали лучшие материалы в одном месте: от подготовки и практики до безопасного выхода.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {COLLECTION_CHIPS.map((chip) => (
              <span key={chip} className="rounded-full border border-[color:var(--tg-border)] bg-[color:var(--article-surface-2,var(--tg-glass))] px-3 py-1 text-[12px] text-[color:var(--tg-muted)]">
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <div className="animate-article-float">
              <AnimatedSticker name="book" size={34} />
            </div>
            <div className="animate-article-float-delayed">
              <AnimatedSticker name="sparkles" size={34} />
            </div>
            <div className="animate-article-float">
              <AnimatedSticker name="rocket" size={34} />
            </div>
            <span className="ml-1 text-[13px] font-semibold app-muted">{articlesMeta.length} материалов</span>
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {articlesMeta.map((article, index) => (
          <ArticleCard key={article.id} article={article} position={index + 1} />
        ))}
      </section>
    </div>
  );
};
