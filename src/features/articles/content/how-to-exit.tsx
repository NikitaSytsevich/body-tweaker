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

const RISK_WINDOW = [
  { label: '0–24 ч', value: 45, note: 'старт питания' },
  { label: '24–72 ч', value: 100, note: 'максимум риска' },
  { label: '3–5 дней', value: 70, note: 'мониторинг' },
  { label: '>5 дней', value: 35, note: 'стабилизация' },
];

const TEXTURE_RAMP = [
  { label: 'День 1', value: 20, note: 'жидкости' },
  { label: 'День 2', value: 40, note: 'пюре и мягкая еда' },
  { label: 'Дни 3–4', value: 65, note: 'мягкие твердые' },
  { label: 'Дни 5–7', value: 85, note: 'умеренно плотная еда' },
];

const STOP_SIGNALS = [
  { label: 'Легкая слабость', value: 25, note: 'обычно допустимо' },
  { label: 'Головокружение', value: 50, note: 'снизить нагрузку' },
  { label: 'Отеки/тахикардия', value: 85, note: 'остановить выход и обратиться' },
  { label: 'Сильная тошнота', value: 70, note: 'стоп и консультация' },
];

const REFEED_STEPS = [
  {
    title: 'Микропорции и паузы',
    text: 'В первые 24–72 часа важно есть очень небольшими порциями и делать паузы 2–3 часа.',
  },
  {
    title: 'Мягкие и теплые блюда',
    text: 'Суп‑пюре, овощной отвар, каши на воде лучше переносятся, чем твердая или холодная еда.',
  },
  {
    title: 'Контроль соли и сахара',
    text: 'Избыток соли усиливает задержку жидкости, а быстрые сахара дают резкий всплеск инсулина.',
  },
  {
    title: 'Постепенное возвращение белка и жиров',
    text: 'Белок и жиры вводите позже и в малых объемах, ориентируясь на самочувствие.',
  },
];

const MEAL_PLAN_SHORT = [
  {
    day: '0–6 часов',
    focus: 'Мягкий старт',
    meals: [
      'Теплая вода малыми порциями.',
      'Травяные чаи без сахара.',
      'При сильном голоде — овощной отвар без соли.',
    ],
  },
  {
    day: '6–24 часа',
    focus: 'Жидкое + пюре',
    meals: [
      'Овощной бульон или суп‑пюре на воде.',
      'Разбавленные соки 1:1 (не более 1 стакана).',
      'Небольшие порции каши на воде.',
    ],
  },
  {
    day: '24–48 часов',
    focus: 'Мягкие твердые продукты',
    meals: [
      'Тушеные овощи, салаты из мягкой клетчатки.',
      'Небольшая порция круп (гречка/рис).',
      'Фрукты по переносимости.',
    ],
  },
];

const MEAL_PLAN_LONG = [
  {
    day: 'День 1',
    focus: 'Запуск пищеварения',
    meals: [
      'Теплая вода небольшими порциями.',
      'Овощной отвар без соли, разбавленные соки 1:1.',
      'Если голод сильный — жидкие супы‑пюре на воде.',
    ],
  },
  {
    day: 'День 2',
    focus: 'Мягкая пища',
    meals: [
      'Овсяная или рисовая каша на воде.',
      'Пюре из кабачка/цветной капусты.',
      'Печеные яблоки или банан (по переносимости).',
    ],
  },
  {
    day: 'Дни 3–4',
    focus: 'Мягкие твердые продукты',
    meals: [
      'Тушеные овощи, супы‑пюре погуще.',
      'Небольшая порция гречки/риса.',
      'Салаты из мягких овощей без жесткой клетчатки.',
    ],
  },
  {
    day: 'Дни 5–6',
    focus: 'Возврат белка',
    meals: [
      'Небольшие порции рыбы, яйца или тофу.',
      'Овощные гарниры, цельные крупы.',
      'Легкие кисломолочные продукты при хорошей переносимости.',
    ],
  },
  {
    day: 'День 7+',
    focus: 'Плавное возвращение к норме',
    meals: [
      'Сбалансированные блюда с овощами, белком и сложными углеводами.',
      'Ограничьте ультра‑переработанные продукты и алкоголь.',
      'Сохраняйте умеренный размер порций еще 3–5 дней.',
    ],
  },
];

