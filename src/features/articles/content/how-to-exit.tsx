import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleParagraph,
  ArticleProgressChart,
  ArticleSection,
  ArticleSteps,
  ArticleSurface,
} from '../components/ArticleBlocks';

const REFEED_RISK_WINDOW = [
  { label: '0-24 ч', value: 55, note: 'осторожный старт' },
  { label: '24-72 ч', value: 100, note: 'пик риска' },
  { label: '3-5 дни', value: 72, note: 'контроль реакции' },
  { label: '5-7 дни', value: 45, note: 'стабилизация' },
];

const FOOD_TEXTURE_SCALE = [
  { label: 'Этап 1', value: 20, note: 'жидкости' },
  { label: 'Этап 2', value: 38, note: 'пюре и каши' },
  { label: 'Этап 3', value: 62, note: 'мягкие твердые' },
  { label: 'Этап 4', value: 85, note: 'обычная текстура' },
];

const FIRST_DAY_RHYTHM = [
  { label: '0-6 часов', value: 20, note: 'вода и паузы' },
  { label: '6-12 часов', value: 35, note: 'теплые жидкости' },
  { label: '12-24 часа', value: 50, note: 'микропорции' },
  { label: '24 часа+', value: 65, note: 'мягкая еда' },
];

const REFEED_RULES = [
  {
    title: 'Микропорции вместо «первого большого приема»',
    text: 'Первая еда после голодания должна быть маленькой. Дайте ЖКТ и гормональной системе время перестроиться.',
  },
  {
    title: 'Низкая скорость возврата углеводов',
    text: 'Резкий углеводный удар в начале выхода - главный сценарий проблем. Начинайте с мягких и умеренных объемов.',
  },
  {
    title: 'Сначала текстура, потом калории',
    text: 'Пищеварение легче переносит теплые жидкие и полужидкие формы. Усложняйте текстуру постепенно.',
  },
  {
    title: 'Наблюдение важнее «героизма»',
    text: 'Следите за пульсом, слабостью, отеками, головокружением и переносимостью. Любое выраженное ухудшение - повод остановить протокол.',
  },
];

const SHORT_FAST_EXIT = [
  {
    stage: '0-6 часов',
    focus: 'Запуск пищеварения',
    menu: [
      'Теплая вода небольшими порциями.',
      'Травяной чай без сахара.',
      'По самочувствию - овощной отвар без избытка соли.',
    ],
    control: ['Не есть быстро', 'Избегать холодной и грубой еды'],
  },
  {
    stage: '6-24 часа',
    focus: 'Жидкое + полужидкое',
    menu: [
      'Суп-пюре на воде или легкий бульон.',
      'Небольшая порция каши на воде.',
      'При хорошей переносимости - мягкий фрукт.',
    ],
    control: ['Паузы 2-3 часа между приемами', 'Без сахара и тяжелого жира'],
  },
  {
    stage: '24-48 часов',
    focus: 'Мягкие твердые продукты',
    menu: [
      'Тушеные овощи или рагу.',
      'Небольшая порция риса/гречки.',
      'Легкий белок в минимальном объеме (по переносимости).',
    ],
    control: ['Без переедания', 'Контроль соли и самочувствия'],
  },
];

const LONG_FAST_EXIT = [
  {
    day: 'День 1',
    focus: 'Только мягкий запуск',
    meals: [
      'Теплая вода дробно.',
      'Овощной отвар, жидкий суп-пюре.',
      'Без плотной и сладкой еды.',
    ],
  },
  {
    day: 'День 2',
    focus: 'Полужидкая база',
    meals: [
      'Каша на воде небольшими порциями.',
      'Пюре из кабачка/цветной капусты.',
      'Никаких больших тарелок.',
    ],
  },
  {
    day: 'Дни 3-4',
    focus: 'Мягкие твердые',
    meals: [
      'Тушеные овощи, более густые супы.',
      'Немного крупы.',
      'По переносимости - мягкий белок в малом объеме.',
    ],
  },
  {
    day: 'Дни 5-6',
    focus: 'Возврат белка и жиров',
    meals: [
      'Постепенное добавление рыбы/тофу/яиц.',
      'Овощной гарнир и умеренные порции.',
      'Жиры только в небольшом количестве.',
    ],
  },
  {
    day: 'День 7+',
    focus: 'Переход к устойчивому режиму',
    meals: [
      'Сбалансированные тарелки: овощи + белок + сложные углеводы.',
      'Контроль объема порций еще 3-5 дней.',
      'Алкоголь и ультрапереработанная еда лучше отложить.',
    ],
  },
];

