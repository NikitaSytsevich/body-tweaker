import { BookOpen } from 'lucide-react';
import { articles } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 text-center pt-8">
        <div className="inline-block p-4 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-sm border border-slate-100 dark:border-white/10 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-500" />
        </div>
        <h1 className="text-3xl font-[900] text-slate-800 dark:text-white">База знаний</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 px-6">
            Полезные материалы о голодании, питании и оздоровлении организма.
        </p>
      </div>

      <div className="space-y-4 px-4 pb-24">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
