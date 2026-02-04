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

const TRANSITION_BARS = [
  { label: 'День -7', value: 100, note: 'обычный рацион' },
  { label: 'День -5', value: 80, note: 'меньше сахара и кофе' },
  { label: 'День -3', value: 60, note: 'легкая еда' },
  { label: 'День -1', value: 35, note: 'очень легко' },
  { label: 'День 0', value: 10, note: 'только вода' },
];

const CAFFEINE_TIMELINE = [
  { label: '0–12 ч', value: 20, note: 'обычно симптомов нет' },
  { label: '12–24 ч', value: 60, note: 'старт симптомов' },
  { label: '20–51 ч', value: 100, note: 'пик' },
  { label: '2–9 дней', value: 40, note: 'спад' },
];

const PREP_STEPS = [
  {
    title: 'Проверьте риски',
    text: 'Если есть признаки высокого риска дефицитов или длительного недоедания, самостоятельное голодание не подходит.',
  },
  {
    title: 'Снимите стимуляторы',
    text: 'Снижайте кофеин заранее, чтобы пик отмены не пришелся на старт голодания.',
  },
  {
    title: 'Облегчите рацион',
    text: 'За 3–5 дней перейдите на простую, малообработанную пищу и меньшие порции.',
  },
  {
    title: 'Подготовьте среду',
    text: 'Сон, спокойный график и минимум стресса важнее любых «детоксов».',
  },
];

