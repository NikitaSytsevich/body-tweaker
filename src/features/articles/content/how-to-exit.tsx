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

const RISK_WINDOW = [
  { label: '0-24 ч', value: 58, note: 'вход в питание' },
  { label: '24-72 ч', value: 100, note: 'пик риска' },
  { label: '3-5 день', value: 74, note: 'контроль симптомов' },
  { label: '5-7 день', value: 46, note: 'стабилизация' },
];

const TEXTURE_STEPS = [
  { label: 'Этап 1', value: 20, note: 'жидкости' },
  { label: 'Этап 2', value: 38, note: 'полужидкое' },
  { label: 'Этап 3', value: 62, note: 'мягкое твердое' },
  { label: 'Этап 4', value: 84, note: 'обычный рацион' },
];

const FIRST_72_HOURS = [
  { label: '0-12 ч', value: 22, note: 'вода и паузы' },
  { label: '12-24 ч', value: 35, note: 'микропорции' },
  { label: '24-48 ч', value: 50, note: 'мягкие блюда' },
  { label: '48-72 ч', value: 62, note: 'осторожное расширение' },
];

const BASE_RULES = [
  {
    title: 'Микропорции вместо компенсации',
    text: 'Первая ошибка после голодания - есть много сразу. Выход всегда строится на небольших порциях и паузах.',
  },
  {
    title: 'Сначала текстура, потом калорийность',
    text: 'Начинайте с теплой жидкой или полужидкой еды. Твердые и плотные продукты возвращаются только поэтапно.',
  },
  {
    title: 'Углеводы возвращаем плавно',
    text: 'Резкий углеводный всплеск в начале выхода переносится хуже всего. Увеличивайте объем постепенно и наблюдайте реакцию.',
  },
  {
    title: 'Наблюдение - обязательная часть протокола',
    text: 'Следите за самочувствием: пульс, отеки, слабость, тошнота, головокружение. Динамика важнее единичного ощущения.',
  },
];

const PLAN_SHORT = [
  {
    stage: '24-48 часов голодания: первые 24 часа выхода',
    actions: [
      'Теплая вода небольшими порциями, без резкого увеличения объема.',
      'Легкий бульон или суп-пюре в малом количестве.',
      'Паузы 2-3 часа между приемами, без перекусов "на автомате".',
    ],
  },
  {
    stage: '24-48 часов голодания: вторые сутки выхода',
    actions: [
      'Добавьте кашу на воде и мягкие овощи.',
      'Порции умеренные, без "догоняющего" приема пищи.',
      'Сохраняйте низкую пищевую плотность до стабильного самочувствия.',
    ],
  },
];

const PLAN_MEDIUM = [
  {
    stage: '3-5 дней голодания: день 1',
    actions: [
      'Только жидкие и полужидкие формы еды.',
      'Соль и сахар минимальны.',
      'Никакого тяжелого жира и больших порций.',
    ],
  },
  {
    stage: '3-5 дней голодания: день 2-3',
    actions: [
      'Постепенно вводите мягкие твердые блюда.',
      'Сохраняйте дробный режим и паузы.',
      'Контролируйте отеки, пульс и переносимость еды.',
    ],
  },
  {
    stage: '3-5 дней голодания: день 4-5',
    actions: [
      'Осторожно возвращайте белок в небольших объемах.',
      'Сохраняйте простые сочетания без перегруза ЖКТ.',
      'Не возвращайтесь к избыточному объему порций.',
    ],
  },
];

const PLAN_LONG = [
  {
    stage: '7+ дней голодания: день 1-2',
    actions: [
      'Старт только с мягких жидких и полужидких блюд.',
      'Микропорции с длинными паузами и наблюдением симптомов.',
      'При малейших тревожных признаках - остановка и медицинская оценка.',
    ],
  },
  {
    stage: '7+ дней голодания: день 3-5',
    actions: [
      'Медленное расширение текстуры и объема.',
      'Белок возвращать постепенно и в малых дозах.',
      'Никаких интенсивных тренировок и стрессовой нагрузки.',
    ],
  },
  {
    stage: '7+ дней голодания: день 6-7 и далее',
    actions: [
      'Переход к базовому сбалансированному рациону без резких скачков.',
      'Контроль веса, отеков и общего тонуса.',
      'Сохранение умеренных порций еще минимум 3-5 дней.',
    ],
  },
];

const RED_FLAGS = [
  'Нарастающая выраженная слабость и предобморочные состояния.',
  'Отеки, учащенное сердцебиение, боль в груди или одышка.',
  'Сильная тошнота, рвота, невозможность удерживать воду.',
  'Спутанность сознания, резкое ухудшение концентрации.',
];

const EXIT_ERRORS = [
  'Первый прием пищи делать большим и плотным.',
  'Начинать выход с сладкого, выпечки, избытка фруктовых соков.',
  'Быстро возвращать интенсивный спорт и дефицит сна.',
  'Игнорировать нарастающие тревожные симптомы.',
  'Считать, что "само пройдет", если стало заметно хуже.',
];

