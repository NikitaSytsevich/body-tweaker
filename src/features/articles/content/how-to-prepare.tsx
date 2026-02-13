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

const FASTING_PREP_STEPS = [
  {
    title: 'Оцените риски до старта',
    text: 'При диабете на инсулине/сульфонилмочевине, беременности, низкой массе тела, расстройствах пищевого поведения, активных хронических заболеваниях или приеме препаратов, требующих еды, старт только через врача.',
  },
  {
    title: 'Снизьте стимуляторы заранее',
    text: 'Кофеин и никотин снижают комфорт старта. Плавное уменьшение за 5-7 дней уменьшает головную боль и раздражительность в первый день голода.',
  },
  {
    title: 'Сделайте рацион проще и мягче',
    text: 'Переходите от тяжелой и ультрапереработанной еды к цельным продуктам: овощи, бобовые, цельные крупы, рыба/тофу, кисломолочные по переносимости.',
  },
  {
    title: 'Синхронизируйте сон и питание',
    text: 'Стабильное окно приема пищи и ранний ужин обычно дают более мягкий вход. Сон в последние 3 дня подготовки важнее любой добавки.',
  },
  {
    title: 'Продумайте день старта',
    text: 'Уберите перегруженные встречи и интенсивные тренировки. Первый день лучше проводить в спокойном режиме с прогулками и водой.',
  },
];

const PREP_TIMELINE = [
  { label: 'День -7', value: 92, note: 'убираем хаос в питании' },
  { label: 'День -6', value: 84, note: 'фиксируем режим воды/сна' },
  { label: 'День -5', value: 74, note: 'снижаем кофеин на 25-30%' },
  { label: 'День -4', value: 64, note: 'меньше соли и сладкого' },
  { label: 'День -3', value: 52, note: 'легкий ужин до 19:00-20:00' },
  { label: 'День -2', value: 38, note: 'простые блюда и мягкая клетчатка' },
  { label: 'День -1', value: 24, note: 'минимум пищевой нагрузки' },
];

const RESEARCH_CARDS = [
  {
    title: 'Сравнение форматов голодания',
    source: 'BMJ, 2025 (network meta-analysis, 99 РКИ, n=6582)',
    quote: '"All intermittent fasting and continuous energy restriction strategies reduced body weight when compared with ad-libitum diet."',
    href: 'https://www.bmj.com/content/389/bmj-2024-082007.long',
    note: 'Вывод: формат можно выбирать по удобству и устойчивости, а не по обещаниям «магического» эффекта.',
  },
  {
    title: 'TRE при метаболическом синдроме',
    source: 'Annals of Internal Medicine, 2024',
    quote: '"Personalized 8- to 10-hour TRE ... modestly improves glycemic regulation."',
    href: 'https://pubmed.ncbi.nlm.nih.gov/39348690/',
    note: 'Практика: фиксированное пищевое окно (8-10 часов) может быть мягким стартом перед более длительным протоколом.',
  },
  {
    title: '4:3 режим и приверженность',
    source: 'Annals of Internal Medicine, 2025 (12 месяцев, РКИ)',
    quote: '"4:3 IMF resulted in modestly greater weight loss ... at 12 months."',
    href: 'https://www.acpjournals.org/doi/10.7326/ANNALS-24-01631',
    note: 'Практика: заранее продуманные «легкие дни» помогают удерживать режим дольше.',
  },
];

