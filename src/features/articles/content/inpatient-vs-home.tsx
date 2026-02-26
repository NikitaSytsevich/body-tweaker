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

export const inpatientVsHome: Article = {
  id: 'inpatient-vs-home',
  title: 'Стационар или дома: где проходит граница безопасности',
  category: 'Безопасность',
  summary:
    'Разбор позиции Николаева: почему длительные курсы требуют стационара, какие условия обязательны амбулаторно и где чаще ломается метод.',
  imageUrl: '/images/articles/new/IMG_0422.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В книге прямо говорится: длительное лечебное голодание безопаснее проводить в клинике. Не из-за «страшности» метода,
          а из-за количества тонких точек контроля, особенно на выходе.
        </ArticleLead>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Почему стационар считается базовым форматом</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Есть постоянный врачебный и сестринский надзор.',
              'Процедуры и режим выполняются регулярно, без пропусков.',
              'Легче отследить осложнения и вовремя скорректировать тактику.',
              'Меньше внешнего давления: «поешь хоть немного» и других срывных сценариев.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Если амбулаторно, то только при строгих условиях</ArticleHeading>
        <ArticleSteps
          items={[
            <>
              <strong>Полная исходная диагностика.</strong> Анализы, ЭКГ, контроль давления и динамики состояния.
            </>,
            <>
              <strong>Врач, который знает РДТ.</strong> Не общий контроль «по самочувствию», а понимание стадий метода.
            </>,
            <>
              <strong>Дисциплина среды.</strong> Без постороннего вмешательства и пищевых провокаций дома.
            </>,
            <>
              <strong>Готовность к немедленной коррекции.</strong> При нетипичных симптомах - переход к очной помощи.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Где чаще всего происходит провал</ArticleHeading>
        <ArticleCallout tone="warning" title="Главная зона риска">
          По книге, срывы обычно происходят не в разгрузке, а в восстановительном периоде: ранняя «обычная» еда,
          переедание, отсутствие наблюдения и попытка пройти выход в одиночку.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleParagraph>
          Если выбирать коротко: чем длиннее срок, сложнее диагнозы и слабее контроль среды, тем сильнее аргумент в пользу
          стационара или как минимум плотного медицинского сопровождения.
        </ArticleParagraph>
      </ArticleSection>
    </div>
  ),
};