const EXIT_CHECKLIST = [
  'Я знаю длительность своего голодания и выбрал соответствующий план выхода.',
  'Я начинаю с микропорций и увеличиваю объем постепенно.',
  'Я контролирую самочувствие в первые 72 часа особенно внимательно.',
  'Я понимаю красные флаги и готов остановиться при их появлении.',
  'При факторах риска я выбираю медицинский формат выхода.',
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
  title: 'Правильный выход из голодания: поэтапный протокол без срывов',
  category: 'Безопасность',
  summary:
    'Новая структура выхода: окно риска, этапность по текстуре и объему, планы для разной длительности голодания, красные флаги и финальный чек-лист.',
  imageUrl: '/images/articles/2.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Выход из голодания - это не финальная формальность, а главный этап безопасности. Ошибки на выходе чаще
          ломают результат, чем ошибки на старте. Поэтому в этой статье логика простая: сначала контроль риска,
          потом постепенный возврат питания, и только затем переход к обычному рациону.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>1. Почему выход важнее входа</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Во время выхода организм заново перестраивает обмен на внешнее питание.',
              'Резкий рост калорийности и углеводов может переноситься тяжело.',
              'Плавный сценарий снижает риск осложнений и отката в пищевой хаос.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>2. Кому выход нужен только под медконтролем</ArticleHeading>
        <ArticleCallout tone="warning" title="Высокий риск">
          <ArticleList
            items={[
              'Отсутствие полноценного питания более 10 дней.',
              'Существенная потеря веса за последние месяцы или выраженный дефицит массы.',
              'Известные нарушения электролитов (калий, магний, фосфор).',
              'Сопутствующие заболевания и терапия, повышающие риск осложнений.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>3. Окно риска: первые 72 часа</ArticleHeading>
        <ArticleParagraph>
          Самые внимательные сутки - первые три дня после возобновления питания. Именно здесь критичны микропорции,
          паузы и наблюдение симптомов.
        </ArticleParagraph>
        <ArticleProgressChart items={RISK_WINDOW} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>4. Четыре базовых правила безопасного выхода</ArticleHeading>
        <ArticleSteps
          items={BASE_RULES.map(rule => (
            <>
              <strong>{rule.title}.</strong> {rule.text}
            </>
          ))}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>5. Схема по этапам: от жидкости к обычной еде</ArticleHeading>
        <ArticleParagraph>
          Думайте не категориями "можно/нельзя", а этапами перехода. Сначала текстура, затем объем, и только потом
          разнообразие.
        </ArticleParagraph>
        <ArticleProgressChart items={TEXTURE_STEPS} />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>6. Первые 72 часа: что делать по шагам</ArticleHeading>
        <ArticleProgressChart items={FIRST_72_HOURS} />
        <ArticleSurface>
          <ArticleList
            items={[
              '0-12 часов: теплая вода, спокойный ритм, никаких больших приемов пищи.',
              '12-24 часа: первая мягкая еда малыми порциями, паузы не менее 2-3 часов.',
              '24-48 часов: осторожное расширение за счет простых мягких блюд.',
              '48-72 часа: только при хорошей переносимости добавляйте новые продукты.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>7. Выход после 24-48 часов голодания</ArticleHeading>
        <div className="space-y-4">
          {PLAN_SHORT.map(step => (
            <ArticleSurface key={step.stage} className="space-y-3">
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{step.stage}</p>
              <ArticleList items={step.actions} />
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>8. Выход после 3-5 дней голодания</ArticleHeading>
        <div className="space-y-4">
          {PLAN_MEDIUM.map(step => (
            <ArticleSurface key={step.stage} className="space-y-3">
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{step.stage}</p>
              <ArticleList items={step.actions} />
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>9. Выход после 7+ дней голодания</ArticleHeading>
        <ArticleCallout tone="warning" title="Критично">
          Чем дольше протокол, тем ниже должна быть скорость возврата питания. При сомнениях в самочувствии не тяните
          с очной консультацией.
        </ArticleCallout>
        <div className="space-y-4">
          {PLAN_LONG.map(step => (
            <ArticleSurface key={step.stage} className="space-y-3">
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{step.stage}</p>
              <ArticleList items={step.actions} />
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>10. Красные флаги: когда выход нужно остановить</ArticleHeading>
        <ArticleCallout tone="warning" title="Нужна медицинская помощь">
          <ArticleList items={RED_FLAGS} />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>11. Типичные ошибки на выходе</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={EXIT_ERRORS} />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>12. Финальный чек-лист безопасного завершения</ArticleHeading>
        <ArticleSurface>
          <ArticleList items={EXIT_CHECKLIST} />
        </ArticleSurface>
        <ArticleCallout tone="info" title="Правило темпа">
          Если после расширения рациона самочувствие заметно ухудшилось, откатитесь на предыдущий этап текстуры и
          объема на 24 часа, затем повторите попытку мягче.
        </ArticleCallout>
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