const STOP_SCALE = [
  { label: 'Легкая слабость', value: 28, note: 'наблюдаем' },
  { label: 'Выраженное головокружение', value: 58, note: 'уменьшаем нагрузку' },
  { label: 'Отеки/тахикардия', value: 88, note: 'остановка и помощь' },
  { label: 'Рвота/непереносимость воды', value: 92, note: 'срочно к врачу' },
];

const EXIT_ERRORS = [
  'Сразу есть много, «отыгрывая» период голода.',
  'Начинать выход с сладкого, выпечки и больших порций фруктовых соков.',
  'Игнорировать отеки, сердцебиение и нарастающую слабость.',
  'Возвращать тяжелые тренировки в первые дни выхода.',
  'Путать легкий дискомфорт адаптации с безопасностью при явных красных флагах.',
];

const EXIT_CHECKLIST = [
  'Я знаю, какая длительность голодания у меня была и какой план выхода ей соответствует.',
  'У меня заранее подготовлена простая еда для первых 2-3 суток.',
  'Я придерживаюсь микропорций и пауз между приемами.',
  'Я контролирую симптомы и прекращаю протокол при тревожных признаках.',
  'При факторах риска я выхожу только под медицинским наблюдением.',
];

const EXIT_SOURCES = [
  {
    label: 'NICE CG32: Nutrition support for adults - критерии риска рефидинг-синдрома.',
    href: 'https://www.nice.org.uk/guidance/cg32/chapter/recommendations',
  },
  {
    label: 'ASPEN Consensus Recommendations for Refeeding Syndrome (2020).',
    href: 'https://pubmed.ncbi.nlm.nih.gov/32115791/',
  },
  {
    label: 'Refeeding syndrome: what it is, and how to prevent and treat it (BMJ, 2008).',
    href: 'https://www.bmj.com/content/336/7659/1495',
  },
  {
    label: 'AuSPEN Consensus Statements on Refeeding Syndrome (2025).',
    href: 'https://pubmed.ncbi.nlm.nih.gov/40090863/',
  },
];

