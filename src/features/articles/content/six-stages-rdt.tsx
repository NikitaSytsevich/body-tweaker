import type { Article } from '../types';
import {
  ArticleCallout,
  ArticleHeading,
  ArticleLead,
  ArticleList,
  ArticleProgressChart,
  ArticleSection,
  ArticleSteps,
  ArticleSurface,
} from '../components/ArticleBlocks';

const FASTING_STAGES = [
  { label: '1-я стадия', value: 22, note: '2-3 дня' },
  { label: '2-я стадия', value: 58, note: '3-10 день' },
  { label: '3-я стадия', value: 88, note: 'после криза' },
];

const RECOVERY_STAGES = [
  { label: '1-я стадия', value: 24, note: 'первые дни' },
  { label: '2-я стадия', value: 64, note: '4-6 день и далее' },
  { label: '3-я стадия', value: 90, note: 'стабилизация' },
];

export const sixStagesRdt: Article = {
  id: 'six-stages-rdt',
  title: '6 стадий РДТ: карта всего курса',
  category: 'Фундамент голодания',
  summary:
    'Целостная схема из книги Николаева: три стадии голодания и три стадии восстановления, чтобы понимать динамику и не паниковать.',
  imageUrl: '/images/articles/new/IMG_0416.webp',
  content: (
    <div className="space-y-10">
      <ArticleSection>
        <ArticleLead>
          В «Голодании ради здоровья» процесс разбит на 6 стадий: 3 в разгрузочном периоде и 3 в восстановительном.
          Это одна из самых полезных частей книги: она помогает отличить ожидаемую реакцию от тревожного отклонения.
        </ArticleLead>
        <ArticleCallout tone="info" title="Зачем это знать">
          Когда человек понимает этапность, он меньше срывается в первые дни и осторожнее проходит выход.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Разгрузочный период: 3 стадии</ArticleHeading>
        <ArticleProgressChart items={FASTING_STAGES} />

        <ArticleSteps
          items={[
            <>
              <strong>1-я стадия - пищевое возбуждение.</strong> Обычно 2-3 дня: выраженные пищевые рефлексы,
              раздражительность, снижение сна, быстрый спад веса.
            </>,
            <>
              <strong>2-я стадия - нарастающий ацидоз.</strong> Часто 3-10-й день: голод снижается, но слабость,
              налет на языке, запах изо рта и утренний дискомфорт могут усиливаться.
            </>,
            <>
              <strong>3-я стадия - компенсация (адаптация).</strong> После ацидотического перелома самочувствие улучшается,
              появляется бодрость, состояние становится стабильнее.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Восстановительный период: 3 стадии</ArticleHeading>
        <ArticleProgressChart items={RECOVERY_STAGES} />

        <ArticleSteps
          items={[
            <>
              <strong>1-я стадия - астеническая.</strong> Даже после первых порций насыщение может быть резким,
              а затем снова появляется голод. Слабость в начале выхода допустима.
            </>,
            <>
              <strong>2-я стадия - интенсивного восстановления.</strong> Аппетит и физические силы растут,
              вес возвращается, выравниваются стул, пульс, давление.
            </>,
            <>
              <strong>3-я стадия - нормализация.</strong> Аппетит становится умеренным,
              эмоциональный фон выравнивается, питание перестает быть главной темой дня.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection>
        <ArticleHeading>Что дает эта схема на практике</ArticleHeading>
        <ArticleSurface>
          <ArticleList
            items={[
              'Снижает тревожность в сложные первые дни курса.',
              'Помогает не перепутать адаптацию с осложнением.',
              'Заставляет воспринимать выход как полноценный этап лечения.',
              'Дает ориентиры, когда нужен очный врачебный контроль.',
            ]}
          />
        </ArticleSurface>
      </ArticleSection>

      <ArticleSection>
        <ArticleCallout tone="warning" title="Ключевой риск">
          По Николаеву, больше всего ошибок и осложнений происходит не в самом голодании, а на восстановлении.
          Поэтому стадии выхода нельзя упрощать и ускорять.
        </ArticleCallout>
      </ArticleSection>
    </div>
  ),
};
