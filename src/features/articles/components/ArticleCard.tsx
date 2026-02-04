import { Link } from 'react-router-dom';
import type { ArticleMeta } from '../types';

interface Props {
  article: ArticleMeta;
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <div className="w-full mb-6 last:mb-24 transition-transform hover:scale-[0.99] active:scale-[0.98]">
      <Link
        to={`/articles/${article.id}`}
        className="group block overflow-hidden rounded-[32px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[0_20px_60px_-45px_rgba(0,0,0,0.45)]"
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[color:var(--tg-glass)]">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)]">
              Нет изображения
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/60" />
        </div>

        <div className="space-y-3 p-5">
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] app-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--tg-accent)]" />
            {article.category}
          </span>
          <h3 className="text-[26px] font-semibold leading-tight tracking-tight app-header">
            {article.title}
          </h3>
          <p className="text-[15px] leading-relaxed app-muted line-clamp-3">
            {article.summary}
          </p>
        </div>
      </Link>
    </div>
  );
};
