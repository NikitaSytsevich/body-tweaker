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

export const skinDetoxHygiene: Article = {
  id: 'skin-detox-hygiene',
  title: 'Выведение через кожу и гигиена при РДТ',
  category: 'Практика',
  summary:
    'По книге Николаева кожа - один из путей выведения продуктов обмена, поэтому гигиена, водные процедуры и уход за полостью рта входят в базовый протокол.',
  imageUrl: '/images/articles/new/IMG_0418.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В «Голодании ради здоровья» Николаев описывает РДТ как систему: продукты обмена выводятся через кишечник, почки,
          легкие и кожу. Поэтому гигиена в курсе - это не «комфорт», а часть лечебной тактики.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что в книге сказано про кожу</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Через кожу также идут выделительные процессы, поэтому используются водные процедуры и массаж.',
              'Для усиления эффекта упоминается стимулирование потоотделения (в т. ч. баня/сауна при отсутствии противопоказаний).',
              'При корректном режиме это помогает переносить адаптационные этапы ровнее.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему гигиена важна именно во время голодания</ArticleHeading>
        <ArticleParagraph>
          В ранних стадиях в книге описаны налет на языке, запах изо рта, сухость слизистых, изменения самочувствия. На этом фоне
          ежедневная гигиена снижает дискомфорт и помогает держать режим без срывов.
        </ArticleParagraph>
        <ArticleCallout tone="info" title="Практический смысл">
          Гигиенические действия здесь работают как «поддержка процесса»: уменьшают неприятные ощущения и помогают сохранять
          управляемость курса.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Минимальный гигиенический протокол</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Ежедневные водные процедуры.</strong> Душ/ванна по переносимости и назначенной схеме.
            </>,
            <>
              <strong>Уход за полостью рта.</strong> Чистка зубов, полоскание горла, контроль сухости слизистых.
            </>,
            <>
              <strong>Чистая одежда и проветривание.</strong> Гигиена белья, комфортный терморежим, свежий воздух в комнате.
            </>,
            <>
              <strong>Мягкая активация кожи.</strong> Массаж или щадящее растирание по протоколу и переносимости.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что не стоит делать</ArticleHeading>
        <ArticleCallout tone="warning" title="Частые ошибки">
          <ArticleList
            items={[
              'Полностью игнорировать гигиену «ради терпения».',
              'Форсировать баню/перегрев в состоянии выраженной слабости.',
              'Использовать агрессивные средства, пересушивающие кожу и слизистые.',
              'Отменять базовые процедуры при нарастании симптомов без консультации с врачом.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Короткий вывод">
          По логике книги, гигиена при РДТ - это элемент безопасности. Чем стабильнее уход за кожей, полостью рта и режимом дня,
          тем проще пройти курс и восстановление без лишнего дискомфорта.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};

