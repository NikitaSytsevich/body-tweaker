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

export const gregerHowNotToDie: Article = {
  id: 'greger-how-not-to-die',
  title: 'Как не умереть раньше времени',
  category: 'Наука о питании',
  summary: 'Доказательный подход к питанию: 15 причин смерти и как еда влияет на риск заболеваний. Ежедневная порция (Daily Dozen).',
  imageUrl: '/images/articles/new/IMG_0419.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Доктор Майкл Грегер — врач, специализирующийся на нутрициологии. Его подход отличается от многих популярных
          диетологов: он не опирается на теории или авторитеты, а systematically разбирает научные исследования и
          извлекает из них практические рекомендации.
        </ArticleLead>
        <ArticleCallout tone="info" title="Структура книги">
          Первая часть посвящена 15 ведущим причинам смерти — от болезней сердца до диабета. Для каждой Грегер
          разбирает, какие продукты повышают риск, а какие снижают. Вторая часть — практическая: что именно и в каком
          количестве есть каждый день для профилактики.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>15 причин смерти</ArticleHeading>
        <ArticleParagraph>
          Грегер систематизировал исследования по основным причинам преждевременной смерти. Для каждого заболевания он
          выделил продукты, которые научно доказанно влияют на риск.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            { disease: 'Болезни сердца', food: 'Орехи, бобовые, цельные зерновые' },
            { disease: 'Рак лёгких', food: 'Крестоцветные овощи (капуста, брокколи)' },
            { disease: 'Диабет', food: 'Цельные зерновые, клетчатка' },
            { disease: 'Высокое давление', food: 'Свёкла, зелень, богаты калием продукты' },
            { disease: 'Рак кишечника', food: 'Клетчатка, бобовые, чеснок' },
            { disease: 'Болезни печени', food: 'Кофе, крестоцветные овощи' },
          ].map((item, i) => (
            <ArticleSurface key={i} className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.disease}</p>
              <span className="text-[13px] text-[color:var(--article-accent)]">{item.food}</span>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="warning" title="Паттерн продуктов">
          Растительные продукты (овощи, фрукты, бобовые, орехи, цельные зерновые) в исследованиях последовательно
          ассоциируются с более низким риском хронических заболеваний. Переработанные продукты, мясо, молочные продукты
          часто показывают обратную связь.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Ежедневная дюжина (Daily Dozen)</ArticleHeading>
        <ArticleParagraph>
          Самая известная часть книги — Daily Dozen, список продуктов и практик, которые Грегер рекомендует включать в
          ежедневный рацион. Это не строгая диета, а скорее чек-лист разнообразного питания.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            { category: '1. Бобовые', amount: '3 порции', examples: 'Фасоль, горох, чечевица, нут' },
            { category: '2. Зелень', amount: '1-2 порции', examples: 'Шпинат, капуста, листовая зелень' },
            { category: '3. Крестоцветные', amount: '1 порция', examples: 'Брокколи, капуста, цветная капуста' },
            { category: '4. Другие овощи', amount: '2 порции', examples: 'Морковь, свёкла, помидоры' },
            { category: '5. Фрукты', amount: '3 порции', examples: 'Ягоды особенно полезны' },
            { category: '6. Цельные зерновые', amount: '3 порции', examples: 'Овсянка, гречка, бурый рис' },
            { category: '7. Специи', amount: '1 порция', examples: 'Турмерик особенно' },
            { category: '8. Напитки', amount: '5 стаканов', examples: 'Вода, чай, кофе' },
            { category: '9. Упражнения', amount: '90 минут', examples: 'Активность в день' },
            { category: '10. Орехи и семена', amount: '1 порция', examples: 'Грецкие, миндаль, льняное' },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.category}</p>
                <span className="text-[13px] text-[color:var(--article-accent)]">{item.amount}</span>
              </div>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.examples}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="neutral">
          Daily Dozen — это не обязательно жёстко следовать каждому пункту каждый день. Это ориентир для разнообразия.
          Если сегодня вы не съели все greens, это нормально. Главное — общий тренд питания.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Ключевые продукты-суперфуды</ArticleHeading>
        <ArticleParagraph>
          Грегер выделяет несколько продуктов, которые особенно хорошо изучены и показывают выраженные эффекты в
          исследованиях.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            { name: 'Чеснок и лук', benefit: 'Антираковые свойства, сердечно-сосудистая защита', note: 'Нарезайте и давите за 10 минут до готовки' },
            { name: 'Ягоды', benefit: 'Антиоксиданты, защита мозга, когнитивные функции', note: 'Голубика и клубника особенно изучены' },
            { name: 'Крестоцветные', benefit: 'Детоксикация печени, защита от рака', note: 'Брокколи лучше на пару, не варить' },
            { name: 'Бобовые', benefit: 'Диабет, вес, сердечно-сосудистые заболевания', note: 'Чечевица, фасоль, нут — каждый день' },
            { name: 'Орехи', benefit: 'Долголетие, сердечно-сосудистые заболевания', note: 'Грецкие особенно для мозга' },
            { name: 'Турмерик (куркума)', benefit: 'Противовоспалительный, антираковый', note: 'С чёрным перцем для усвоения' },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.name}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.benefit}</p>
              <p className="mt-2 text-[13px] italic text-[color:var(--article-muted)]">{item.note}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Продукты для ограничения</ArticleHeading>
        <ArticleParagraph>
          Грегер не призывает полностью исключать какие-то продукты, но он выделяет категории, которые в исследованиях
          ассоциируются с повышенным риском заболеваний.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="На что обратить внимание">
          <ArticleList
            items={[
              <>
                <strong>Переработанное мясо:</strong> колбасы, бекон, сосиски — ВОЗ классифицирует как канцероген
              </>,
              <>
                <strong>Сахарные напитки:</strong> соки, газировка, сладкий кофе — риск диабета и ожирения
              </>,
              <>
                <strong>Трансжиры:</strong> частично гидрогенизированные масла — воспаление и сердце
              </>,
              <>
                <strong>Избыток соли:</strong> переработанные продукты — давление и сердце
              </>,
            ]}
          />
        </ArticleCallout>
        <ArticleParagraph>
          Грегер подчёркивает: важно не только то, что вы добавляете в рацион, но и то, чем заменяете вредные
          продукты. Замена колбасы на фасоль — не просто удаление «плохого», но и добавление «хорошего».
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Научный подход</ArticleHeading>
        <ArticleParagraph>
          Одна из сильных сторон книги — опора на исследования. Грегер не даёт советов «попробуйте, может поможет», а
          опирается на мета-анализы и рандомизированные контролируемые исследования.
        </ArticleParagraph>
        <div className="space-y-3">
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Источники данных</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Грегер использует исследования из PubMed, базу данных медицинских публикаций. Он особенно ценит
              мета-анализы — исследования, которые объединяют результаты многих исследований.
            </p>
          </ArticleSurface>
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Ограничения исследований</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Грегер признаёт ограничения. Большинство исследований по питанию наблюдательные, не экспериментальные.
              Корреляция не всегда означает причинность. Но когда множество исследований показывает один паттерн, это
              значимо.
            </p>
          </ArticleSurface>
        </div>
        <ArticleCallout tone="neutral">
          Важно понимать: наука о питании постоянно развивается. То, что кажется доказанным сегодня, может быть
          пересмотрено завтра. Грегер не предлагает «истину в последней инстанции», а даёт recommendations основанные
          на текущих данных.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические выводы</ArticleHeading>
        <div className="space-y-3">
          {[
            {
              title: 'Разнообразие важнее одного «суперфуда»',
              desc: 'Не сосредотачивайтесь на одном «чудо-продукте». Ешьте разнообразную растительную еду.',
            },
            {
              title: 'Ешьте цельные продукты',
              desc: 'Вместо добавок старайтесь получить нутриенты из цельной еды. Синергия компонентов важнее.',
            },
            {
              title: 'Замена, а не ограничение',
              desc: 'Вместо «не ешьте Х» думайте «замени Х на Y». Это более устойчивый подход.',
            },
            {
              title: 'Постепенность',
              desc: 'Резкий переход к веганству может быть сложным. Начните с добавления больше растений.',
            },
            {
              title: 'Витамин B12',
              desc: 'Если вы исключаете животные продукты, обязательно добавляйте B12. Это consensus научного сообщества.',
            },
            {
              title: 'Еда — это профилактика',
              desc: 'Грегер не предлагает питание как лечение существующих заболеваний. Это прежде всего профилактика.',
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
          Грегер напрямую не обсуждает голодание, но его подход к питанию хорошо сочетается с практикой периодических
          отказов от еды. Растительная диета, богатая клетчаткой, может облегчить вход и выход из голодания. Кроме того,
          продукты из Daily Dozen (особенно ягоды, крестоцветные, зелень) отлично подходят для первого приема пищи
          после голодания.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Критика и ограничения</ArticleHeading>
        <ArticleCallout tone="warning">
          <ArticleList
            items={[
              'Некоторые исследователи указывают на то, что данные наблюдательных исследований могут переоценивать эффекты растительной диеты',
              'Полноценный веганский рацион требует планирования, особенно для B12, железа, кальция, витамина D',
              'Индивидуальные различия в генетике и микробиоме могут влиять на то, как диета влияет на здоровье',
              'Доступность свежих продуктов может ограничивать реализацию рекомендаций',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Главный урок книги">
          «Как не умереть раньше времени» даёт framework для мышления о еде как о профилактике болезней. Daily Dozen —
          это не жёсткая диета, а ориентир для разнообразного растительного питания. Если вы практикуете голодание,
          продукты из этой книги отлично подходят для здорового питания в периоды между голоданиями.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
