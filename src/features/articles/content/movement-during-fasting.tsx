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

export const movementDuringFasting: Article = {
  id: 'movement-during-fasting',
  title: 'Движение во время голодания: почему это часть метода',
  category: 'Практика',
  summary:
    'По Николаеву голодание без движения работает хуже: прогулки, дыхание и умеренная активность помогают адаптации и восстановлению.',
  imageUrl: '/images/articles/new/IMG_0425.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В книге движение во время РДТ подается как обязательный компонент, а не «дополнение по желанию».
          Логика проста: работающие системы восстанавливаются лучше, чем выключенные.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что обычно включали в режим</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Длительные прогулки на свежем воздухе каждый день.',
              'Дыхательные упражнения в прогулочном блоке.',
              'Легкая трудовая и бытовая активность без перенапряжения.',
              'Сохранение движения и в восстановительном периоде.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что дает умеренная активность</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Лучше переносится адаптационная фаза.</strong> Слабость и застойные ощущения часто уменьшаются после прогулки.
            </>,
            <>
              <strong>Поддерживается общий тонус.</strong> Пациенты реже уходят в пассивность и тревожную фиксацию на еде.
            </>,
            <>
              <strong>Работает связка с дыханием.</strong> Это поддерживает выведение продуктов обмена и субъективный комфорт.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Граница разумной нагрузки</ArticleHeading>
        <ArticleCallout tone="warning" title="Не путать с тренировочным стрессом">
          В контексте РДТ речь о дозированном движении. Форсированные тренировки, дефицит сна и
          соревнование «на выносливость» в этот период противоречат лечебной задаче.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleParagraph>
          Коротко по Николаеву: «голод + режим + движение» работает как система. Если из нее убрать движение,
          эффект обычно слабее и менее устойчив.
        </ArticleParagraph>
      </ArticleSection>
    </div>
  ),
};
