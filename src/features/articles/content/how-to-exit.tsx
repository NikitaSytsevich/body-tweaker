import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleParagraph,
  ArticleSection,
  ArticleSurface,
} from '../components/ArticleBlocks';

export const howToExit: Article = {
  id: 'how-to-exit',
  title: 'Выход из голодания: Важнее, чем сам процесс',
  category: 'Безопасность',
  summary: 'Самый опасный этап. Как запустить пищеварение заново, избежать отеков и сохранить лечебный эффект.',
  imageUrl: '/images/articles/2.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Выход из голодания — это не просто возвращение к еде. Это биологическая перестройка организма с внутреннего
          питания обратно на внешнее. Ошибка здесь может стоить здоровья и перечеркнуть все результаты.
        </ArticleLead>
        <ArticleCallout tone="warning" title="Синдром рефидинга">
          Резкий прием углеводов или соли после голода вызывает мощный выброс инсулина. Это задерживает воду (сильные
          отеки) и вымывает электролиты, что может привести к остановке сердца. Это не шутка.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Золотое правило времени</ArticleHeading>
        <ArticleSurface className="text-center">
          <p className="text-[17px] font-semibold text-[color:var(--article-text)]">
            Срок выхода должен быть равен сроку голодания.
          </p>
          <p className="mt-2 text-[14px] text-[color:var(--article-muted)]">
            Голодали 3 дня? Выходите 3 дня. Голодали 7 дней? Строгая диета неделю.
          </p>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Этап 1: Запуск (1-2 день)</ArticleHeading>
        <ArticleParagraph>
          Ваш желудок уменьшился, ферменты спят. Твердая пища упадет «камнем». Начинать нужно с жидкостей.
        </ArticleParagraph>
        <div className="space-y-3">
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Разбавленные соки</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Свежевыжатый морковный или яблочный сок, разбавленный водой 50/50. Пить маленькими глотками, «жуя»
              жидкость. Никаких магазинных соков!
            </p>
          </ArticleSurface>
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Овощной отвар</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Вода, в которой варились капуста, морковь, картофель. Без овощей, только бульон. Без соли.
            </p>
          </ArticleSurface>
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Этап 2: «Метла» (3-4 день)</ArticleHeading>
        <ArticleParagraph>Подключаем клетчатку, чтобы запустить перистальтику кишечника.</ArticleParagraph>
        <ArticleList
          items={[
            <>
              <strong>Салат «Метла»:</strong> мелко натертая сырая морковь и капуста. Без масла и соли. Работает как
              скраб для кишечника.
            </>,
            <>
              <strong>Печеные яблоки:</strong> идеальный источник пектина.
            </>,
            <>
              <strong>Паровые овощи:</strong> кабачок, брокколи, цветная капуста.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Этап 3: Плотная еда</ArticleHeading>
        <ArticleParagraph>
          Только на этом этапе можно вводить каши на воде (гречка, овсянка), немного растительного масла, орехи
          (размоченные). Белок (рыба, яйца) вводится в самую последнюю очередь.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Категорически нельзя">
          <ArticleList
            items={[
              'Соль (вызовет мгновенный отек)',
              'Сахар и сладости (удар по поджелудочной)',
              'Мясо, бульоны, грибы (слишком тяжело)',
              'Хлеб, выпечка, дрожжи',
              'Алкоголь (смертельно опасно)',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="info" title="Главный секрет">
          <p className="text-[16px] italic text-[color:var(--article-text)]">«Твердое — пить, жидкое — жевать».</p>
          <p className="mt-2 text-[14px] text-[color:var(--article-muted)]">
            Каждый кусочек нужно пережевывать до состояния воды (30-40 раз). Это запустит ферментацию уже во рту.
          </p>
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
