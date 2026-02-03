import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { getArticleById } from '../content';
import { motion } from 'framer-motion';

export const ArticleDetailPage = () => {
  const location = useLocation();
  // Парсим ID из URL
  const articleId = location.pathname.split('/articles/')[1];
  const navigate = useNavigate();
  const article = articleId ? getArticleById(articleId) : undefined;

  if (!article) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
        onClick={() => navigate('/')}
      />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '40px' }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="article-theme font-article fixed inset-x-0 bottom-0 top-0 z-[101] flex flex-col overflow-hidden rounded-t-[32px] bg-[color:var(--article-bg)] shadow-[0_30px_80px_-50px_rgba(0,0,0,0.7)]"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="relative h-[42vh] min-h-[280px] w-full bg-[color:var(--article-surface)]">
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/80 pointer-events-none" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-center">
              <div className="rounded-full bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur">
                {article.category}
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white/90 backdrop-blur transition-colors hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative -mt-12 px-5 pb-28">
            <div className="rounded-[28px] border border-[color:var(--article-border)] bg-[color:var(--article-surface)] p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.7)]">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--article-muted)]">
                {article.category}
              </p>
              <h1 className="mt-3 text-[30px] font-semibold leading-[1.15] tracking-tight text-[color:var(--article-text)]">
                {article.title}
              </h1>
              <div className="mt-6 space-y-8">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
