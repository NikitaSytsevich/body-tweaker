import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { loadArticleById } from '../content';
import type { Article } from '../types';

type ReadingGuide = {
  label: string;
  notes: string[];
  ritual: string;
};

const DEFAULT_GUIDE: ReadingGuide = {
  label: 'Редакционный материал',
  notes: [
    'Сначала пройдите смысловые блоки.',
    'Потом вернитесь к практическим шагам.',
    'Сохраните только применимые пункты.',
  ],
  ritual: 'Режим чтения: идея -> что делаю у себя -> как проверяю результат.',
};

const READING_GUIDE_BY_ID: Record<string, ReadingGuide> = {
  'how-to-prepare': {
    label: 'Подготовительный протокол',
    notes: [
      'Сверьте противопоказания и базовые анализы.',
      'Подготовьте режим первых дней заранее.',
      'Не стартуйте без плана восстановления.',
    ],
    ritual: 'Смысл статьи: вход в голодание через порядок, а не через резкий отказ от еды.',
  },
  'how-to-exit': {
    label: 'Протокол восстановления',
    notes: [
      'Первые дни только мягкий и дробный рацион.',
      'Темп выхода зависит от длительности голода.',
      'Любые тревожные симптомы требуют очной оценки.',
    ],
    ritual: 'Смысл статьи: выход определяет безопасность и закрепляет результат.',
  },
};

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

  const guide = useMemo(() => {
    if (!article) return DEFAULT_GUIDE;
    return READING_GUIDE_BY_ID[article.id] ?? DEFAULT_GUIDE;
  }, [article]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 backdrop-blur-md">
        <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/95 px-6 py-4 text-sm font-semibold app-header shadow-lg">
          Загрузка статьи...
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div
      className="app-page h-full w-full overflow-y-auto animate-fade-in"
      style={
        {
          ['--article-text' as string]: 'var(--tg-text)',
          ['--article-muted' as string]: 'var(--tg-muted)',
          ['--article-accent' as string]: 'var(--tg-accent)',
          ['--article-border' as string]: 'var(--tg-border)',
          ['--article-surface' as string]: 'var(--tg-surface)',
          ['--article-surface-2' as string]: 'var(--tg-glass)',
        } as CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-4 md:px-6">
        <section className="relative overflow-hidden rounded-[34px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)]">
          <div className="pointer-events-none absolute -left-16 -top-14 h-44 w-44 rounded-full bg-sky-400/18 blur-3xl animate-article-glow" />
          <div className="pointer-events-none absolute -right-14 -bottom-16 h-52 w-52 rounded-full bg-emerald-400/16 blur-3xl animate-article-glow" style={{ animationDelay: '-1.3s' }} />

          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[color:var(--tg-glass)]">
            {article.imageUrl ? <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" /> : null}
            <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/12 to-black/65" />
            <div className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
              {article.category}
            </div>
          </div>
        </section>

        <section className="relative -mt-12 z-10 px-3 md:px-5">
          <div className="rounded-[28px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/95 p-5 shadow-[var(--app-shadow-soft)] backdrop-blur-xl md:p-7">
            <p className="text-[11px] uppercase tracking-[0.18em] app-muted">{guide.label}</p>
            <h1 className="mt-3 text-[31px] leading-[1.08] tracking-tight app-header md:text-[42px]">{article.title}</h1>
            <p className="mt-4 text-[16px] leading-[1.68] app-muted md:text-[18px]">{article.summary}</p>

            <div className="mt-5 grid gap-2.5 md:grid-cols-3">
              {guide.notes.map((note) => (
                <div
                  key={note}
                  className="rounded-[16px] border border-[color:var(--tg-border)] bg-[color:var(--article-surface-2)] px-3.5 py-3 text-[13px] leading-[1.5] app-muted"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4">
          <div className="rounded-[30px] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] p-5 shadow-[var(--app-shadow-card)] md:p-8">
            <div className="mb-6 rounded-[20px] border border-[color:var(--tg-border)] bg-[color:var(--article-surface-2)] px-4 py-3.5">
              <p className="text-[13px] leading-[1.55] app-muted">{guide.ritual}</p>
            </div>

            <div className="article-reading-content space-y-8">{article.content}</div>
          </div>
        </section>
      </div>
    </div>
  );
};
