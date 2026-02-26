import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleParagraph,
  ArticleSection,
  ArticleSteps,
  ArticleSurface,
} from '../components/ArticleBlocks';

export const fastingDayRegimen: Article = {
  id: 'fasting-day-regimen',
  title: 'Режим дня при голодании: протокол из стационара',
  category: 'Гайд',
  summary:
    'Как Николаев выстраивал день пациента на РДТ: вода, процедуры, прогулки, дыхание, занятость и сон как единая система.',
  imageUrl: '/images/articles/new/IMG_0420.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В книге режим дня - не «дополнение», а часть лечебной методики. Именно распорядок снижает тяжесть первых дней,
          помогает пройти адаптацию и держит пациента от срыва.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Базовый каркас дня (по стр. 60-61)</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Утро.</strong> Очистительная процедура, затем ванна/душ и массаж по назначенной схеме.
            </>,
            <>
              <strong>Дневной блок.</strong> Отвар шиповника или вода, длительная прогулка, дыхательные упражнения,
              затем второй водный/отварный прием.
            </>,
            <>
              <strong>Вечер.</strong> Спокойная занятость, гигиена рта и горла, питьевой режим, сон при хорошем проветривании.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что дает этот режим</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Снижает фиксацию на еде и пищевых триггерах.',
              'Поддерживает выведение продуктов обмена естественными путями.',
              'Помогает сохранить двигательную активность без перегруза.',
              'Стабилизирует психоэмоциональное состояние в сложные дни курса.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Практические детали из книги</ArticleHeading>
        <ArticleCallout tone="info" title="Нюансы, которые часто пропускают">
          <ArticleList
            items={[
              'В холодный сезон нужна теплая одежда из-за зябкости на фоне голодания.',
              'Гигиена полости рта и горла обязательна каждый день.',
              'Свободное время лучше занимать чтением, спокойной работой, общением, а не «лежанием в тревоге».',
              'Режим сохраняется на всем периоде курса, а не только в первые дни.',
            ]}
          />
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleParagraph>
          Николаев отдельно подчеркивает: пациенты обычно не «слабеют до лежачего режима», а при правильной схеме
          к концу курса часто чувствуют больше энергии, чем в начале.
        </ArticleParagraph>
      </ArticleSection>
    </div>
  ),
};