export const howToExit: Article = {
  id: 'how-to-exit',
  title: 'Выход из голодания: подробный и безопасный протокол',
  category: 'Безопасность',
  summary: 'Как мягко вернуть питание, избежать рефидинг‑синдрома и сделать переход комфортным. Этапы, графики и два плана питания.',
  imageUrl: '/images/articles/2.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Выход из голодания — это не «просто поесть». Это переход от внутреннего питания к внешнему, который влияет на
          электролиты, гормоны и работу сердца. Чем дольше был голод, тем осторожнее должен быть выход.
        </ArticleLead>
        <ArticleCallout tone="warning" title="Рефидинг‑синдром">
          Резкое увеличение калорий, особенно углеводов, может вызвать резкий выброс инсулина и падение фосфора, калия и
          магния. Это состояние опасно для сердца и нервной системы. Риск особенно высок в первые 5 дней после возобновления
          питания.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Кому нужен медицинский контроль</ArticleHeading>
        <ArticleParagraph>
          Существуют критерии высокого риска рефидинг‑синдрома. Они описаны в клинических руководствах (NICE, ASPEN). Если
          вы подпадаете под критерии, самостоятельный выход из длительного голодания небезопасен.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Высокий риск">
          <ArticleList
            items={[
              'Очень низкий ИМТ или значительная потеря веса за последние месяцы.',
              'Отсутствие полноценного питания более 10 дней.',
              'Низкие уровни калия, магния или фосфора до начала питания.',
              'История злоупотребления алкоголем или прием некоторых препаратов (например, диуретики).',
            ]}
          />
        </ArticleCallout>
        <ArticleCallout tone="info" title="Что делают в клинических протоколах">
          Для людей из группы риска обычно используют витамин B1 (тиамин), поливитамины и регулярный контроль
          электролитов в первые дни питания. Это снижает вероятность осложнений.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Окно риска: первые 5 дней</ArticleHeading>
        <ArticleParagraph>
          Клинические рекомендации описывают, что симптомы рефидинг‑синдрома чаще всего проявляются в первые 5 дней после
          возобновления питания, пик — в первые 24–72 часа. Это «критическое окно», когда важны маленькие порции и наблюдение.
        </ArticleParagraph>
        <ArticleSurface className="space-y-4">
          {RISK_WINDOW.map(item => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">
                <span>{item.label}</span>
                <span>{item.note}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[color:var(--article-surface)]">
                <div
                  className="h-full rounded-full bg-[color:var(--article-accent)]"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-[12px] text-[color:var(--article-muted)]">
            Иллюстративная шкала: ASPEN описывает проявления рефидинг‑синдрома в первые 5 дней после возобновления питания.
          </p>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>4 базовых принципа выхода</ArticleHeading>
        <ArticleSteps
          items={REFEED_STEPS.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Шкала плотности пищи</ArticleHeading>
        <ArticleParagraph>
          Переход лучше строить по текстуре: от жидкого к мягкому и только затем к плотной пище. Ниже — условная шкала,
          которая показывает, как «усложнять» еду день за днем.
        </ArticleParagraph>
        <ArticleSurface className="space-y-4">
          {TEXTURE_RAMP.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-20 text-[12px] font-semibold text-[color:var(--article-text)]">{item.label}</div>
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-[color:var(--article-surface)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--article-accent)]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
              <div className="w-32 text-[12px] text-[color:var(--article-muted)]">{item.note}</div>
            </div>
          ))}
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>План питания по длительности голодания</ArticleHeading>
        <ArticleParagraph>
          Выберите протокол, который соответствует длительности вашего голодания. Для сроков больше 7 дней или при
          наличии факторов риска нужен медицинский контроль.
        </ArticleParagraph>
        <ArticleSurface className="space-y-3">
          <p className="text-[14px] font-semibold text-[color:var(--article-text)]">
            24–48 часов голодания
          </p>
          <div className="space-y-4">
            {MEAL_PLAN_SHORT.map(day => (
              <ArticleSurface key={day.day} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">
                    {day.focus}
                  </span>
                </div>
                <ArticleList items={day.meals} />
              </ArticleSurface>
            ))}
          </div>
        </ArticleSurface>
        <ArticleSurface className="space-y-3">
          <p className="text-[14px] font-semibold text-[color:var(--article-text)]">
            5–7 дней голодания
          </p>
        <div className="space-y-4">
          {MEAL_PLAN_LONG.map(day => (
            <ArticleSurface key={day.day} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">
                  {day.focus}
                </span>
              </div>
              <ArticleList items={day.meals} />
            </ArticleSurface>
          ))}
        </div>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Сигналы остановки</ArticleHeading>
        <ArticleParagraph>
          Это ориентировочная шкала: чем сильнее симптомы, тем осторожнее нужно быть. Если появляются выраженные
          симптомы — прекращайте выход и обращайтесь за помощью.
        </ArticleParagraph>
        <ArticleSurface className="space-y-4">
          {STOP_SIGNALS.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-36 text-[12px] font-semibold text-[color:var(--article-text)]">{item.label}</div>
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-[color:var(--article-surface)]">
                  <div
                    className="h-full rounded-full bg-[color:var(--article-accent)]"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
              <div className="w-40 text-[12px] text-[color:var(--article-muted)]">{item.note}</div>
            </div>
          ))}
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что категорически избегать</ArticleHeading>
        <ArticleList
          items={[
            'Алкоголь — увеличивает риск осложнений.',
            'Большие порции и еда «впопыхах».',
            'Очень соленые или сладкие продукты в первые дни.',
            'Тяжелые жирные блюда, жареное, копчености.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Когда нужно обратиться за помощью</ArticleHeading>
        <ArticleCallout tone="warning" title="Тревожные признаки">
          <ArticleList
            items={[
              'Сильная слабость, спутанность сознания, головокружение.',
              'Отеки, боли в груди, учащенное сердцебиение.',
              'Сильная тошнота или рвота.',
              'Невозможность удерживать пищу или воду.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading as="h3">Источники и исследования</ArticleHeading>
        <ArticleSurface className="space-y-3">
          <p className="text-[14px] font-semibold text-[color:var(--article-text)]">Ключевые материалы</p>
          <ArticleList
            items={[
              <a
                key="nice-cg32"
                href="https://www.nice.org.uk/guidance/cg32/chapter/recommendations"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                NICE CG32: критерии высокого риска и рекомендации по старту питания
              </a>,
              <a
                key="aspen-2020"
                href="https://pubmed.ncbi.nlm.nih.gov/32115791/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                ASPEN Consensus Recommendations for Refeeding Syndrome (2020)
              </a>,
              <a
                key="bmj-2008"
                href="https://www.bmj.com/content/336/7659/1495"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Clinical review: Refeeding syndrome (BMJ, 2008)
              </a>,
              <a
                key="australasian-2024"
                href="https://pubmed.ncbi.nlm.nih.gov/40090863/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Australasian Society of Parenteral and Enteral Nutrition: Consensus statements (2025)
              </a>,
            ]}
          />
        </ArticleSurface>
      </ArticleSection>
    </div>
  ),
};
