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

export const acidoticCrisis: Article = {
  id: 'acidotic-crisis',
  title: 'Ацидотический криз: что это и как пройти спокойно',
  category: 'Безопасность',
  summary:
    'Объяснение ключевого переломного момента по Николаеву: когда он наступает, какие признаки нормальны и когда нужна медицинская помощь.',
  imageUrl: '/images/articles/new/IMG_0418.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В книге Николаева ацидотический криз описан как переломный момент адаптации к эндогенному питанию.
          Обычно он приходится на ранний участок курса и сопровождается сменой самочувствия.
        </ArticleLead>
        <ArticleCallout tone="info" title="Просто о сути">
          До криза организм «перестраивается», после - чаще включается более устойчивая фаза адаптации.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Типичная динамика по книге</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>До криза.</strong> Тошнота, слабость, головная боль, налет на языке, запах ацетона, скачки самочувствия.
            </>,
            <>
              <strong>Момент перелома.</strong> Иногда резкий, иногда волнообразный с короткими «светлыми окнами».
            </>,
            <>
              <strong>После криза.</strong> Бодрость растет, состояние выравнивается, переносимость режима становится лучше.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что в книге считают рабочими мерами</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Прогулки на свежем воздухе и дыхательные упражнения.',
              'Адекватный питьевой режим и щадящий распорядок дня.',
              'Процедуры очищения в рамках врачебной схемы РДТ.',
              'Отказ от самовольного прерывания курса «на испуге».',
            ]}
          />
        </ArticleSurface>
        <ArticleParagraph>
          Николаев отдельно подчеркивает: многие пациенты пугаются кризовых симптомов и преждевременно
          начинают соки, сладкое или другие продукты, чем ломают динамику лечения.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Когда это уже не «обычная адаптация»</ArticleHeading>
        <ArticleCallout tone="warning" title="Повод для очной оценки">
          <ArticleList
            items={[
              'Нарастающая аритмия, выраженная гемодинамическая нестабильность.',
              'Многократная рвота с обезвоживанием и судорожным синдромом.',
              'Потеря сознания, выраженное спутывание, сильная слабость с ухудшением.',
              'Любыe симптомы, которые не укладываются в типичную стадию и прогрессируют.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Главный вывод">
          Криз - это не цель и не повод «терпеть любой ценой». Это ориентир стадии. Его проходят спокойнее,
          когда есть режим, наблюдение и понимание процесса.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
