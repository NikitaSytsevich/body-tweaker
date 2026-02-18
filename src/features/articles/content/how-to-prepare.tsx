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

const PREP_LOAD_CURVE = [
  { label: 'День -7', value: 90, note: 'фиксируем режим' },
  { label: 'День -6', value: 80, note: 'чистим рацион' },
  { label: 'День -5', value: 68, note: 'снижаем кофеин' },
  { label: 'День -4', value: 58, note: 'убираем пищевой шум' },
  { label: 'День -3', value: 45, note: 'легкая структура дня' },
  { label: 'День -2', value: 32, note: 'подготовка ЖКТ' },
  { label: 'День -1', value: 20, note: 'мягкий вход' },
];

const START_DAY_PROTOCOL = [
  { label: 'Утро', value: 30, note: 'вода + спокойный темп' },
  { label: 'День', value: 50, note: 'минимум стресса' },
  { label: 'Вечер', value: 70, note: 'оценка самочувствия' },
  { label: 'Ночь', value: 40, note: 'ранний сон' },
];

const PREP_STEPS = [
  {
    title: 'Сначала безопасность, потом амбиции',
    text: 'Определите противопоказания до старта: беременность, активные хронические состояния, низкий вес, эпизоды расстройств пищевого поведения, диабет с терапией, требующей отдельного протокола.',
  },
  {
    title: 'Стабилизируйте ритм сна',
    text: 'За 5-7 дней до старта выровняйте время отхода ко сну. Подготовка работает лучше, когда нервная система не живет в режиме дефицита сна.',
  },
  {
    title: 'Упростите еду, а не обнуляйте ее резко',
    text: 'Уберите переедание и тяжелые сочетания, оставьте простые блюда из цельных продуктов. Резкая голодовка на фоне хаотичного рациона почти всегда переносится хуже.',
  },
  {
    title: 'Снижайте стимуляторы ступенчато',
    text: 'Кофеин, никотин и избыток сахара лучше уменьшать постепенно. Это снижает риск головной боли, раздражительности и ложного чувства «непереносимости» протокола.',
  },
  {
    title: 'Планируйте выход заранее',
    text: 'Подготовка без сценария выхода - неполный протокол. До старта заранее определите, чем и в какой последовательности вы будете возвращать питание.',
  },
];

