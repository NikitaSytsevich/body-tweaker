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

export const rawFoodMonodiet: Article = {
  id: 'raw-food-monodiet',
  title: 'Сыроедческая монодиета',
  category: 'Сыроедение',
  summary: 'Фруктомонодиеты как способ глубокого очищения. Польза и риски длительного сыроедения.',
  imageUrl: '/images/articles/new/IMG_0423.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Сыроедение — практика питания продуктами без термической обработки. Книга «Сыроедческая монодиета»
          фокусируется на особом подходе: временном питании одним типом сырых продуктов, обычно фруктов, для глубокого
          очищения организма.
        </ArticleLead>
        <ArticleCallout tone="success" title="Концепция монодиеты">
          Монодиета означает питание одним продуктом в течение определённого времени — от одного дня до нескольких
          недель. Идея в том, что упрощение состава еды снижает нагрузку на пищеварение и позволяет организму
          переключиться на глубокую очистку и восстановление.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Основы сыроедения</ArticleHeading>
        <ArticleParagraph>
          Прежде чем переходить к монодиетам, важно понять базовые принципы сыроедения.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              principle: 'Максимальная сохранность нутриентов',
              detail: 'Термическая обработка разрушает часть витаминов, ферментов и фитоchemicals. Сырая еда сохраняет их.',
            },
            {
              principle: 'Ферменты живой еды',
              detail: 'Сырые продукты содержат ферменты, которые помогают пищеварению. При готовке они инактивируются.',
            },
            {
              principle: 'Вода в еде',
              detail: 'Фрукты и овощи на 70-95% состоят из воды. Это гидратация на клеточном уровне.',
            },
            {
              principle: 'Клетчатка',
              detail: 'Сырая растительная еда богата клетчаткой, которая кормит микробиом и улучшает пищеварение.',
            },
            {
              principle: 'Низкая калорийная плотность',
              detail: 'Много объёма, мало калорий. Легше поддерживать здоровый вес.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.principle}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.detail}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="neutral">
          Сыроедение — это не только салаты. Включает фрукты, овощи, орехи, семена, проростки, иногда сырые яйца или
          рыбу (если не вегетарианское сыроедение). Основой обычно являются фрукты и овощи.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Фруктомонодиеты</ArticleHeading>
        <ArticleParagraph>
          Самый популярный вид монодиет — фруктовый. Фрукты легко усваиваются, содержат много воды и простых сахаров,
          которые быстро дают энергию.
        </ArticleParagraph>
        <ArticleParagraph className="text-[color:var(--article-text)]">Популярные фруктомонодиеты</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              fruit: 'Арбузная монодиета',
              duration: '1-7 дней',
              benefits: 'Мочегонный эффект, очищение почек, гидратация',
              caution: 'Низкокалорийная, не дольше 3-7 дней',
            },
            {
              fruit: 'Виноградная монодиета',
              duration: '3-14 дней',
              benefits: 'Антиоксиданты, резveratrol, энергия',
              caution: 'Высокий сахар, не для диабетиков',
            },
            {
              fruit: 'Дынная монодиета',
              duration: '1-5 дней',
              benefits: 'Лёгкая, освежающая, витаминов много',
              caution: 'Не смешивать с другой едой',
            },
            {
              fruit: 'Цитрусовая монодиета',
              duration: '3-10 дней',
              benefits: 'Витамин C, детокс, иммунитет',
              caution: 'Кислота может раздражать желудок',
            },
            {
              fruit: 'Яблочная монодиета',
              duration: '1-3 дня',
              benefits: 'Пектин, клетчатка, мягкая',
              caution: 'Больше 3 дней не рекомендуется',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.fruit}</p>
              <p className="mt-2 text-[14px] text-[color:var(--article-muted)]">Длительность: {item.duration}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.benefits}</p>
              <p className="mt-2 text-[13px] text-[color:var(--article-accent)]">⚠ {item.caution}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="info" title="Правила фруктомонодиеты">
          <ArticleList
            items={[
              'Ешьте один фрукт до насыщения, когда голодны',
              'Пейте воду по необходимости, но не перебарщивайте',
              'Не смешивайте разные фрукты в одной диете',
              'Слушайте организм — слабость, голод — сигналы прекратить',
              'Плавный выход — не наедайтесь тяжёлой едой сразу после',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Механизм действия</ArticleHeading>
        <ArticleParagraph>Почему монодиета может работать лучше, чем просто разнообразное сыроедение?</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              title: 'Упрощение пищеварения',
              desc: 'Один тип еды требует определённых ферментов. Разнообразная смесь создаёт конфликт в желудке. Монодиета упрощает процесс.',
            },
            {
              title: 'Снижение нагрузки',
              desc: 'Пищеварительная система работает в «экономном режиме». Ресурс освобождается для очищения и восстановления.',
            },
            {
              title: 'Отдых печени',
              desc: 'Меньше разнообразных токсинов и сочетаний пищи. Печень может заниматься детоксом, а не постоянной переработкой сложных смесей.',
            },
            {
              title: 'Снижение воспаления',
              desc: 'Фрукты низко inflammatory. Меньше пищевых воспалений — больше энергии на восстановление.',
            },
            {
              title: 'Гидратация',
              desc: 'Фрукты на 80-95% вода. Это гидратация на клеточном уровне, что помогает выводить токсины.',
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
        <ArticleHeading>Долгосрочное сыроедение</ArticleHeading>
        <ArticleParagraph>
          Монодиеты обычно временные практики. Долгосрочное сыроедение требует более разнообразного подхода.
        </ArticleParagraph>
        <ArticleParagraph className="text-[color:var(--article-text)]">Типы сыроедения</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              type: 'Веганское сыроедение',
              desc: 'Только растения: фрукты, овощи, орехи, семена, проростки',
            },
            {
              type: 'Вегетарианское сыроедение',
              desc: 'Растения + сырые яйца, молочные продукты, мёд',
            },
            {
              type: 'Палео-сыроедение',
              desc: 'Растения + сырая рыба, мясо, яйца (продукты палео-диеты)',
            },
            {
              type: 'Фрукторианство',
              desc: 'Только фрукты, орехи, семена. Самое ограничительное направление',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.type}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>
        <ArticleCallout tone="info" title="Типичный день сыроеда">
          <ArticleList
            items={[
              <>
                <strong>Утро:</strong> Свежие фрукты, смузи, фруктовый салат
              </>,
              <>
                <strong>Обед:</strong> Большой салат с авокадо, орехами, овощами
              </>,
              <>
                <strong>Ужин:</strong> Овощи с ореховым соусом, сыроедческие супы
              </>,
              <>
                <strong>Перекусы:</strong> Фрукты, орехи, семена, свежевыжатые соки
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Риски и ограничения</ArticleHeading>
        <ArticleParagraph>
          Сыроедение и монодиеты имеют реальные риски, особенно при длительной практике без подготовки.
        </ArticleParagraph>
        <ArticleCallout tone="warning" title="Основные риски">
          <ArticleList
            items={[
              <>
                <strong>Дефицит B12:</strong> Витамин B12 практически отсутствует в растениях. Сыроеды-веганы должны
                добавлять его обязательно.
              </>,
              <>
                <strong>Низкая калорийность:</strong> Фрукты и овощи низкокалорийны. Можно не добирать калорий, что
                ведёт к потере веса и усталости.
              </>,
              <>
                <strong>Проблемы с зубами:</strong> Кислые фрукты и сухофрукты могут разрушать эмаль при частом
                употреблении.
              </>,
              <>
                <strong>Пищевые инфекции:</strong> Сырая еда может содержать патогены. Мойте тщательно, выбирайте
                качественные продукты.
              </>,
              <>
                <strong>Проблемы с пищеварением:</strong> Резкий переход к высококлетчаточной диете может вызвать
                вздутие, газы, дискомфорт.
              </>,
              <>
                <strong>Социальная изоляция:</strong> Сыроедение сильно ограничивает выбор в ресторанах и
                мероприятиях.
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические выводы</ArticleHeading>
        <div className="space-y-3">
          {[
            {
              title: 'Короткие монодиеты безопаснее',
              desc: '1-3 дня на одном фрукте — безопасная практика для большинства. Длительные монодиеты требуют подготовки.',
            },
            {
              title: 'Постепенный переход',
              desc: 'Не переходите к 100% сыроедению резко. Начните с сырого завтрака, затем обеда.',
            },
            {
              title: 'Следите за весом и энергией',
              desc: 'Если теряете слишком много веса или чувствуете хроническую усталость — добавляйте больше калорий.',
            },
            {
              title: 'Добавляйте B12',
              desc: 'Если исключаете животные продукты, B12 обязателен. Не полагайтесь на «fermented» продукты.',
            },
            {
              title: 'Разнообразие важно',
              desc: 'Долгосрочное сыроедение требует разнообразия: фрукты, овощи, орехи, семена, проростки.',
            },
            {
              title: 'Монодиета — это инструмент',
              desc: 'Фруктомонодиеты — временные практики для очищения, а не постоянный образ питания.',
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
          Сыроедение и голодание — родственные практики. Обе дают отдых пищеварительной системе и способствуют
          очищению. Монодиеты можно рассматривать как «мягкое голодание» — вы едите, но очень упрощённую пищу. После
          голодания фрукты — идеальный первый приём еды: они легко усваиваются, дают энергию и не перегружают систему.
          Многие люди, регулярно голодающие, естественным образом переходят к более сыроедческому питанию между
          голоданиями.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Критический взгляд</ArticleHeading>
        <ArticleCallout tone="warning">
          <ArticleList
            items={[
              'Научные доказательства преимуществ сыроедения ограничены и часто противоречивы',
              'Некоторые нутриенты лучше усваиваются из приготовленной еды (ликопин, бета-каротин)',
              'Долгосрочное сыроедение может вести к дефицитам без тщательного планирования',
              'Идея «ферментов живой еды» частично миф — большинство ферментов разрушаются в желудке',
              'Качество и доступность свежих продуктов может ограничивать практику',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Главный урок книги">
          Сыроедческая монодиета — это инструмент, а не постоянный образ жизни. Короткие фруктомонодиеты могут быть
          полезными для периодического очищения и отдыха пищеварительной системы. Долгосрочное сыроедение требует
          тщательного планирования и понимания рисков. Если вы практикуете голодание, сырые продукты — идеальная еда
          для входа и выхода: они лёгкие, питательные и поддерживают процесс очищения.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
