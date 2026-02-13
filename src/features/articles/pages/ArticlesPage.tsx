import { articlesMeta } from '../content';
import { ArticleCard } from '../components/ArticleCard';

export const ArticlesPage = () => {
  return (
    <div className="min-h-full animate-in fade-in duration-500 pb-28">
      <div className="space-y-3">
        {articlesMeta.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
