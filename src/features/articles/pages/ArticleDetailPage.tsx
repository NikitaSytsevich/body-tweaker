import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadArticleById } from '../content';
import WebApp from '@twa-dev/sdk';
import type { Article } from '../types';

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
        <div className="rounded-2xl bg-white/90 px-6 py-4 text-sm font-semibold text-slate-700 shadow-lg dark:bg-[#2C2C2E] dark:text-white">
          Загрузка статьи...
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md animate-fade-in"
        onClick={() => navigate('/')}
      />

      <div
        className="app-surface fixed inset-x-0 bottom-0 top-0 z-[101] flex flex-col overflow-hidden rounded-t-[32px] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.7)] pt-[var(--app-top-offset)] animate-sheet-in"
      >
        <div
          className="pointer-events-none absolute top-0 left-0 right-0"
          style={{
            height: 'var(--app-top-offset)',
            background: 'linear-gradient(180deg, var(--tg-bg) 0%, rgba(255,255,255,0) 100%)',
          }}
        />
        <div className="flex-1 overflow-y-auto">
          <div className="relative h-[42vh] min-h-[280px] w-full bg-[color:var(--tg-surface)]">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/80 pointer-events-none" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
              <div className="tg-chip bg-black/40 text-white/85">
                {article.category}
              </div>
            </div>
          </div>

          <div className="relative -mt-12 px-5 pb-28">
            <div className="app-card rounded-[28px] p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] uppercase tracking-[0.25em] app-muted">
                {article.category}
              </p>
              <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-tight app-header">
                {article.title}
              </h1>
              <div className="mt-6 space-y-8">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
