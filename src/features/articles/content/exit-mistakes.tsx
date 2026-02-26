import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleParagraph,
  ArticleSection,
  ArticleSteps,
  ArticleSurface,
} from '../components/ArticleBlocks';

export const exitMistakes: Article = {
  id: 'exit-mistakes',
  title: 'Ошибки на выходе из голодания: разбор по книге',
  category: 'Безопасность',
  summary:
    'Почему большинство срывов происходит на восстановлении: типичные ошибки, последствия и рабочая логика профилактики по Николаеву.',
  imageUrl: '/images/articles/new/IMG_0419.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Николаев многократно повторяет: «подъем» - это голодание, а «спуск» - восстановление. И именно на спуске
          чаще всего случаются грубые ошибки, которые сводят результат к нулю.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Топ ошибок, описанных в книге</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Резкий объем еды в первые дни.</strong> Желание «компенсировать» голод приводит к перегрузке ЖКТ.
            </>,
            <>
              <strong>Запрещенные продукты слишком рано.</strong> Соль, плотные белки, жареное, сладкое, алкоголь.
            </>,
            <>
              <strong>Плохое пережевывание и быстрый темп.</strong> Вздутие, боли, нарушения стула растут даже на разрешенной пище.
            </>,
            <>
              <strong>Самовольная смена схемы.</strong> «Подсказки» знакомых и импровизация вместо протокола.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему последствия бывают тяжелыми</ArticleHeading>
        <ArticleParagraph>
          В книге приводятся случаи острых осложнений после грубого нарушения выхода. Главная идея автора:
          в первые дни восстановительный тракт особенно чувствителен, и перегрузка может быть опасной.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Что повышает риск">
          <ArticleList
            items={[
              'Крупные порции и сложные сочетания продуктов.',
              'Возврат к соли и тяжелой белковой еде раньше срока.',
              'Отсутствие наблюдения за самочувствием в первые дни.',
              'Игнорирование боли, рвоты, выраженного метеоризма, отеков.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Рабочая стратегия без срыва</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Микропорции, медленный темп и очень тщательное пережевывание.',
              'Простая еда, без «кулинарных комбинаций» в первые дни.',
              'Режим прогулок и отдыха сохраняется, а не отменяется.',
              'Любое заметное ухудшение - повод остановиться и обсудить шаги с врачом.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Памятка">
          Выход - это отдельная терапевтическая фаза. Если выдержать дисциплину восстановления, эффективность курса
          резко выше и стабильнее.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