const MEAL_PLAN = [
  {
    day: 'День -7 / -6',
    focus: 'Стабилизация режима',
    meals: [
      'Завтрак: овсянка на воде, ягоды, орехи.',
      'Обед: гречка + тушеные овощи, зелень, оливковое масло.',
      'Ужин: суп-пюре из овощей, тост из цельнозернового хлеба.',
    ],
  },
  {
    day: 'День -5 / -4',
    focus: 'Убираем алкоголь, сокращаем кофеин',
    meals: [
      'Завтрак: йогурт без сахара или каша, фрукт.',
      'Обед: чечевица/нут + овощной салат.',
      'Ужин: запеченные овощи + небольшая порция рыбы или тофу.',
    ],
  },
  {
    day: 'День -3',
    focus: 'Легкая пища и больше воды',
    meals: [
      'Завтрак: рисовая каша, банан.',
      'Обед: овощной бульон, салат, немного цельных круп.',
      'Ужин: тушеные овощи, травяной чай.',
    ],
  },
  {
    day: 'День -2',
    focus: 'Минимум тяжелых белков и жиров',
    meals: [
      'Завтрак: печеное яблоко, каша на воде.',
      'Обед: овощное рагу или суп.',
      'Ужин: салат, немного фруктов.',
    ],
  },
  {
    day: 'День -1',
    focus: 'Очень легкий день',
    meals: [
      'Завтрак: теплый травяной чай, фрукт.',
      'Обед: прозрачный овощной бульон.',
      'Ужин: вода или травяной чай.',
    ],
  },
];

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как подготовиться к голоданию: протокол на 7 дней',
  category: 'Гайд',
  summary: 'Подробная и аккуратная подготовка: оценка рисков, снижение кофеина, облегчение рациона, график на 7 дней и чек-лист готовности.',
  imageUrl: '/images/articles/new/IMG_0413.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Подготовка — это не «детокс», а управляемый переход к паузе в питании. Чем мягче вы снизите нагрузку на пищеварение
          и стимуляторы, тем спокойнее пройдет старт голодания.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Сначала — безопасность</ArticleHeading>
        <ArticleParagraph>
          Длительное водное голодание может сопровождаться побочными эффектами (головные боли, бессонница, метаболические нарушения)
          и требует аккуратного подхода. Если ваш план предполагает длительные сроки, медицинское сопровождение обязательно.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Проверьте риски">
          Самостоятельное голодание не подходит людям с высоким риском рефидинг‑синдрома. В критерии высокого риска входят
          очень низкий ИМТ, значительная потеря веса или длительное отсутствие питания. Если вы узнаете себя в этих критериях —
          нужна консультация врача.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>4 ключевых шага подготовки</ArticleHeading>
        <ArticleSteps
          items={PREP_STEPS.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>График перехода (условная шкала)</ArticleHeading>
        <ArticleParagraph>
          Ниже — иллюстративная шкала, которая показывает, как постепенно «облегчается» рацион. Это не медицинская рекомендация,
          а визуальный ориентир, чтобы сделать переход плавным.
        </ArticleParagraph>
        <ArticleSurface className="space-y-4">
          {TRANSITION_BARS.map(item => (
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
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Кофеин: почему важно снижать заранее</ArticleHeading>
        <ArticleParagraph>
          Отмена кофеина имеет типичное окно симптомов: первые проявления начинаются через 12–24 часа, пик — около 20–51 часов,
          а затем интенсивность снижается в течение нескольких дней. Если вы уменьшите кофеин заранее, пик не совпадет
          с самым сложным днем старта.
        </ArticleParagraph>
        <ArticleSurface className="space-y-4">
          {CAFFEINE_TIMELINE.map(item => (
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
          <p className="text-[12px] text-[color:var(--article-muted)]">
            Шкала отражает типичную динамику симптомов отмены кофеина, описанную в клинических обзорах.
          </p>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>План питания на 7 дней</ArticleHeading>
        <ArticleParagraph>
          Примерный план ниже не является лечебной диетой — это мягкий, «понятный» рацион без перегрузки. Он помогает
          стабилизировать режим и снизить тяжесть пищи перед стартом.
        </ArticleParagraph>
        <div className="space-y-4">
          {MEAL_PLAN.map(day => (
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
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Режим сна и активности</ArticleHeading>
        <ArticleParagraph>
          Сон — главный фактор «легкого входа». Постарайтесь лечь спать раньше на 30–60 минут в последние три дня подготовки.
          Активность оставьте умеренной: прогулки, растяжка, легкая мобилизация.
        </ArticleParagraph>
        <ArticleCallout tone="success">
          Если есть возможность, выберите для старта день с минимальным количеством встреч и стресса. Это повышает шанс пройти
          первый день спокойно.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>День 0: как стартовать</ArticleHeading>
        <ArticleList
          items={[
            'Сделайте утро тихим: вода, спокойная прогулка, минимум экрана и новостей.',
            'Подготовьте воду заранее и держите рядом — это снижает тревожность.',
            'Отслеживайте самочувствие, а не «силу воли». Если становится плохо — прерывайте голодание корректно.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Чек-лист готовности</ArticleHeading>
        <ArticleList
          items={[
            'Я снизил кофеин заранее и понимаю, когда может быть пик отмены.',
            'Я не отношусь к группе высокого риска рефидинг‑синдрома.',
            'Я облегчил рацион за 3–5 дней до старта.',
            'Я подготовил спокойный график на 1–2 дня.',
            'Я понимаю, что делать, если самочувствие ухудшится.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading as="h3">Источники и исследования</ArticleHeading>
        <ArticleSurface className="space-y-3">
          <p className="text-[14px] font-semibold text-[color:var(--article-text)]">Ключевые материалы</p>
          <ArticleList
            items={[
              <a
                key="nr-2023"
                href="https://academic.oup.com/nutritionreviews/article/82/5/664/7209209"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Narrative review о безопасности длительного водного голодания (Nutrition Reviews, 2023)
              </a>,
              <a
                key="nice-cg32"
                href="https://www.nice.org.uk/guidance/cg32/chapter/recommendations"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                NICE CG32: критерии риска рефидинг‑синдрома и рекомендации по питанию
              </a>,
              <a
                key="caffeine-statpearls"
                href="https://www.ncbi.nlm.nih.gov/books/NBK430790/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Обзор по отмене кофеина (StatPearls, обновляемый ресурс)
              </a>,
              <a
                key="caffeine-study"
                href="https://pubmed.ncbi.nlm.nih.gov/22282364/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Исследование симптомов отмены кофеина (PubMed)
              </a>,
              <a
                key="jama-tre-2023"
                href="https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2811116"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                RCT по time‑restricted eating (JAMA Network Open, 2023)
              </a>,
              <a
                key="jama-treat-2020"
                href="https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2771095"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                RCT TREAT по времени приема пищи (JAMA Internal Medicine, 2020)
              </a>,
            ]}
          />
        </ArticleSurface>
      </ArticleSection>
    </div>
  ),
};
