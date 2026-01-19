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
        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
        onClick={() => navigate('/')}
      />

      <motion.div 
        initial={{ y: '100%' }} 
        animate={{ y: '40px' }} 
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-x-0 bottom-0 top-0 z-[101] bg-white rounded-t-[2rem] overflow-hidden flex flex-col shadow-2xl"
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute top-5 right-5 z-50 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-black/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
            <div className="relative w-full h-[45vh] bg-slate-100">
                {article.imageUrl && (
                    <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                
                <div className="absolute top-6 left-6 right-16">
                    <span className="text-xs font-bold text-white/95 uppercase tracking-widest drop-shadow-sm">
                        Статья: {article.category.toLowerCase()}
                    </span>
                </div>
            </div>

            <div className="relative px-6 -mt-6 pb-24">
                <div className="mb-6">
                    <h1 className="text-3xl font-[900] text-slate-900 leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>
                </div>
                <div className="prose prose-lg prose-slate max-w-none font-medium text-slate-700 leading-relaxed">
                    {article.content}
                </div>
            </div>
        </div>
      </motion.div>
    </>
  );
};
