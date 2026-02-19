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

const READINESS_AREAS = [
  { label: 'Сон', value: 80, note: 'цель: 7.5-8 ч' },
  { label: 'Стресс', value: 65, note: 'снижаем нагрузку' },
  { label: 'Питание', value: 70, note: 'убираем хаос' },
  { label: 'Стимуляторы', value: 55, note: 'кофеин/никотин вниз' },
  { label: 'Режим дня', value: 75, note: 'фиксируем ритм' },
];

const LOAD_REDUCTION_CURVE = [
  { label: 'День -7', value: 90, note: 'стабилизация' },
  { label: 'День -6', value: 80, note: 'чистим рацион' },
  { label: 'День -5', value: 70, note: 'минус стимуляторы' },
  { label: 'День -4', value: 58, note: 'меньше пищевого шума' },
  { label: 'День -3', value: 45, note: 'легкий режим' },
  { label: 'День -2', value: 32, note: 'мягкое меню' },
  { label: 'День -1', value: 22, note: 'вход без перегруза' },
];

const DAY_ZERO_RHYTHM = [
  { label: 'Утро', value: 30, note: 'вода и спокойный старт' },
  { label: 'День', value: 50, note: 'низкий стресс' },
  { label: 'Вечер', value: 65, note: 'контроль самочувствия' },
  { label: 'Ночь', value: 40, note: 'ранний сон' },
];

const PREP_7_DAYS = [
  {
    day: 'День -7',
    focus: 'Зафиксировать базу',
    actions: [
      'Определите длительность первого протокола и дату старта.',
      'Зафиксируйте время сна, подъема и приемов пищи.',
      'Уберите поздние перекусы и алкоголь.',
    ],
  },
  {
    day: 'День -6',
    focus: 'Очистить рацион от перегруза',
    actions: [
      'Снизьте долю ультрапереработанных продуктов.',
      'Оставьте простые блюда: крупа, овощи, умеренный белок.',
      'Перейдите на регулярную воду в течение дня.',
    ],
  },
  {
    day: 'День -5',
    focus: 'Ступенчато снизить стимуляторы',
    actions: [
      'Уменьшите кофеин на 25-30% от привычного уровня.',
      'Сократите никотин и уберите энергетики.',
      'Перенесите интенсивные тренировки на более легкий режим.',
    ],
  },
  {
    day: 'День -4',
    focus: 'Снизить воспалительный фон',
    actions: [
      'Минимизируйте жареное, избыток сахара и соли.',
      'Сместите рацион в сторону теплых и простых блюд.',
      'Добавьте 20-30 минут спокойной прогулки.',
    ],
  },
  {
    day: 'День -3',
    focus: 'Упростить текстуру еды',
    actions: [
      'Делайте ужин легче и раньше.',
      'Снижайте объем порций без резких ограничений.',
      'Проверьте рабочий календарь на день старта.',
    ],
  },
  {
    day: 'День -2',
    focus: 'Подготовить ЖКТ',
    actions: [
      'Оставьте мягкие блюда: супы, тушеные овощи, каши на воде.',
      'Исключите пищевые эксперименты и острую еду.',
      'Сон не меньше 7.5 часов.',
    ],
  },
  {
    day: 'День -1',
    focus: 'Сделать мягкий вход',
    actions: [
      'Кофеин лучше свести к нулю.',
      'Последний прием пищи сделать ранним и легким.',
      'Подготовить план прерывания и план выхода заранее.',
    ],
  },
];

const STOP_PROTOCOL = [
  {
    title: 'Остановитесь без резких решений',
    text: 'Если самочувствие ухудшается, не продолжайте «через силу». Прекращение протокола - это часть безопасности, а не провал.',
  },
  {
    title: 'Верните питание мягко',
    text: 'Начните с теплой воды и небольших порций мягкой еды. Не компенсируйте пропущенное большим приемом пищи.',
  },
  {
    title: 'Оцените симптомы в динамике',
    text: 'Если выраженная слабость, тахикардия, головокружение или ухудшение нарастает, нужен очный медицинский контакт.',
  },
  {
    title: 'Скорректируйте следующий протокол',
    text: 'Пересмотрите длительность, уровень стресса и качество подготовки. Следующая попытка должна быть легче и короче.',
  },
];

