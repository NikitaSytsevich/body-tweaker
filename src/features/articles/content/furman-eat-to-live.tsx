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

export const furmanEatToLive: Article = {
  id: 'furman-eat-to-live',
  title: 'Ешь и худей по Фурману',
  category: 'Наука о питании',
  summary: 'Потеря веса через плотность нутриентов. Формула: Здоровье = Нутриенты / Калории. 6-недельный план.',
  imageUrl: '/images/articles/new/IMG_0420.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Доктор Джоэл Фурман — врач, специализирующийся на потере веса и профилактике заболеваний через питание. Его
          подход отличается от большинства диет: вместо подсчёта калорий или ограничений макронутриентов он предлагает
          фокусироваться на плотности микронутриентов.
        </ArticleLead>
        <ArticleCallout tone="success" title="Ключевая формула">
          Фурман предлагает простую формулу: <strong>Здоровье = Нутриенты / Калории</strong>. Продукты с высоким
          соотношением нутриентов к калориям должны составлять основу рациона. Это позволяет съедать больше объёма еды,
          получая меньше калорий и больше полезных веществ.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Плотность нутриентов</ArticleHeading>
        <ArticleParagraph>
          Фурман классифицирует продукты по их «плотности нутриентов» — количеству витаминов, минералов, фитоchemicals
          на единицу калорий.
        </ArticleParagraph>
        <ArticleParagraph className="text-[color:var(--article-text)]">Иерархия продуктов по Фурману</ArticleParagraph>
        <div className="space-y-3">
          {[
            { tier: 'Tier 1: Высокая плотность', foods: 'Зелёные овощи, капуста, салат, шпинат, брокколи' },
            { tier: 'Tier 2: Очень высокая', foods: 'Ягоды, бобовые, другие овощи, цельные зерновые' },
            { tier: 'Tier 3: Умеренная', foods: 'Фрукты, крахмалистые овощи, рыба' },
            { tier: 'Tier 4: Низкая', foods: 'Мясо, молочные продукты, яйца' },
            { tier: 'Tier 5: Очень низкая', foods: 'Масла, сахар, переработанная еда, фастфуд' },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.tier}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.foods}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="success" title="Логика подхода">
          Если вы заполняете желудок продуктами Tier 1 и 2, вы физически не съедите много калорий. Объём еды создаёт
          сытость, а высокая концентрация нутриентов снижает аппетит и улучшает метаболизм.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему обычные диеты не работают</ArticleHeading>
        <ArticleParagraph>
          Фурман критикует популярные подходы к потере веса и объясняет, почему его метод отличается.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              problem: 'Подсчёт калорий',
              critique: 'Ограничивая калории, вы ограничиваете и нутриенты. Организм голодает и замедляет metabolism.',
            },
            {
              problem: 'Низкоуглеводные диеты',
              critique: 'Высокое количество мяса и масел может давать временную потерю веса, но долго не устойчиво.',
            },
            {
              problem: 'Низкожировые диеты',
              critique: 'Замена жиров на сахар и переработанные углеводы не решает проблему дефицита нутриентов.',
            },
            {
              problem: 'Порционный контроль',
              critique: 'Маленькие порции «пустой» еды не насыщают. Вы голодны и сорваетесь.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.problem}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.critique}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="info">
          Фурман утверждает: проблема не в количестве еды, а в её качестве. Когда вы получаете достаточно нутриентов,
          организм сам регулирует аппетит. Вы не чувствуете голода, даже если едите меньше калорий.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>6-недельный план</ArticleHeading>
        <ArticleParagraph>
          Книга содержит детальный 6-недельный план для потери веса. Это не диета, которую вы бросаете через 6 недель
          — переход к новому образу питания.
        </ArticleParagraph>
        <ArticleParagraph className="text-[color:var(--article-text)]">Основные правила плана</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              rule: 'Правило 90/10',
              desc: '90% еды — из Tier 1-3 (растения). 10% можно потратить на продукты с меньшей плотностью нутриентов.',
            },
            {
              rule: 'Неограниченные овощи',
              desc: 'Зелёные и non-starch овощи можно есть в любом количестве. Они создают объём.',
            },
            {
              rule: 'Ограничение масел',
              desc: 'Масла — это калории без нутриентов. Фурман советует резко ограничить или исключить.',
            },
            {
              rule: 'Бобовые каждый день',
              desc: 'Фасоль, чечевица, нут — основной источник белка и клетчатки.',
            },
            {
              rule: 'Фрукты вместо десерта',
              desc: 'Ягоды и фрукты — сладость с витаминами, не пустой сахар.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.rule}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="neutral" title="Пример дня">
          <ArticleList
            items={[
              <>
                <strong>Завтрак:</strong> Овсянка с ягодами и семенами
              </>,
              <>
                <strong>Обед:</strong> Большой салат с бобовыми, овощами, лимонным dressing
              </>,
              <>
                <strong>Ужин:</strong> Овощное рагу с фасолью, цельнозерновой рис
              </>,
              <>
                <strong>Перекусы:</strong> Фрукты, орехи, сырые овощи
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Механизм потери веса</ArticleHeading>
        <ArticleParagraph>Фурман объясняет, почему его подход приводит к потере веса без чувства голода.</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              title: 'Объёмная сытость',
              desc: 'Овощи и фрукты содержат много воды и клетчатки. Они занимают место в желудке, создавая физическое ощущение сытости.',
            },
            {
              title: 'Микронутриентная сытость',
              desc: 'Когда организм получает достаточное количество витаминов и минералов, снижается «скрытый голод» и тягу к еде.',
            },
            {
              title: 'Низкая калорийная плотность',
              desc: 'Вы можете съесть большую тарелку овощей на 200 калорий вместо маленькой бургерной булки на те же 200 калорий.',
            },
            {
              title: 'Стабильный сахар в крови',
              desc: 'Клетчатка замедляет всасывание сахара. Нет резких скачков инсулина, нет резкого падения энергии и голода.',
            },
            {
              title: 'Улучшение метаболизма',
              desc: 'Питательные продукты улучшают функцию митохондрий, щитовидной железы, чувствительность к инсулину.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.title}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Добавки и «здоровые» продукты</ArticleHeading>
        <ArticleParagraph>
          Фурман критикует индустрию «здоровых» добавок и объясняет, почему цельная еда превосходит таблетки.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Синергия нутриентов">
          В цельных продуктах витамины, минералы и фитоchemicals работают вместе. Изолированный additive в таблетке не
          даёт того же эффекта. Например, витамин C из апельсина лучше усваивается, чем из таблетки, благодаря
          сопровождающим соединениям. Фурман не против добавок в принципе, но считает, что они должны дополнять, а не
          заменять хорошее питание.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические выводы</ArticleHeading>
        <div className="space-y-3">
          {[
            {
              title: 'Начните с добавления, а не исключения',
              desc: 'Сначала добавьте больше овощей и бобовых. Естественным образом вы будете есть меньше «пустой» еды.',
            },
            {
              title: 'Больше зелени',
              desc: 'Зелёные овощи — самый nutrient-dense продукт. Салат, шпинат, капуста должны быть в каждом приёме еды.',
            },
            {
              title: 'Ограничьте масла',
              desc: 'Кокосное, оливковое, авокадо — это 100% жир, 120 калорий на столовую ложку, почти без нутриентов.',
            },
            {
              title: 'Бобовые как основа',
              desc: 'Фасоль, чечевица, нут дают белок, клетчатку, медленные углеводы. Они сытные и питательные.',
            },
            {
              title: 'Фрукты вместо сахара',
              desc: 'Если хочется сладкого, ешьте фрукты. Ягоды особенно полезны.',
            },
            {
              title: 'Не бойтесь углеводов',
              desc: 'Проблема не в углеводах, а в типе углеводов. Цельные зерновые и овощи — хорошие углеводы.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.title}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Связь с голоданием</ArticleHeading>
        <ArticleCallout tone="neutral">
          Подход Фурмана хорошо сочетается с практикой голодания. Высокая плотность нутриентов в еде помогает быстрее
          восстановиться после голодания и обеспечить организм необходимыми ресурсами. Продукты Tier 1 (зелёные овощи)
          идеально подходят для первого приема пищи после голодания — они легко усваиваются и дают максимум нутриентов
          при минимальной нагрузке на пищеварение.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Риски и ограничения</ArticleHeading>
        <ArticleCallout tone="warning">
          <ArticleList
            items={[
              'Резкий переход к высококлетчаточной диете может вызвать вздутие и дискомфорт. Увеличивайте количество клетчатки постепенно.',
              'Людям с диабетом, принимающим инсулин или сахароснижающие препараты, нужна корректировка доз под наблюдением врача.',
              'При заболеваниях щитовидной железы некоторые крестоцветные овощи могут interfere с функцией при употреблении в больших количествах.',
              'Веганский рацион требует внимания к витамину B12, железу, кальцию, витаминину D.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Главный урок книги">
          «Ешь и худей» показывает, что потеря веса не обязательно связана с голоданием и ограничениями. Фокус на
          продуктах с высокой плотностью нутриентов позволяет есть больше, весить меньше и чувствовать себя лучше. Если
          вы практикуете голодание, этот подход к питанию поможет закрепить результаты и поддерживать здоровый вес в
          долгосрочной перспективе.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
