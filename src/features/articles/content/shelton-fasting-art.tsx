import type { Article } from '../types';
import { Activity, AlertTriangle, Apple, Brain, Clock, Lightbulb, Target } from 'lucide-react';

export const sheltonFastingArt: Article = {
  id: 'shelton-fasting-art',
  title: 'Голодание и искусство есть по Шелтону',
  category: 'Фундамент голодания',
  summary: 'Классика лечебного голодания: физиология аутолиза, почему переедание убивает, и как правильно выходить.',
  imageUrl: '/images/articles/new/IMG_0382 (2).PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Герберт Шелтон — основоположник современной натурапатии. Его подход к голоданию отличается от большинства современных систем: он рассматривает отказ от еды не как лечебную процедуру, а как естественный физиологический процесс, который запускается в организме автоматически при отсутствии пищи.
        </p>

        <div className="bg-slate-50 dark:bg-[#3A3A3C] p-6 rounded-3xl border border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 font-medium text-xl text-slate-600 dark:text-slate-300" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Ключевая идея</h4>
          </div>
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Организм обладает врождённой способностью к самоочищению и самовосстановлению. Голодание лишь убирает препятствия, которые мешают этим процессам работать в полную силу. Когда пищеварительная система выключается, высвобождается колоссальный ресурс для регенерации.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <Apple className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Что происходит во время голодания</h3>
        </div>

        <p className="mb-4">
          Шелтон детально описывает физиологию голодания как процесса переключения metabolism. Обычно организм получает энергию извне — из еды. Когда пищеварение останавливается, включается внутренний режим питания.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 mb-6">
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-3">Механизм аутолиза</h4>
          <p className="text-sm text-green-800 dark:text-green-200/90 leading-relaxed mb-3">
            Аутолиз — это процесс самопереваривания, который звучит пугающе, но на самом деле является спасительным механизмом. Организм начинает расщеплять собственные ткани, но делает это избирательно.
          </p>
          <p className="text-sm text-green-800 dark:text-green-200/90 leading-relaxed">
            Первыми уйдут повреждённые, больные, ненужные клетки — жировая ткань, опухоли, спайки, рубцы. Здоровые ткани и жизненно важные органы будут сохранены до последнего.
          </p>
        </div>

        <h4 className="font-bold text-xl mb-3">Фазы голодания по Шелтону</h4>
        <div className="space-y-4">
          {[
            {
              phase: 'Адаптация',
              desc: 'Первые 1-3 дня. Организм переходит на внутреннее питание. Возможен голод, головная боль, слабость.'
            },
            {
              phase: 'Кетоз',
              desc: 'Дни 3-7. Начинается активное расщепление жиров. Голод исчезает, появляется ясность ума.'
            },
            {
              phase: 'Глубокое очищение',
              desc: 'День 7 и далее. Максимальная интенсивность аутолиза. Организм активно перерабатывает повреждённые ткани.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.phase}</h5>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300 ml-11">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Критика переедания</h3>
        </div>

        <p className="mb-4">
          Значительная часть книги посвящена критике современного образа питания. Шелтон утверждал, что большинство хронических заболеваний вызваны не тем, что мы едим, а тем, сколько мы едим.
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 mb-6">
          <h4 className="font-bold text-red-900 dark:text-red-100 mb-3">Основные ошибки питания</h4>
          <ul className="space-y-3 text-sm text-red-800/90">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Чрезмерное количество:</strong> Переполненный желудок не может эффективно переваривать еду. Это ведёт к гниению и брожению.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Неправильные сочетания:</strong> Белки и углеводы требуют разных условий для переваривания. Их смесь создаёт конфликт в желудке.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Постоянное жевание:</strong> Пищеварительной системе нужны паузы для восстановления. Непрерывный приём еды изнашивает органы.</span>
            </li>
          </ul>
        </div>

        <p>
          Шелтон особенно подчёркивал: нет смысла начинать голодание, если после него вернуться к прежнему режиму переедания. Это как мыть грязную машину, а затем сразу же снова ездить по болоту.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Правильный выход — важнее голодания</h3>
        </div>

        <p className="mb-4">
          Одна из центральных идей книги: длительность голодания менее важна, чем качество выхода. Неправильный выход может свести на нет все результаты и нанести серьёзный вред.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 mb-6">
          <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">Принципы выхода по Шелтону</h4>
          <ol className="space-y-3 text-sm text-blue-800 dark:text-blue-200/90">
            <li className="flex items-start gap-3">
              <span className="font-bold shrink-0">1.</span>
              <span><strong>Постепенность:</strong> Количество еды увеличивается медленно, в течение нескольких дней равных длительности голодания.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold shrink-0">2.</span>
              <span><strong>Простые продукты:</strong> Первые дни — свежевыжатые соки, затем фрукты, позже овощи и лишь в конце — зерновые и белки.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold shrink-0">3.</span>
              <span><strong>Внимание к сигналам:</strong> Любой дискомфорт — сигнал уменьшить количество или упростить состав еды.</span>
            </li>
          </ol>
        </div>

        <p>
          Шелтон предупреждал: желудок после голодания находится в чувствительном состоянии. Любая ошибка в этот период может вызвать воспаление, диарею или рвоту.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Психологический аспект</h3>
        </div>

        <p className="mb-4">
          Шелтон уделял много внимания психологической подготовке. Голодание требует спокойствия, доверия к организму и отсутствия страха.
        </p>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <p className="text-base text-violet-900 leading-relaxed">
            Страх и тревога усиливают выделение стрессовых гормонов, которые мешают процессу очищения. Организм должен чувствовать безопасность, чтобы перейти в режим глубокого восстановления.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Практические выводы</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Короткие голодания эффективнее длинных',
              desc: 'Для большинства людей достаточно 1-3 дневных голоданий с правильной подготовкой и выходом. Длительные голодания требуют надзора.'
            },
            {
              title: 'Слушайте организм',
              desc: 'Естественный голод возвращается, когда организм готов к еде. Искусственный аппетит — это психический голод, его можно игнорировать.'
            },
            {
              title: 'Качество важнее количества',
              desc: 'После голодания организм сам подскажет, что и сколько ему нужно. Не заставляйте себя есть «для здоровья».'
            },
            {
              title: 'Паузы между приёмами пищи',
              desc: 'Шелтон рекомендовал делать перерывы не менее 4-5 часов между едой, чтобы пищеварение полностью завершалось.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.title}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Риски и ограничения</h3>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
          <ul className="space-y-3 text-sm text-orange-800 dark:text-orange-200/90">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Длительное голодание без медицинского наблюдения может быть опасным при истощении, анемии или хронических заболеваниях.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Выход из голодания — критический период. Резкий возврат к обычной еде может вызвать серьёзные осложнения.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Голодание не заменяет медицинское лечение острых состояний. Его следует рассматривать как поддерживающую практику, а не как панацею.</span>
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <Apple className="w-6 h-6 text-green-400" />
          <h4 className="font-bold">Главный урок Шелтона</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Голодание — это инструмент, который помогает организму вернуться к естественному равновесию. Но настоящий успех зависит не от того, как долго вы голодали, а от того, как вы питаетесь и живёте afterwards. Голодание может дать старт, но устойчивое здоровье строится на повседневных привычках.
        </p>
      </div>

    </div>
  ),
};
