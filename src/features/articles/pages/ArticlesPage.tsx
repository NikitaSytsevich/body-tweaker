import { BookOpen } from 'lucide-react';
import { articles } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 text-center pt-8">
        <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-[900] text-slate-800">База знаний</h1>
        <p className="text-sm text-slate-500 mt-2 px-6">
            Научно обоснованные статьи о биохакинге, здоровье и долголетии.
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