const PREP_PLAN_7_DAYS = [
  {
    day: 'День -7',
    focus: 'Старт без стресса',
    breakfast: 'Овсянка на воде/молоке 1:1, ягоды, 1 ч. л. семян льна.',
    lunch: 'Гречка, запеченные овощи, индейка/тофу, зелень.',
    dinner: 'Овощной суп-пюре + тост цельнозерновой.',
    extras: [
      'Вода: 30-35 мл/кг в сутки.',
      'Кофеин: оставьте привычный уровень, зафиксируйте базу.',
      'Активность: 30-40 минут ходьбы.',
    ],
  },
  {
    day: 'День -6',
    focus: 'Режим и стабильность',
    breakfast: 'Йогурт без сахара/кефир + яблоко + горсть орехов.',
    lunch: 'Чечевичный суп, салат из овощей с оливковым маслом.',
    dinner: 'Рис + тушеные кабачок/морковь + рыба/темпе.',
    extras: [
      'Сон: отбой на 30-45 минут раньше.',
      'Соль: не досаливать готовую еду.',
      'Алкоголь: полный стоп.',
    ],
  },
  {
    day: 'День -5',
    focus: 'Минус стимуляторы',
    breakfast: 'Гречневая каша, груша, травяной чай.',
    lunch: 'Киноа/булгур, овощи, фасоль или нут.',
    dinner: 'Теплый салат из овощей и листовой зелени.',
    extras: [
      'Кофеин: минус 25-30% от обычной дозы.',
      'Сладкое: заменить на фрукты 1-2 порции.',
      'Экран вечером: меньше на 1 час перед сном.',
    ],
  },
  {
    day: 'День -4',
    focus: 'Антивоспалительный уклон',
    breakfast: 'Чиа-пудинг/овсянка + ягоды.',
    lunch: 'Овощное рагу + порция бобовых.',
    dinner: 'Запеченная цветная капуста + йогуртовый соус без сахара.',
    extras: [
      'Добавьте 1-2 порции ферментированных продуктов (по переносимости).',
      'Кофеин: еще минус 20-25%.',
      'Тренировки: без высокоинтенсивных сессий.',
    ],
  },
  {
    day: 'День -3',
    focus: 'Снижение пищевой плотности',
    breakfast: 'Рисовая каша + банан.',
    lunch: 'Легкий суп + немного крупы + зелень.',
    dinner: 'Тушеные овощи, травяной чай.',
    extras: [
      'Последний прием пищи: за 3-4 часа до сна.',
      'Кофеин: до 1 небольшой порции утром или 0.',
      'Шаги: спокойная прогулка после ужина 20-30 минут.',
    ],
  },
  {
    day: 'День -2',
    focus: 'Очень легкий рацион',
    breakfast: 'Печеное яблоко + небольшая порция каши.',
    lunch: 'Овощной бульон, мягкие овощи, немного риса.',
    dinner: 'Суп-пюре или рагу без тяжелых жиров.',
    extras: [
      'Исключите жареное, фастфуд, колбасы, избыток клетчатки.',
      'Проверьте план на день старта: вода, график, отсутствие перегруза.',
      'Сон не менее 7.5-8 часов.',
    ],
  },
  {
    day: 'День -1',
    focus: 'Мягкий вход',
    breakfast: 'Теплый травяной чай, мягкий фрукт/небольшая каша.',
    lunch: 'Прозрачный овощной бульон + немного риса (по самочувствию).',
    dinner: 'Либо легкий бульон до 17:00-18:00, либо только вода.',
    extras: [
      'Кофеин: 0.',
      'Только спокойная активность и ранний сон.',
      'Подготовьте «красные флаги», при которых вы прекращаете протокол.',
    ],
  },
];

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как подготовиться к голоданию: научный протокол на 7 дней',
  category: 'Гайд',
  summary:
    'Большой практический план подготовки к голоданию: свежие исследования 2024-2025, безопасность, 7-дневный рацион и чек-лист готовности.',
  imageUrl: '/images/articles/new/IMG_0413.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Подготовка к голоданию определяет результат сильнее, чем сам старт. Главная цель недели перед голоданием: снизить
          физиологический стресс, стабилизировать режим сна и питания, уменьшить стимуляторы и подойти к дню 0 без резких
          качелей по сахару, аппетиту и самочувствию.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что говорят последние исследования (2024-2025)</ArticleHeading>
        <div className="space-y-4">
          {RESEARCH_CARDS.map(card => (
            <ArticleSurface key={card.title} className="space-y-3">
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{card.title}</p>
              <p className="text-[13px] uppercase tracking-[0.18em] text-[color:var(--article-muted)]">{card.source}</p>
              <ArticleCallout tone="neutral" title="Цитата из аннотации">
                <p className="text-[15px] leading-[1.7] text-[color:var(--article-text)]">{card.quote}</p>
              </ArticleCallout>
              <ArticleParagraph className="text-[15px]">{card.note}</ArticleParagraph>
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-[14px] font-medium text-[color:var(--article-accent)] underline"
              >
                Открыть исследование
              </a>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Безопасность перед стартом</ArticleHeading>
        <ArticleParagraph>
          В 2025 году в консенсусе AuSPEN по рефидинг-синдрому отдельно подчеркнуты оценка риска, тиамин/мультивитамины у
          группы риска и мониторинг электролитов при возобновлении питания. Это особенно важно, если в анамнезе есть эпизоды
          недоедания, выраженная потеря веса или сопутствующая терапия.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Кому нельзя начинать самостоятельно">
          <ArticleList
            items={[
              'Беременность и грудное вскармливание.',
              'Диабет на инсулине/сульфонилмочевине без согласованной схемы с врачом.',
              'Низкий ИМТ, недавняя значимая потеря веса, подозрение на дефициты.',
              'Расстройства пищевого поведения сейчас или в анамнезе.',
              'Хронические заболевания в фазе нестабильности (почки, печень, сердце и др.).',
            ]}
          />
        </ArticleCallout>
        <ArticleCallout tone="info" title="Новая важная деталь из исследований 2025">
          В исследовании длительного водного голодания (Molecular Metabolism, 2025) описан транзиторный воспалительный ответ,
          поэтому длительные протоколы без медицинского наблюдения остаются рискованной стратегией.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>5 шагов подготовки за неделю</ArticleHeading>
        <ArticleSteps
          items={FASTING_PREP_STEPS.map(step => (
            <>
              <strong>{step.title}.</strong> {step.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Шкала снижения пищевой нагрузки</ArticleHeading>
        <ArticleParagraph>
          Это визуальный ориентир: каждый день мы немного уменьшаем плотность и стимуляторную нагрузку, чтобы день 0 не стал
          метаболическим «обрывом».
        </ArticleParagraph>
        <ArticleProgressChart items={PREP_TIMELINE} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>План питания на 7 дней до голодания</ArticleHeading>
        <ArticleParagraph>
          План ниже сделан как практичный шаблон: завтрак, обед, ужин и «сторонние приемы» (сон, вода, кофеин, активность).
          Подстройте объем порций под вашу норму и переносимость.
        </ArticleParagraph>
        <div className="space-y-4">
          {PREP_PLAN_7_DAYS.map(day => (
            <ArticleSurface key={day.day} className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{day.day}</p>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--article-muted)]">{day.focus}</span>
              </div>
              <ArticleList
                items={[
                  <>
                    <strong>Завтрак:</strong> {day.breakfast}
                  </>,
                  <>
                    <strong>Обед:</strong> {day.lunch}
                  </>,
                  <>
                    <strong>Ужин:</strong> {day.dinner}
                  </>,
                ]}
              />
              <ArticleCallout tone="success" title="Сторонние приемы">
                <ArticleList items={day.extras} className="space-y-2" />
              </ArticleCallout>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>День 0: аккуратный запуск</ArticleHeading>
        <ArticleList
          items={[
            'Утро без спешки: вода, легкая прогулка, минимум информационной нагрузки.',
            'Тренировки только легкие (ходьба, мобилизация, дыхание).',
            'Оценка самочувствия каждые 3-4 часа: слабость, головокружение, сердцебиение, тревога.',
            'Если состояние ухудшается, протокол нужно прервать безопасно и перейти к мягкому питанию.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Чек-лист готовности</ArticleHeading>
        <ArticleList
          items={[
            'У меня есть понятная цель голодания и план выхода.',
            'Я исключил ключевые риски или согласовал протокол с врачом.',
            'Я снизил кофеин заранее и подготовил спокойный график на день 0.',
            'Я прошел 7-дневный подготовительный рацион без резких срывов.',
            'Я понимаю, при каких симптомах нужно остановиться.',
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading as="h3">Источники (актуальные + базовые)</ArticleHeading>
        <ArticleSurface className="space-y-3">
          <ArticleList
            items={[
              <a
                key="bmj-2025-meta"
                href="https://www.bmj.com/content/389/bmj-2024-082007.long"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Semnani-Azad et al. Intermittent fasting strategies... BMJ, 18 June 2025 (systematic review + network meta-analysis)
              </a>,
              <a
                key="annals-2024-tre-mets"
                href="https://pubmed.ncbi.nlm.nih.gov/39348690/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Manoogian et al. Time-Restricted Eating in Adults With Metabolic Syndrome. Ann Intern Med, 2024
              </a>,
              <a
                key="annals-2025-43"
                href="https://www.acpjournals.org/doi/10.7326/ANNALS-24-01631"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Catenacci et al. The Effect of 4:3 Intermittent Fasting on Weight Loss at 12 Months. Ann Intern Med, 2025
              </a>,
              <a
                key="auspen-2025-refeeding"
                href="https://pubmed.ncbi.nlm.nih.gov/40090863/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                AuSPEN Consensus Statements on Refeeding Syndrome. Nutrition &amp; Dietetics, 2025
              </a>,
              <a
                key="molmetab-2025-pf"
                href="https://pubmed.ncbi.nlm.nih.gov/40268190/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Commissati et al. Prolonged fasting promotes systemic inflammation... Molecular Metabolism, 2025
              </a>,
              <a
                key="nutr-rev-2023-waterfast"
                href="https://pubmed.ncbi.nlm.nih.gov/37377031/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Anton et al. Efficacy and safety of prolonged water fasting. Nutrition Reviews, 2023
              </a>,
              <a
                key="caffeine-review"
                href="https://pubmed.ncbi.nlm.nih.gov/15448977/"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--article-accent)] underline"
              >
                Juliano &amp; Griffiths. A critical review of caffeine withdrawal, 2004 (временная динамика симптомов)
              </a>,
            ]}
          />
        </ArticleSurface>
      </ArticleSection>
    </div>
  ),
};
