import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Article } from '../types';

interface Props {
  article: Article;
}

export const ArticleCard = ({ article }: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      className="w-full mb-6 last:mb-24"
    >
      <Link to={`/articles/${article.id}`} className="block bg-white dark:bg-[#2C2C2E] rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden relative group">

        {/* Картинка (Aspect Ratio ~ 3:2 как на скрине) */}
        <div className="aspect-[3/2] w-full bg-slate-100 dark:bg-[#3A3A3C] relative overflow-hidden">
            {article.imageUrl ? (
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                // Заглушка, если картинки нет
                <div className="w-full h-full bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-indigo-900/20 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    Нет изображения
                </div>
            )}
        </div>

        {/* Текст */}
        <div className="p-6">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">
            {article.category}
          </span>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white leading-tight mb-3">
            {article.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

      </Link>
    </motion.div>
  );
};
