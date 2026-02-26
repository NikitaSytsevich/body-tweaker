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

export const fractionalMethod: Article = {
  id: 'fractional-method',
  title: 'Фракционный метод: когда лучше несколько коротких курсов',
  category: 'Практика',
  summary:
    'В книге и клинических наблюдениях описан более осторожный путь: не один длинный срок, а серия средних/коротких курсов с восстановлением.',
  imageUrl: '/images/articles/new/IMG_0422.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Николаев отмечает, что при большой зашлакованности, сопутствующих рисках или слабой переносимости
          длинный непрерывный курс не всегда лучший выбор. В таких случаях эффективнее ступенчатый, фракционный подход.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Смысл фракционного подхода</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Меньше перегрузка на системы выведения в одном цикле.',
              'Проще контролировать переносимость и корректировать тактику.',
              'У пациента выше шанс удержать дисциплину на восстановлении.',
              'Кумулятивный эффект формируется за счет повторяемости, а не экстремума.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Как это выглядит на практике</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Курс 1.</strong> Умеренный срок + полный восстановительный период.
            </>,
            <>
              <strong>Пауза.</strong> Закрепление режима питания, движения и сна.
            </>,
            <>
              <strong>Курс 2 и далее.</strong> Новый цикл на фоне лучшей адаптации и более понятной индивидуальной реакции.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Когда это особенно рационально</ArticleHeading>
        <ArticleCallout tone="info" title="По логике книги">
          <ArticleList
            items={[
              'Выраженный избыточный вес и плохая переносимость длинных сроков.',
              'Наличие нескольких хронических состояний и высокая вариативность реакции.',
              'Опыт неудачного длинного курса с срывом на выходе.',
              'Необходимость двигаться осторожно и управляемо под наблюдением.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Важно">
          Фракционный формат - это не «облегченный хаос», а такая же дисциплинированная терапия с обязательным
          восстановлением между циклами.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