const PREP_WEEK_PLAN = [
  {
    day: 'День -7',
    focus: 'Стабильность',
    nutrition: [
      'Завтрак: каша + ягоды/фрукты + вода.',
      'Обед: крупа + овощи + умеренный белок.',
      'Ужин: теплое овощное блюдо, без поздних перекусов.',
    ],
    routine: [
      'Вода: 30-35 мл/кг.',
      'Сон: фиксируем время отхода.',
      'Активность: 30-40 минут ходьбы.',
    ],
    avoid: ['Переедание вечером', 'Алкоголь'],
  },
  {
    day: 'День -6',
    focus: 'Чистый рацион',
    nutrition: [
      'Убираем фастфуд, жареное и избыток сладкого.',
      'Добавляем супы, тушеные овощи, мягкие гарниры.',
      'Белок оставляем умеренно, без тяжести.',
    ],
    routine: [
      'Соль без избытка.',
      'Последний прием пищи за 3-4 часа до сна.',
      'Легкая прогулка после ужина.',
    ],
    avoid: ['Новые БАДы в высоких дозах', 'Интенсивные вечерние тренировки'],
  },
  {
    day: 'День -5',
    focus: 'Снижение кофеина',
    nutrition: [
      'Сохраняем простые теплые блюда.',
      'Клетчатка умеренная, без перегруза кишечника.',
      'Сладкое заменяем фруктами в контролируемом объеме.',
    ],
    routine: [
      'Кофеин: минус 25-30% от привычного.',
      'Экранное время вечером сокращаем на 1 час.',
      'Добавляем 10 минут спокойного дыхания перед сном.',
    ],
    avoid: ['Энергетики', 'Крепкий кофе после 14:00'],
  },
  {
    day: 'День -4',
    focus: 'Антивоспалительный режим',
    nutrition: [
      'Супы, каши, тушеные овощи как база.',
      'Минимум сильно обработанных продуктов.',
      'Нормальный, но не высокий объем еды.',
    ],
    routine: [
      'Контроль стрессовых триггеров: новости/перегруз.',
      'Гидратация равномерно в течение дня.',
      'Планируем «спокойный день 0» в календаре.',
    ],
    avoid: ['Поздний плотный ужин', 'Частые сладкие перекусы'],
  },
  {
    day: 'День -3',
    focus: 'Снижение пищевой плотности',
    nutrition: [
      'Больше мягких блюд и жидких форм.',
      'Меньше сложных многокомпонентных ужинов.',
      'Жирные тяжелые блюда убираем.',
    ],
    routine: [
      'Кофеин: не более 1 небольшой порции утром.',
      'Сон: цель 7.5-8 часов.',
      'Легкая растяжка/йога без усилия.',
    ],
    avoid: ['Силовые PR-тренировки', 'Пищевые эксперименты'],
  },
  {
    day: 'День -2',
    focus: 'Подготовка ЖКТ',
    nutrition: [
      'Овощной бульон, каши на воде, мягкие овощи.',
      'По переносимости - печеные фрукты.',
      'Порции меньше обычных.',
    ],
    routine: [
      'Никакого алкоголя и ночных перекусов.',
      'Проверяем рабочий график на день старта.',
      'Собираем воду и легкий план активности.',
    ],
    avoid: ['Острое/жареное', 'Избыток соли'],
  },
  {
    day: 'День -1',
    focus: 'Мягкий вход',
    nutrition: [
      'Теплые жидкие или полужидкие блюда.',
      'Последний прием пищи ранний и спокойный.',
      'Никаких «прощальных застолий».',
    ],
    routine: [
      'Кофеин: 0.',
      'Максимум восстановления и спокойного темпа.',
      'Подготовка чек-листа сигналов остановки.',
    ],
    avoid: ['Ночные дедлайны', 'Сильная эмоциональная перегрузка'],
  },
];

const PREP_ERRORS = [
  'Резко перейти из хаотичного питания в строгий протокол за 1 день.',
  'Начинать голодание в период недосыпа или на фоне конфликта/перегруза.',
  'Игнорировать лекарства, которые требуют еды.',
  'Пытаться «пересидеть» выраженное ухудшение самочувствия.',
  'Не иметь плана мягкого выхода из голодания.',
];

