import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { ArticleMeta } from '../types';

interface Props {
  article: ArticleMeta;
  position?: number;
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <div className="w-full mb-5 last:mb-24 transition-transform active:scale-[0.99]">
      <Link
        to={`/articles/${article.id}`}
        className="group block overflow-hidden rounded-[36px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[color:var(--tg-glass)]">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)]">
              Нет изображения
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/65" />
          <div className="absolute left-4 top-4 rounded-full bg-black/35 text-white text-[11px] font-semibold tracking-wide px-3 py-1 backdrop-blur-md border border-white/25">
            {article.category}
          </div>
        </div>

        <div className="space-y-3 p-6">
          <h3 className="text-[24px] font-semibold leading-tight tracking-tight app-header">
            {article.title}
          </h3>
          <p className="text-[16px] leading-relaxed app-muted line-clamp-3">
            {article.summary}
          </p>
          <div className="pt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[color:var(--tg-accent)]">
            Читать статью
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
};
