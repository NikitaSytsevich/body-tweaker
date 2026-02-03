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

export const smokingAndFasting: Article = {
  id: 'smoking-and-fasting',
  title: 'Курение и вейпы при голодании: Полная правда',
  category: 'Безопасность',
  summary: 'Как никотин и пары влияют на процесс очищения организма? Можно ли курить во время голодания и к каким последствиям это приводит?',
  imageUrl: '/images/articles/1.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          Голодание — это период глубокого очищения и регенерации. Курение (обычные сигареты или вейпы) в этот период
          не просто снижает эффективность процедуры, но и усиливает токсическую нагрузку на организм.
        </ArticleLead>
        <ArticleCallout tone="warning" title="Краткий ответ">
          <strong>Нет, курить нельзя.</strong> Ни обычные сигареты, ни вейпы, ни кальян. Это противоречит самой сути
          голодания и наносит дополнительный вред.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Обычные сигареты</ArticleHeading>
        <ArticleParagraph>
          Во время голодания организм переходит на внутреннее питание — потребляет собственные запасы. Вместо очищения
          вы вводите новую порцию токсинов.
        </ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              title: 'Удар по сердечно-сосудистой системе',
              text: 'Никотин сужает сосуды и повышает давление на 15-25 мм рт. ст. На фоне голодания, когда и так снижен объем циркулирующей крови, это создает колоссальную нагрузку на сердце.',
            },
            {
              title: 'Угарный газ вместо кислорода',
              text: 'Каждая сигарета вводит в кровь угарный газ, который связывается с гемоглобином в 200 раз прочнее кислорода. Во время голодания кислород особенно нужен для процессов регенерации.',
            },
            {
              title: '4000+ химических веществ',
              text: 'Сигаретный дым содержит канцерогены, смолы, тяжелые металлы. Печень и почки, которые должны заниматься детоксикацией во время голодания, вынуждены перерабатывать этот яд вместо восстановления организма.',
            },
            {
              title: 'Замедление аутофагии',
              text: 'Исследования показывают, что курение подавляет аутофагию — процесс очистки клеток от поврежденных компонентов. Это один из ключевых механизмов лечебного действия голодания.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.title}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.text}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Вейпы и электронные сигареты</ArticleHeading>
        <ArticleParagraph>
          Многие ошибочно считают вейпы «безопасной» альтернативой. Это миф, особенно в условиях голодания.
        </ArticleParagraph>
        <ArticleCallout tone="info" title="Что содержит жидкость для вейпа">
          <ArticleList
            items={[
              <>
                <strong>Пропиленгликоль:</strong> при нагревании превращается в формальдегид (канцероген класса 1) и
                акролеин — токсичные соединения.
              </>,
              <>
                <strong>Глицерин:</strong> может выделять акролеин при высоких температурах нагревания.
              </>,
              <>
                <strong>Ароматизаторы:</strong> диацетил, вызывающий облитерирующий бронхиолит («попкорновая болезнь»), и
                другие химикаты, повреждающие легкие.
              </>,
              <>
                <strong>Тяжелые металлы:</strong> свинец, никель, олово, хром из нагревательного элемента и спирали.
              </>,
              <>
                <strong>Свободные радикалы:</strong> концентрация свободных радикалов в паре вейпа может быть выше, чем в
                табачном дыме.
              </>,
            ]}
          />
        </ArticleCallout>
        <ArticleCallout tone="warning" title="Особая опасность при голодании">
          Во время голодания слизистая желудка и кишечника особенно уязвима. Попадание паров пропиленгликоля и
          ароматизаторов на раздраженную слизистую может вызвать воспаление, гастрит и усилить тошноту.
        </ArticleCallout>
        <ArticleCallout tone="warning" title="Влияние на легкие">
          Исследования 2022 года показали, что вейпинг вызывает воспаление дыхательных путей, снижает функцию легких и
          повышает susceptibility к респираторным инфекциям — именно то, чего нужно избегать при голодании.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что говорит наука</ArticleHeading>
        <div className="space-y-3">
          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Исследование влияния курения на аутофагию</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Исследование, опубликованное в журнаle «Cell», показало, что компоненты табачного дыма подавляют аутофагию
              — ключевой процесс очищения клеток, активируемый при голодании.
            </p>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/32426392/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-[color:var(--article-accent)] underline"
            >
              Ghosh A. et al., Tobacco Smoking and Autophagy, 2020
            </a>
          </ArticleSurface>

          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Вред вейпов для легких</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Исследование в «American Journal of Physiology» показало, что пары электронных сигарет вызывают воспаление
              легких и снижают их функцию даже без никотина.
            </p>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/30592963/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-[color:var(--article-accent)] underline"
            >
              Wu Q. et al., Electronic Cigarette Aerosol Induces Lung Inflammation, 2018
            </a>
          </ArticleSurface>

          <ArticleSurface>
            <p className="text-[15px] font-semibold text-[color:var(--article-text)]">Токсичные вещества в парах вейпа</p>
            <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">
              Исследование Университета Джонса Хопкинса выявило в парах вейпа тысячи неизвестных химических веществ,
              включая токсичные соединения, не указанные на упаковке.
            </p>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35577246/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[13px] text-[color:var(--article-accent)] underline"
            >
              Link B. et al., Chemical profiling of e-cig aerosols, 2022
            </a>
          </ArticleSurface>
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="success" title="Голодание — лучший момент бросить курить">
          <ArticleList
            items={[
              <>
                <strong>Снижение вкусовой чувствительности:</strong> во время голодания притупляются вкусовые ощущения,
                включая удовольствие от курения. Это облегчает отказ.
              </>,
              <>
                <strong>Перезагрузка рецепторов:</strong> никотиновые рецепторы начинают восстанавливаться уже через 24-48
                часов без никотина. Уменьшается физическая зависимость.
              </>,
              <>
                <strong>Психологический настрой:</strong> если вы настроены на улучшение здоровья через голодание,
                добавьте к этому отказ от курения для синергетического эффекта.
              </>,
              <>
                <strong>Чистый старт:</strong> голодание — это «сброс настроек» организма. Легче бросить привычку, когда
                организм проходит через полную перезагрузку.
              </>,
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что если бросить не получается?</ArticleHeading>
        <ArticleParagraph>Если вы не готовы бросить курить полностью, учтите следующее:</ArticleParagraph>
        <div className="space-y-3">
          {[
            {
              title: 'Снижение эффективности',
              text: 'Курение снижает лечебный эффект голодания примерно на 40-50%. Подавляется аутофагия, повышается воспаление, ухудшается детоксикация. Вы получаете лишь половину пользы.',
            },
            {
              title: 'Усиление абстинентного синдрома',
              text: 'Во время голодания чувствительность к никотину повышается в 2-3 раза. Каждая сигарета будет вызывать более сильное головокружение, тошноту и учащенное сердцебиение.',
            },
            {
              title: 'Компромиссный вариант',
              text: 'Если не можете бросить полностью — хотя бы сократите количество в 2-3 раза. Лучше короткое голодание без курения, чем длинное с курением. Используйте никотиновые пластыри вместо сигарет.',
            },
            {
              title: 'Временный отказ',
              text: 'Договоритесь с собой: не курить в период голодания и выхода из него. Например, при 7-дневном голодании не курить 10 дней. Это посильная задача, которая даст максимальную пользу.',
            },
          ].map((item, i) => (
            <ArticleSurface key={i}>
              <p className="text-[15px] font-semibold text-[color:var(--article-text)]">{item.title}</p>
              <p className="mt-2 text-[15px] text-[color:var(--article-muted)]">{item.text}</p>
            </ArticleSurface>
          ))}
        </div>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Вывод">
          Голодание и курение — несовместимы по самой своей сути. Голодание стремится очистить организм, курение —
          загрязняет его. Если вы всерьез подходите к голоданию, используйте этот момент как трамплин для отказа от
          табака. Здоровье — комплексный процесс, и одно действие без другого будет неполным.
          <p className="mt-3 text-[14px] italic text-[color:var(--article-muted)]">
            «Лучшее голодание — то, которое проводится в чистой среде. Без алкоголя, без табака, без токсинов. Каждый
            выкуренный сигаретой день голодания — день впустую.»
          </p>
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