const READY_CHECKLIST = [
  'Я понимаю цель протокола и его продолжительность.',
  'Я исключил очевидные противопоказания или согласовал протокол с врачом.',
  'Я заранее снизил кофеин, наладил сон и убрал пищевой хаос.',
  'У меня есть простой план дня старта и план выхода.',
  'Я знаю красные флаги, при которых прекращаю практику.',
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
  {
    label: 'Commissati et al. Prolonged fasting and transient inflammatory response (Molecular Metabolism, 2025).',
    href: 'https://pubmed.ncbi.nlm.nih.gov/40268190/',
  },
];

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как правильно подготовиться к голоданию: большой практический протокол',
  category: 'Гайд',
  summary:
    'Пошаговая подготовка без резких срывов: безопасность, режим, питание, кофеин, график на 7 дней, день старта и чек-лист готовности.',
  imageUrl: '/images/articles/new/IMG_0413.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Хорошее голодание начинается не в день старта, а за неделю до него. Цель подготовки проста: уменьшить метаболический
          шум, стабилизировать нервную систему и подойти к первому дню без резких качелей по голоду, энергии и настроению.
          Чем чище вход, тем мягче сам протокол и тем легче выход.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Логика подготовки: снижаем нагрузку, сохраняем контроль</ArticleHeading>
        <ArticleParagraph>
          Подготовка - это не «диета перед диетой». Это управляемое снижение пищевой и стрессовой нагрузки. Если за 7 дней вы
          выравниваете сон, убираете пищевые перегибы и снижаете стимуляторы, старт проходит заметно ровнее: меньше головной
          боли, меньше тяги к быстрым углеводам, меньше импульсивных срывов.
        </ArticleParagraph>
        <ArticleProgressChart items={PREP_LOAD_CURVE} />
        <ArticleCallout tone="info" title="Главный принцип недели">
          Не делайте резких движений. Мягкая последовательность почти всегда эффективнее, чем строгий «идеальный» план, который
          ломается на второй день.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Перед стартом: медицинский фильтр</ArticleHeading>
        <ArticleParagraph>
          Самостоятельный старт уместен только при низком риске. Если есть сомнения по состоянию здоровья, сначала обсуждение с
          врачом. Это не формальность: именно на этапе отбора предотвращается большая часть осложнений.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Когда нельзя стартовать самостоятельно">
          <ArticleList
            items={[
              'Беременность и грудное вскармливание.',
              'Диабет на инсулине или препаратах с риском гипогликемии без персонального плана.',
              'Выраженный дефицит массы тела, недавняя значимая потеря веса, дефицитные состояния.',
              'Текущие или прошлые расстройства пищевого поведения.',
              'Нестабильные заболевания сердца, почек, печени, ЖКТ или эндокринной системы.',
            ]}
          />
        </ArticleCallout>
        <ArticleCallout tone="neutral" title="Практический минимум перед стартом">
          Проверьте список лекарств, которые принимаете ежедневно. Если препарат нужно принимать с едой, это должно быть
          заранее учтено в протоколе, а не решаться в момент ухудшения самочувствия.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>5 опорных шагов подготовки</ArticleHeading>
        <ArticleSteps
          items={PREP_STEPS.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Большой план на 7 дней</ArticleHeading>
        <ArticleParagraph>
          Ниже - рабочая схема, которую можно адаптировать под ваш график. Ключевая идея: каждый день немного снижать
          метаболическую и поведенческую турбулентность, а не пытаться сделать все идеально за один вечер.
        </ArticleParagraph>
        <div className="space-y-4">
          {PREP_WEEK_PLAN.map(day => (
            <ArticleSurface key={day.day} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">{day.focus}</span>
              </div>

              <ArticleCallout tone="success" title="Питание">
                <ArticleList items={day.nutrition} className="space-y-2" />
              </ArticleCallout>

              <ArticleCallout tone="info" title="Режим и поведение">
                <ArticleList items={day.routine} className="space-y-2" />
              </ArticleCallout>

              <ArticleCallout tone="warning" title="Что не делать">
                <ArticleList items={day.avoid} className="space-y-2" />
              </ArticleCallout>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>День старта: сценарий без спешки</ArticleHeading>
        <ArticleParagraph>
          В день 0 важно не «доказать силу воли», а поддерживать управляемый ритм. Чем спокойнее поведение, тем точнее вы
          отличите нормальную адаптацию от симптомов, при которых нужно остановиться.
        </ArticleParagraph>
        <ArticleProgressChart items={START_DAY_PROTOCOL} />
        <ArticleList
          items={[
            'Утро: вода, медленный темп, без информационной перегрузки.',
            'День: прогулка, дыхательные практики, умеренная бытовая активность.',
            'Вечер: контроль самочувствия (пульс, давление, слабость, головокружение).',
            'Ночь: ранний сон и минимум стимулов.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Частые ошибки, которые ломают подготовку</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={PREP_ERRORS} />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Финальный чек-лист готовности</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={READY_CHECKLIST} />
        </ArticleSurface>
        <ArticleCallout tone="success" title="Практическое правило">
          Если по чек-листу выполнено меньше 4 пунктов из 5, лучше перенести старт на несколько дней и доработать подготовку.
          Это почти всегда лучше, чем идти в протокол на фоне хаоса.
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
