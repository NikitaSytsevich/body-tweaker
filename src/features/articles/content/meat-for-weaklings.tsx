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

export const meatForWeaklings: Article = {
  id: 'meat-for-weaklings',
  title: 'Мясо для слабаков',
  category: 'Питание и этика',
  summary: 'Разбор мифов о мясе и силе. Исторические примеры, энергетическая эффективность и практические аспекты.',
  imageUrl: '/images/articles/new/IMG_0422.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Книга Боба и Дженн «Мясо для слабаков» исследует распространённый миф: для силы и здоровья обязательно нужно
          есть мясо. Авторы собирают исторические, биологические и практические данные, которые показывают более
          сложную картину.
        </ArticleLead>
        <ArticleCallout tone="info" title="Центральный тезис">
          Мясо не является необходимым условием для физической силы, мышечного роста или здоровья. История знает
          множество примеров сильных и выносливых людей, которые не потребляли мясо. Растительное питание может
          обеспечить все необходимые нутриенты для активной жизни.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Исторические примеры</ArticleHeading>
        <ArticleParagraph>
          Авторы приводят исторические данные, которые противоречат распространённому мнению о связи мяса и силы.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              example: 'Гладиаторы Рима',
              detail: 'Археологические исследования показывают, что большинство гладиаторов питались в основном растительной пищей. Их называли «hordearii» — «едоки ячменя».',
            },
            {
              example: 'Древние греки',
              detail: 'Олимпийские атлеты и воины часто тренировались на вегетарианской диете. Платон и Сократ выступали против излишнего потребления мяса.',
            },
            {
              example: 'Сильнейшие животные',
              detail: 'Горилла, лошадь, слон — вегетарианцы. Буйвол, который травоядный, может выиграть борьбу у льва. Мышечная масса не требует мяса.',
            },
            {
              example: 'Современные атлеты',
              detail: 'Множество чемпионов по бодибилдингу, силовым видам спорта, ультрамарафонцам — вегетарианцы.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.example}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.detail}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="neutral">
          Корреляция между потреблением мяса и физической силой не подтверждается ни исторически, ни биологически.
          Сила зависит от тренировок, генетики, общего питания и восстановления, а не от присутствия мяса в рационе.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Энергетическая эффективность</ArticleHeading>
        <ArticleParagraph>
          Биологический argument против необходимости мяса связан с энергетической эффективностью питания.
        </ArticleParagraph>
        <ArticleCallout tone="success" title="Энергетическая цепочка">
          Когда человек ест мясо, он получает энергию, которая уже прошла через один цикл переработки. Растение →
          животное → человек. На каждом этапе теряется около 90% энергии. Когда человек ест растения напрямую, он
          получает энергию первого цикла. Растение → человек. Это более эффективно и требует меньше пищеварительных
          затрат.
        </ArticleCallout>
        <ArticleParagraph className="text-[color:var(--article-text)]">Пищеварительные затраты</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              food: 'Мясо',
              effort: 'Высокий',
              detail: 'На переваривание мяса организм тратит значительное количество энергии и времени. 4-6 часов в желудке.',
            },
            {
              food: 'Растительная еда',
              effort: 'Разный',
              detail: 'Фрукты перевариваются быстро (1-2 часа). Зерновые и бобовые дольше, но всё равно меньше мяса. Овощи — в среднем.',
            },
            {
              food: 'Клетчатка',
              effort: 'Положительный',
              detail: 'Ускоряет прохождение пищи, улучшает пищеварение, снижает net затраты энергии.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.food}</p>
                  <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.detail}</p>
                </div>
                <span className="rounded-full bg-[color:rgba(76,141,255,0.15)] px-3 py-1 text-[12px] text-[color:var(--article-accent)]">
                  {item.effort}
                </span>
              </div>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Здоровье и заболевания</ArticleHeading>
        <ArticleParagraph>
          Книга также затрагивает аспекты здоровья, связанные с потреблением и исключением мяса.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              topic: 'Сердечно-сосудистые заболевания',
              info: 'Множество исследований показывают связь между красным мясом и повышенным риском болезней сердца. Растительная диета ассоциируется с более низким риском.',
            },
            {
              topic: 'Диабет 2 типа',
              info: 'Потребление переработанного мяса ассоциируется с повышенным риском диабета. Растительная диета может улучшать чувствительность к инсулину.',
            },
            {
              topic: 'Рак',
              info: 'ВОЗ классифицирует переработанное мясо как канцероген группы 1, красное мясо — группы 2A. Растительная диета ассоциируется с более низким риском многих видов рака.',
            },
            {
              topic: 'Воспаление',
              info: 'Мясо, особенно жареное, содержит продукты гликации и другие воспалительные соединения. Растительная еда содержит противовоспалительные фитоchemicals.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.topic}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.info}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="warning">
          Важно понимать: корреляция не доказывает причинность. Исследования по питанию часто наблюдательные. Однако
          общий паттерн ясен: большие количества мяса, особенно переработанного, ассоциируются с повышенным риском
          хронических заболеваний.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические аспекты вегетарианства</ArticleHeading>
        <ArticleParagraph>
          Если вы решаете уменьшить или исключить мясо,_book предлагает практические рекомендации.
        </ArticleParagraph>
        <ArticleParagraph className="text-[color:var(--article-text)]">Источники белка без мяса</ArticleParagraph>
        <div className="space-y-3">
          {[
            { source: 'Бобовые', protein: '15-20г на cup', note: 'Фасоль, чечевица, нут — основные источники' },
            { source: 'Соя', protein: '10-15г на cup', note: 'Тофу, темпе, эдамаме — полный белок' },
            { source: 'Зерновые', protein: '5-10г на cup', note: 'Киноа, амарант — полный белок' },
            { source: 'Орехи и семена', protein: '5-10г на 30г', note: 'Грецкие, миндаль, chia, hemp' },
            { source: 'Овощи', protein: '2-5г на cup', note: 'Брокколи, шпинат — дополнение' },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.source}</p>
                  <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.note}</p>
                </div>
                <span className="text-[13px] text-[color:var(--article-accent)]">{item.protein}</span>
              </div>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="info" title="Нутриенты, требующие внимания">
          <ArticleList
            items={[
              <>
                <strong>Витамин B12:</strong> Не содержится в растениях. Вегетарианцам нужно добавлять.
              </>,
              <>
                <strong>Железо:</strong> Растительное железо (non-heme) усваивается хуже. Комбинируйте с витамином C.
              </>,
              <>
                <strong>Кальций:</strong> Если не употребляете молочные продукты, включайте обогащённые продукты.
              </>,
              <>
                <strong>Омега-3:</strong> ALA из растений (льняное, грецкие), но EPA/DHA из водорослей.
              </>,
              <>
                <strong>Витамин D:</strong> Получайте от солнца или добавки, независимо от типа питания.
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Переход к растительному питанию</ArticleHeading>
        <ArticleParagraph>
          Авторы не призывают к резкому отказу от мяса. Постепенный переход более устойчив и эффективен.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              step: 'Неделя 1-2: Замена',
              desc: 'Замените мясо в 2-3 приёмах еды на растительные альтернативы. Бобовые, tofu, грибы.',
            },
            {
              step: 'Неделя 3-4: Эксперименты',
              desc: 'Попробуйте новые рецепты и продукты. Индийская, ближневосточная, азиатская кухни богаты вегетарианскими блюдами.',
            },
            {
              step: 'Неделя 5-6: Планирование',
              desc: 'Научитесь планировать рацион так, чтобы получать достаточно белка и нутриентов.',
            },
            {
              step: 'Долгосрочно: Баланс',
              desc: 'Найдите баланс, который работает для вас. Некоторые люди сохраняют небольшое количество мяса, другие переходят полностью.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.step}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические выводы</ArticleHeading>
        <div className="space-y-3">
          {[
            {
              title: 'Мясо не обязательно для силы',
              desc: 'Физическая сила зависит от тренировок и общего питания, а не от потребления мяса.',
            },
            {
              title: 'Растительное питание может быть полноценным',
              desc: 'С планированием и вниманием к ключевым нутриентам вегетарианская диета обеспечивает все потребности организма.',
            },
            {
              title: 'Постепенность — ключ к успеху',
              desc: 'Резкий переход к вегетарианству может быть сложным. Начните с уменьшения количества мяса.',
            },
            {
              title: 'Разнообразие важнее одного «суперфуда»',
              desc: 'Ешьте разнообразную растительную еду: бобовые, зерновые, овощи, фрукты, орехи, семена.',
            },
            {
              title: 'Слушайте организм',
              desc: 'Если чувствуете усталость, слабость — проверьте уровень B12, железа, general калорийность.',
            },
            {
              title: 'Не идеализируйте вегетарианство',
              desc: 'Вегетарианец может питаться нездорово (чипсы, сладости, фастфуд без мяса). Качество еды имеет значение.',
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
          Многие люди, практикующие голодание, отмечают, что после отказа от еды мясо становится менее привлекательным.
          Организм инстинктивно выбирает более лёгкую растительную пищу. Если вы голодали, это может быть естественным
          моментом для перехода к более растительному питанию. Продукты, рекомендуемые в книге (бобовые, овощи,
          фрукты), идеально подходят для здорового питания между голоданиями.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Критика и ограничения</ArticleHeading>
        <ArticleCallout tone="warning">
          <ArticleList
            items={[
              'Исторические примеры selective — не все сильные люди были вегетарианцами',
              'Некоторые люди ощущают улучшение самочувствия при умеренном потреблении мяса',
              'Индивидуальные различия в генетике влияют на оптимальный тип питания',
              'Вегетарианство требует планирования и знаний о нутриентах',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Главный урок книги">
          «Мясо для слабаков» показывает, что распространённый миф о необходимости мяса для силы не поддерживается ни
          историей, ни биологией. Растительное питание может быть полноценным и обеспечивать все потребности активного
          организма. Если вы практикуете голодание или рассматриваете переход к более здоровому питанию, уменьшение
          количества мяса — разумный шаг, который сочетается с пользой голодания для здоровья.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