const READY_CHECKLIST = [
  'Я понимаю свою цель и выбрал формат голодания под эту цель.',
  'У меня нет явных противопоказаний, либо есть согласование с врачом.',
  'Сон и режим за последние 5-7 дней были стабильными.',
  'Я снизил кофеин/никотин и убрал тяжелую пищевую нагрузку.',
  'У меня есть готовый план дня старта и план выхода.',
  'Я знаю тревожные сигналы, при которых прекращаю протокол.',
];

const PREP_ERRORS = [
  'Начинать на фоне недосыпа, конфликта или рабочих перегрузок.',
  'Резко обнулить питание после нескольких дней переедания.',
  'Игнорировать лекарства, которые нужно принимать с едой.',
  'Пытаться «перетерпеть» явное ухудшение самочувствия.',
  'Не подготовить план безопасного выхода заранее.',
];

const PREP_SOURCES = [
  {
    label:
      'Semnani-Azad et al. Intermittent fasting strategies and continuous energy restriction for adults with overweight and obesity (BMJ, 2025).',
    href: 'https://www.bmj.com/content/389/bmj-2024-082007.long',
  },
  {
    label:
      'Manoogian et al. Time-Restricted Eating in Adults With Metabolic Syndrome (Annals of Internal Medicine, 2024).',
    href: 'https://pubmed.ncbi.nlm.nih.gov/39348690/',
  },
  {
    label:
      'Catenacci et al. Effect of 4:3 Intermittent Fasting on Weight Loss at 12 Months (Annals of Internal Medicine, 2025).',
    href: 'https://www.acpjournals.org/doi/10.7326/ANNALS-24-01631',
  },
  {
    label: 'AuSPEN Consensus Statements on Refeeding Syndrome (Nutrition & Dietetics, 2025).',
    href: 'https://pubmed.ncbi.nlm.nih.gov/40090863/',
  },
];

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как правильно подготовиться к голоданию: системный протокол перед стартом',
  category: 'Гайд',
  summary:
    'Новая структура подготовки: фильтр риска, выбор формата под цель, самодиагностика, пошаговый план на 7 дней, сценарий дня 0 и чек-лист готовности.',
  imageUrl: '/images/articles/new/IMG_0413.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Подготовка к голоданию нужна не для "идеальности", а для предсказуемости. Ее задача - снизить резкие
          колебания аппетита, энергии и настроения, чтобы вы стартовали из стабильного состояния, а не из перегруза.
          Чем лучше подготовлен вход, тем легче сам протокол и тем безопаснее выход.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>1. Что вы получите от подготовки</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Более ровное самочувствие в первые сутки и меньше импульсивной тяги к еде.',
              'Понятные правила поведения в день старта вместо хаотичных решений.',
              'Ниже риск преждевременного срыва из-за недосыпа, кофеиновой отмены и стрессовой перегрузки.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>2. Кому можно стартовать, а кому нужен врач</ArticleHeading>
        <ArticleCallout tone="warning" title="Без самостоятельного старта">
          <ArticleList
            items={[
              'Беременность и грудное вскармливание.',
              'Диабет с терапией, требующей индивидуального плана питания.',
              'Выраженный дефицит массы тела или недавняя значимая потеря веса.',
              'Текущие или прошлые эпизоды расстройств пищевого поведения.',
              'Нестабильные заболевания сердца, почек, печени, ЖКТ и эндокринной системы.',
            ]}
          />
        </ArticleCallout>
        <ArticleParagraph>
          Если есть сомнения по безопасности, правильный шаг - не "попробовать осторожно", а заранее согласовать
          протокол с врачом.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>3. Выбор формата под цель</ArticleHeading>
        <ArticleSurface className="space-y-3">
          <ArticleList
            items={[
              <>
                <strong>Цель: мягкая метаболическая дисциплина.</strong> Начните с коротких форматов (например,
                ограничение пищевого окна), а не с длительных протоколов.
              </>,
              <>
                <strong>Цель: снижение веса.</strong> Выбирайте формат, который сможете удерживать неделями, а не
                самый жесткий.
              </>,
              <>
                <strong>Цель: психологический контроль над питанием.</strong> Сначала стабилизируйте сон и стресс,
                затем подключайте ограничения.
              </>,
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>4. Самодиагностика перед стартом</ArticleHeading>
        <ArticleParagraph>
          Оцените пять зон: сон, стресс, рацион, стимуляторы и режим. Если хотя бы две зоны в "красной" области,
          лучше взять еще 2-4 дня подготовки.
        </ArticleParagraph>
        <ArticleProgressChart items={READINESS_AREAS} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>5. Принцип подготовки: уменьшаем физиологический шум</ArticleHeading>
        <ArticleParagraph>
          Под "шумом" понимаются поздние плотные ужины, скачки кофеина, недосып, неровный график и стрессовые пики.
          Подготовка не требует сложных схем: она требует регулярности и постепенности.
        </ArticleParagraph>
        <ArticleProgressChart items={LOAD_REDUCTION_CURVE} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>6. Пошаговый план на 7 дней</ArticleHeading>
        <div className="space-y-4">
          {PREP_7_DAYS.map(day => (
            <ArticleSurface key={day.day} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">{day.focus}</span>
              </div>
              <ArticleList items={day.actions} />
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>7. Подготовка за 24 часа до старта</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Оставьте только понятную и легкую еду, без пищевых экспериментов.',
              'Сведите стимуляторы к минимуму, исключите алкоголь.',
              'Уберите перегруженные встречи и интенсивные тренировки на следующий день.',
              'Подготовьте воду, простой план активности и список сигналов остановки.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>8. День 0: рабочий сценарий</ArticleHeading>
        <ArticleParagraph>
          В день старта не нужно проверять себя на прочность. Ваша задача - держать стабильный ритм и наблюдать
          реакцию организма.
        </ArticleParagraph>
        <ArticleProgressChart items={DAY_ZERO_RHYTHM} />
        <ArticleList
          items={[
            'Утро: вода, спокойное начало, без спешки и перегруза информацией.',
            'День: легкая ходьба, умеренная активность, без интенсивного спорта.',
            'Вечер: проверка самочувствия, давления, пульса, уровня слабости.',
            'Ночь: ранний отбой для уменьшения кортизоловой нагрузки.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>9. Нормальная адаптация и тревожные сигналы</ArticleHeading>
        <ArticleSurface className="space-y-4">
          <ArticleCallout tone="success" title="Обычно допустимо">
            <ArticleList
              items={[
                'Умеренное чувство голода в привычные часы приема пищи.',
                'Легкая усталость в первую половину адаптации.',
                'Временное снижение концентрации без прогрессирующего ухудшения.',
              ]}
            />
          </ArticleCallout>
          <ArticleCallout tone="warning" title="Повод прекратить протокол и оценить состояние">
            <ArticleList
              items={[
                'Нарастающее головокружение, выраженная слабость, предобморочное состояние.',
                'Учащенное сердцебиение, боли в груди, одышка.',
                'Стойкая тошнота, рвота или невозможность удерживать воду.',
              ]}
            />
          </ArticleCallout>
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>10. План безопасного прерывания</ArticleHeading>
        <ArticleSteps
          items={STOP_PROTOCOL.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>11. Частые ошибки подготовки</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={PREP_ERRORS} />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>12. Финальный чек-лист перед стартом</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={READY_CHECKLIST} />
        </ArticleSurface>
        <ArticleCallout tone="info" title="Правило запуска">
          Если по чек-листу у вас меньше 5 пунктов из 6, лучше отложить старт на 2-3 дня и добрать подготовку.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading as="h3">Источники</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={PREP_SOURCES.map(source => (
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
