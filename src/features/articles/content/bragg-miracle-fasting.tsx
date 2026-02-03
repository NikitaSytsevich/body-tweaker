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

export const braggMiracleFasting: Article = {
  id: 'bragg-miracle-fasting',
  title: 'Чудо голодания по Полю Брэггу',
  category: 'Фундамент голодания',
  summary: 'Классический подход к регулярному голоданию: 24-36 часов еженедельно, сыроедение и физическая активность.',
  imageUrl: '/images/articles/new/IMG_0416.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Поль Брэгг — один из самых известных пропагандистов голодания в XX веке. В отличие от Шелтона, который
          фокусировался на длительном лечебном голодании, Брэгг продвигал идею регулярных коротких голоданий как части
          здорового образа жизни.
        </ArticleLead>
        <ArticleCallout tone="info" title="Ключевое отличие">
          Брэгг не требовал от людей неделями отказываться от еды. Его подход — голодание 24-36 часов каждую неделю.
          Этого достаточно, чтобы дать отдых пищеварительной системе и запустить процессы очищения, но не настолько
          долго, чтобы причинить вред организму.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему голодание работает</ArticleHeading>
        <ArticleParagraph>
          Брэгг объяснял действие голодания через понятие «токсической нагрузки». Современный человек постоянно
          получает токсины из еды, воды, воздуха, плюс добавляет собственные продукты метаболизма.
        </ArticleParagraph>
        <div className="space-y-3">
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Проблема постоянного питания</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Когда организм постоянно занят перевариванием пищи, у него нет ресурса на глубокую очистку. Токсины
              накапливаются в тканях, особенно в жировой клетчатке.
            </p>
          </ArticleSurface>
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Решение через паузу</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Голодание даёт пищеварительной системе передышку. Организм переключается на внутреннее питание и начинает
              расщеплять накопленные отложения.
            </p>
          </ArticleSurface>
        </div>
        <ArticleCallout tone="success" title="Эффекты, которые описывал Брэгг">
          <ArticleList
            items={[
              'Снижение веса без потери мышечной массы',
              'Улучшение clarity мышления и концентрации',
              'Усиление регенерации тканей и заживления',
              'Нормализация давления и кровообращения',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Протокол Брэгга</ArticleHeading>
        <ArticleParagraph>
          Базовая схема проста: голодание раз в неделю на 24-36 часов. Но есть важные нюансы, которые делают этот
          подход безопасным и эффективным.
        </ArticleParagraph>

        <ArticleParagraph className="text-[color:var(--article-text)]">Три варианта голодания</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              type: '12 часов',
              difficulty: 'Легко',
              desc: 'С вечера до утра. Перерыв между ужином и завтраком. Подходит новичкам для адаптации.',
            },
            {
              type: '24 часа',
              difficulty: 'Средне',
              desc: 'От ужина до следующего ужина. Оптимальный вариант для регулярной практики. Пьём только воду.',
            },
            {
              type: '36 часов',
              difficulty: 'Сложно',
              desc: 'От ужина до завтрака через день. Более глубокое очищение, требует подготовки.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.type}</p>
                <span className="rounded-full bg-[color:rgba(76,141,255,0.15)] px-2 py-1 text-[11px] uppercase tracking-wide text-[color:var(--article-accent)]">
                  {item.difficulty}
                </span>
              </div>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.desc}</p>
            </ArticleSurface>
          ))}
        </div>

        <ArticleParagraph className="text-[color:var(--article-text)]">Правила голодания по Брэггу</ArticleParagraph>
        <ArticleCallout tone="info">
          <ArticleList
            items={[
              <>
                <strong>Только вода:</strong> Во время голодания пейте дистиллированную или чистую воду в достаточном
                количестве.
              </>,
              <>
                <strong>Никакого сахара:</strong> Никаких сладких напитков, соков, чая с мёдом. Только вода.
              </>,
              <>
                <strong>Активность сохраняется:</strong> Брэгг рекомендовал лёгкие упражнения и прогулки во время
                голодания.
              </>,
              <>
                <strong>Плавный выход:</strong> После голодания не наедайтесь. Начните с овощного салата или сока.
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Питание между голоданиями</ArticleHeading>
        <ArticleParagraph>
          Голодание — только часть системы Брэгга. Не менее важное значение он придавал повседневному питанию. Его
          подход близок к современному сыроедению.
        </ArticleParagraph>
        <ArticleCallout tone="success" title="Принципы питания по Брэггу">
          <ArticleList
            items={[
              <>
                <strong>70% сырой еды:</strong> Большая часть рациона — свежие фрукты, овощи, орехи, семена.
              </>,
              <>
                <strong>Никакой обработанной пищи:</strong> Никаких консервов, колбас, сахара, белой муки.
              </>,
              <>
                <strong>Раздельное питание:</strong> Белки и углеводы есть отдельно, чтобы не перегружать пищеварение.
              </>,
              <>
                <strong>Меньше соли:</strong> Брэгг считал избыток соли причиной отёков и давления.
              </>,
            ]}
          />
        </ArticleCallout>
        <ArticleParagraph>
          Брэгг признавал, что такой переход может быть сложным. Он рекомендовал постепенное изменение привычек, а не
          радикальный отказ от всего привычного сразу.
        </ArticleParagraph>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Физическая активность</ArticleHeading>
        <ArticleParagraph>
          Брэгг был убеждённым сторонником активного образа жизни. Сам он занимался бегом, плаванием, ходьбой и
          тренировками с отягощениями до глубокой старости.
        </ArticleParagraph>
        <ArticleCallout tone="neutral">
          Голодание и движение — идеальная комбинация. Во время голодания организм более эффективно использует
          энергию, а физическая активность усиливает циркуляцию лимфы и крови, помогая выведению токсинов. Брэгг не
          рекомендовал интенсивные тренировки во время голодания, но настаивал на том, чтобы не вести малоподвижный
          образ жизни. Лёгкая прогулка, растяжка или йога подходят идеально.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Вода и детокс</ArticleHeading>
        <ArticleParagraph>
          Особое внимание Брэгг уделял качеству воды. Он считал водопроводную воду источником токсинов и рекомендовал
          дистиллированную или хорошо очищенную.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              title: 'Количество воды',
              desc: 'Во время голодания пейте 2-3 литра воды в день. Это необходимо для вымывания токсинов.',
            },
            {
              title: 'Температура',
              desc: 'Брэгг предпочитал тёплую или комнатной температуры воду. Холодная может вызвать спазм.',
            },
            {
              title: 'Между голоданиями',
              desc: 'Он также рекомендовал пить воду в течение дня, а не только во время голодания.',
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
        <ArticleHeading>Риски и противопоказания</ArticleHeading>
        <ArticleCallout tone="warning">
          <ArticleList
            items={[
              <>
                <strong>Беременность и лактация:</strong> Голодание противопоказано во время беременности и кормления.
              </>,
              <>
                <strong>Диабет 1 типа:</strong> Инсулинозависимый диабет требует медицинского контроля. Голодание может
                вызвать гипогликемию.
              </>,
              <>
                <strong>Истощение:</strong> Если у вас дефицит массы или хроническое истощение, голодание может усилить
                проблему.
              </>,
              <>
                <strong>Приём лекарств:</strong> Многие лекарства нужно принимать с едой. Обсудите голодание с врачом.
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
              title: 'Регулярность важнее длительности',
              desc: 'Лучше голодать 24 часа каждую неделю, чем 7 дней раз в год. Организм адаптируется к регулярной практике.',
            },
            {
              title: 'Начните с малого',
              desc: 'Если вы новичок, начните с 12-часового голодания. Постепенно увеличивайте время по мере привыкания.',
            },
            {
              title: 'Следите за самочувствием',
              desc: 'Головокружение, слабость, тошнота — сигналы прекратить голодание и поесть. Не геройствуйте.',
            },
            {
              title: 'Выход так же важен',
              desc: 'После голодания не наедайтесь. Начните с овощного салата или фруктов. Дайте организму время включиться.',
            },
            {
              title: 'Комбинируйте с сыроедением',
              desc: 'Брэгг считал, что сыроедение между голоданиями усиливает эффект. Старайтесь есть больше сырой еды.',
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
        <ArticleCallout tone="success" title="Главный урок Брэгга">
          Голодание — это не наказание, а отдых для пищеварительной системы. Короткие регулярные голодания в сочетании
          с здоровым питанием и физической активностью могут поддерживать организм в тонусе. Главное — прислушиваться
          к своему телу и не форсировать процесс.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