export const howToExit: Article = {
  id: 'how-to-exit',
  title: 'Как правильно выходить из голодания: большой безопасный протокол',
  category: 'Безопасность',
  summary:
    'Подробный сценарий возврата питания после голодания: окно риска, микропорции, планы по длительности протокола, тревожные сигналы и ошибки.',
  imageUrl: '/images/articles/2.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Выход из голодания - это отдельный этап практики, а не «последний пункт». Именно в первые дни после возврата еды
          формируется итог: либо мягкая адаптация, либо резкие скачки сахара, отеки, слабость и срыв режима. Чем дольше было
          голодание, тем медленнее и аккуратнее должен быть выход.
        </ArticleLead>
        <ArticleCallout tone="warning" title="Ключевая мысль">
          Главная ошибка - возвращать питание слишком быстро. Физиология после голода не любит резких переходов.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему выход требует дисциплины</ArticleHeading>
        <ArticleParagraph>
          На фоне длительного ограничения питания меняется гормональный и электролитный контур. Резкое повышение калорийности,
          особенно за счет быстрых углеводов, может создавать опасный сдвиг по фосфору, магнию и калию. В клинической
          практике это описывают как рефидинг-синдром.
        </ArticleParagraph>
        <ArticleProgressChart items={REFEED_RISK_WINDOW} />
        <p className="text-[12px] text-[color:var(--article-muted)]">
          Практический вывод: первые 24-72 часа - самый осторожный этап.
        </p>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Кому нужен медицинский формат выхода</ArticleHeading>
        <ArticleCallout tone="warning" title="Группа повышенного риска">
          <ArticleList
            items={[
              'Отсутствие полноценного питания более 10 дней.',
              'Значимая потеря веса за последние месяцы или выраженный дефицит массы тела.',
              'Низкие показатели калия, магния или фосфора до возобновления питания.',
              'Сопутствующие состояния и терапия, повышающие риск осложнений.',
            ]}
          />
        </ArticleCallout>
        <ArticleCallout tone="info" title="Что обычно делают в клинике">
          Мягкий старт калорий, тиамин и мониторинг электролитов в ранние дни. Это снижает вероятность критических осложнений
          и позволяет корректировать питание по динамике состояния.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>4 правила правильного выхода</ArticleHeading>
        <ArticleSteps
          items={REFEED_RULES.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Шкала плотности еды</ArticleHeading>
        <ArticleParagraph>
          Правильный выход - это постепенный переход по текстуре: жидкости, пюре, мягкая твердая еда, затем обычные блюда.
          Такой алгоритм снижает нагрузку на ЖКТ и помогает держать стабильное самочувствие.
        </ArticleParagraph>
        <ArticleProgressChart items={FOOD_TEXTURE_SCALE} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Первые сутки: ритм, который работает</ArticleHeading>
        <ArticleParagraph>
          В первые 24 часа нет задачи «наесть калории». Есть задача вернуть переваривание спокойно, без боли, тошноты и
          скачков. Ритм, паузы и температура еды важнее разнообразия.
        </ArticleParagraph>
        <ArticleProgressChart items={FIRST_DAY_RHYTHM} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>План выхода после короткого голодания (24-48 часов)</ArticleHeading>
        <div className="space-y-4">
          {SHORT_FAST_EXIT.map(step => (
            <ArticleSurface key={step.stage} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{step.stage}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">{step.focus}</span>
              </div>
              <ArticleCallout tone="success" title="Что есть">
                <ArticleList items={step.menu} className="space-y-2" />
              </ArticleCallout>
              <ArticleCallout tone="warning" title="Контроль">
                <ArticleList items={step.control} className="space-y-2" />
              </ArticleCallout>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>План выхода после длительного голодания (5-7+ дней)</ArticleHeading>
        <ArticleParagraph>
          Для длинного протокола скорость возврата должна быть ниже. Здесь важна не «идеальная» еда, а медленный и
          предсказуемый темп.
        </ArticleParagraph>
        <div className="space-y-4">
          {LONG_FAST_EXIT.map(day => (
            <ArticleSurface key={day.day} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">{day.focus}</span>
              </div>
              <ArticleList items={day.meals} />
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Красные флаги: когда выход нужно остановить</ArticleHeading>
        <ArticleParagraph>
          Легкий дискомфорт возможен, но выраженные симптомы не являются «нормальной адаптацией». Ниже - ориентир по степени
          риска, когда лучше сразу подключать медицинскую помощь.
        </ArticleParagraph>
        <ArticleProgressChart items={STOP_SCALE} />
        <ArticleCallout tone="warning" title="Срочно за помощью">
          <ArticleList
            items={[
              'Одышка, боли в груди, учащенное сердцебиение.',
              'Быстро растущие отеки или резкая слабость.',
              'Рвота, невозможность удерживать воду/еду.',
              'Спутанность сознания, выраженное головокружение.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Типичные ошибки на выходе</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={EXIT_ERRORS} />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Финальный чек-лист безопасного выхода</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={EXIT_CHECKLIST} />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading as="h3">Источники</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={EXIT_SOURCES.map(source => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                {source.label}
              </a>
            ))}
          />
        </ArticleSurface>
      </ArticleSection>
    </div>
  ),
};
