import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadArticleById } from '../content';
import WebApp from '@twa-dev/sdk';
import type { Article } from '../types';
import { ChevronLeft, X } from 'lucide-react';

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    if (!slug) {
      setArticle(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    loadArticleById(slug)
      .then((resolved) => {
        if (!isActive) return;
        setArticle(resolved ?? null);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!isLoading && !article) {
      navigate('/', { replace: true });
    }
  }, [isLoading, article, navigate]);

  useEffect(() => {
    if (isLoading || !article) return;

    const handleBack = () => navigate('/');
    try {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(handleBack);
    } catch {
      // ignore when running outside Telegram
    }
    return () => {
      try {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      } catch {
        // ignore
      }
    };
  }, [article, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-md">
        <div className="rounded-2xl bg-[color:var(--tg-surface)]/95 px-6 py-4 text-sm font-semibold app-header shadow-lg border border-[color:var(--tg-border)]">
          Загрузка статьи...
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div
      className="app-page w-full h-full overflow-y-auto animate-fade-in"
      style={
        {
          ['--article-text' as string]: 'var(--tg-text)',
          ['--article-muted' as string]: 'var(--tg-muted)',
          ['--article-accent' as string]: 'var(--tg-accent)',
          ['--article-border' as string]: 'var(--tg-border)',
          ['--article-surface-2' as string]: 'var(--tg-glass)',
        } as CSSProperties
      }
    >
      <div className="sticky top-0 z-20 px-4 pt-3 pb-3 bg-[linear-gradient(180deg,var(--tg-bg)_0%,color-mix(in_srgb,var(--tg-bg)_88%,transparent)_100%)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full app-panel flex items-center justify-center app-muted"
            aria-label="Назад к статьям"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="tg-chip">{article.category}</div>
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full app-panel flex items-center justify-center app-muted"
            aria-label="Закрыть статью"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-32">
        <div className="relative rounded-[34px] overflow-hidden border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)]">
          <div className="relative h-[34vh] min-h-[250px] bg-[color:var(--tg-glass)]">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/8 to-black/68 pointer-events-none" />
          </div>

          <div className="relative -mt-14 px-4 pb-4">
            <div className="rounded-[28px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/95 backdrop-blur-xl p-6 shadow-[var(--app-shadow-soft)]">
              <p className="text-[11px] uppercase tracking-[0.2em] app-muted">
                Материал
              </p>
              <h1 className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-tight app-header">
                {article.title}
              </h1>
              <p className="mt-4 text-[17px] leading-[1.65] text-[color:var(--article-muted)] font-[Iowan_Old_Style,Georgia,serif]">
                {article.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[30px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-5 py-6 shadow-[var(--app-shadow-soft)]">
          <div className="space-y-8">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
};
