import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleSection,
  ArticleSteps,
  ArticleSurface,
} from '../components/ArticleBlocks';

export const preventiveShortFasts: Article = {
  id: 'preventive-short-fasts',
  title: 'Короткие профилактические голодания: подход Николаева',
  category: 'Профилактика',
  summary:
    'Как в книге описана профилактика: короткие и регулярные циклы, связь с образом жизни и зачем это рассматривали как часть общественного здоровья.',
  imageUrl: '/images/articles/new/IMG_0423.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В главе «Немного о профилактике» Николаев смещает фокус с лечения на образ жизни: питание, движение,
          отказ от вредных привычек и регулярные короткие разгрузки как инструмент поддержания здоровья.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Профилактика в логике книги</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Курс РДТ не «магическая кнопка», а старт для нового режима.',
              'Без изменения привычек симптомы склонны возвращаться.',
              'Короткие разгрузочные окна рассматриваются как поддерживающая мера.',
              'Эффект выше, когда питание и движение не противоречат, а дополняют друг друга.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Какие варианты коротких циклов упоминаются</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Однодневные и двухдневные разгрузки.</strong> Николаев описывает их как более доступный вход,
              чем попытка сразу идти в длинный срок.
            </>,
            <>
              <strong>Регулярность важнее героизма.</strong> Лучше устойчивый щадящий ритм, чем редкие экстремальные попытки.
            </>,
            <>
              <strong>Обязательная связка с режимом.</strong> Питание, движение, сон и отказ от вредных привычек остаются базой.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Кому этот подход особенно полезен</ArticleHeading>
        <ArticleCallout tone="info" title="По книге - группы внимания">
          <ArticleList
            items={[
              'Люди с сидячим образом жизни и избыточным весом.',
              'Жители крупных городов с высокой нагрузкой среды.',
              'Пациенты после основного курса, которым нужно закрепление.',
              'Те, кто хочет начать осторожно и дисциплинированно.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Ограничение">
          Профилактические форматы не отменяют противопоказания и не заменяют лечение при острых состояниях.
          Если есть хронические диагнозы или сомнения по безопасности, старт согласуют с врачом.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
