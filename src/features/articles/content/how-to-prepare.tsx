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

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как правильно подготовиться к голоданию',
  category: 'Гайд',
  summary: 'Полное руководство по входу: питание за 3 дня до старта, процедура очищения и психологический настрой.',
  imageUrl: '/images/articles/new/IMG_0413.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Успех голодания на 90% зависит от того, что вы делали за три дня до его начала. Резкий вход «с места в
          карьер» — главная ошибка, ведущая к тошноте, головным болям и срывам.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Правило 3-х дней</ArticleHeading>
        <ArticleParagraph>
          За трое суток до старта необходимо полностью изменить рацион. Ваша задача — разгрузить печень и почки,
          чтобы они могли заниматься выводом токсинов, а не перевариванием тяжелой пищи.
        </ArticleParagraph>

        <ArticleSurface>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--article-muted)]">Строго исключить</p>
          <div className="mt-3">
            <ArticleList
              items={[
                <>
                  <strong>Животный белок:</strong> мясо, рыбу, яйца, творог. Продукты распада белка при голодании
                  усиливают интоксикацию.
                </>,
                <>
                  <strong>Алкоголь и кофеин:</strong> они вызывают обезвоживание и спазм сосудов.
                </>,
                <>
                  <strong>Сахар и мучное:</strong> вызывают резкие скачки инсулина, что сделает голод невыносимым.
                </>,
              ]}
            />
          </div>
        </ArticleSurface>

        <ArticleParagraph>
          <strong>Что нужно есть:</strong> каши на воде (гречка, овсянка), тушеные овощи, свежие фрукты, салаты с
          небольшим количеством масла.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>«Выключение» голода</ArticleHeading>
        <ArticleParagraph>
          Особенность классического (советского) подхода РДТ — принудительное очищение кишечника перед стартом. Это
          делается не просто для чистоты.
        </ArticleParagraph>

        <ArticleCallout tone="info">
          Пока в кишечнике есть остатки пищи, организм продолжает требовать еду. Как только кишечник становится
          абсолютно пустым (после приема сульфата магния или клизмы), пищевой центр в мозгу «засыпает». Чувство голода
          исчезает практически полностью.
        </ArticleCallout>

        <ArticleParagraph className="text-[color:var(--article-text)]">Протокол Магнезии:</ArticleParagraph>
        <ArticleSteps
          items={[
            <>Купите в аптеке <strong>Сульфат Магния</strong> (порошок, 40-60г).</>,
            <>Вечером перед днем голода растворите пакет в стакане теплой воды.</>,
            <>Выпейте залпом (вкус горький, можно запить водой с лимоном).</>,
            <>В течение часа процедура очищения завершится.</>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Настройка сознания</ArticleHeading>
        <ArticleParagraph>
          Голодание — это стресс только если вы воспринимаете его как лишение. Поменяйте установку.
        </ArticleParagraph>
        <ArticleSurface className="bg-[color:var(--article-surface)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--article-muted)]">Аффирмация</p>
          <p className="mt-3 text-[16px] italic leading-[1.6] text-[color:var(--article-text)]">
            «Я не лишаю себя еды. Я даю своему организму долгожданный отпуск. Это лечебная процедура, операция без
            ножа, которую проводит сама природа.»
          </p>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Чек-лист готовности</ArticleHeading>
        <ArticleList
          items={[
            'Я исключил мясо и кофе за 3 дня до старта',
            'Я купил магнезию или кружку Эсмарха',
            'Я выбрал день, когда мне не нужно много работать',
            'Я предупредил близких, чтобы меня не дразнили едой',
            'Я пью не менее 2 литров воды в день',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Противопоказания">
          Не начинайте голодание при беременности, диабете 1 типа, дефиците массы тела или острых заболеваниях ЖКТ
          без консультации врача.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
