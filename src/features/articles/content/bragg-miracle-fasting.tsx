import type { Article } from '../types';
import { Activity, Apple, Droplets, Shield, Sunrise, Target, Zap } from 'lucide-react';

export const braggMiracleFasting: Article = {
  id: 'bragg-miracle-fasting',
  title: 'Чудо голодания по Полю Брэггу',
  category: 'Фундамент голодания',
  summary: 'Классический подход к регулярному голоданию: 24-36 часов еженедельно, сыроедение и физическая активность.',
  imageUrl: '/images/articles/new/IMG_0416.webp',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Поль Брэгг — один из самых известных пропагандистов голодания в XX веке. В отличие от Шелтона, который фокусировался на длительном лечебном голодании, Брэгг продвигал идею регулярных коротких голоданий как части здорового образа жизни.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Ключевое отличие</h4>
          </div>
          <p className="text-base text-blue-800 dark:text-blue-200/90 leading-relaxed">
            Брэгг не требовал от людей неделями отказываться от еды. Его подход — голодание 24-36 часов каждую неделю. Этого достаточно, чтобы дать отдых пищеварительной системе и запустить процессы очищения, но не настолько долго, чтобы причинить вред организму.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <Sunrise className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Почему голодание работает</h3>
        </div>

        <p className="mb-4">
          Брэгг объяснял действие голодания через понятие «токсической нагрузки». Современный человек постоянно получает токсины из еды, воды, воздуха, плюс добавляет собственные продукты метаболизма.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Проблема постоянного питания</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Когда организм постоянно занят перевариванием пищи, у него нет ресурса на глубокую очистку. Токсины накапливаются в тканях, особенно в жировой клетчатке.
            </p>
          </div>

          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Решение через паузу</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Голодание даёт пищеварительной системе передышку. Организм переключается на внутреннее питание и начинает расщеплять накопленные отложения.
            </p>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-3">Эффекты, которые описывал Брэгг</h4>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              <span>Снижение веса без потери мышечной массы</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              <span>Улучшение clarity мышления и концентрации</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              <span>Усиление регенерации тканей и заживления</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              <span>Нормализация давления и кровообращения</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Протокол Брэгга</h3>
        </div>

        <p className="mb-4">
          Базовая схема проста: голодание раз в неделю на 24-36 часов. Но есть важные нюансы, которые делают этот подход безопасным и эффективным.
        </p>

        <h4 className="font-bold text-xl mb-3">Три варианта голодания</h4>
        <div className="space-y-4 mb-6">
          {[
            {
              type: '12 часов',
              difficulty: 'Легко',
              desc: 'С вечера до утра. Перерыв между ужином и завтраком. Подходит новичкам для адаптации.'
            },
            {
              type: '24 часа',
              difficulty: 'Средне',
              desc: 'От ужина до следующего ужина. Оптимальный вариант для регулярной практики. Пьём только воду.'
            },
            {
              type: '36 часов',
              difficulty: 'Сложно',
              desc: 'От ужина до завтрака через день. Более глубокое очищение, требует подготовки.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.type}</h5>
                <span className="text-xs px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 rounded-full">{item.difficulty}</span>
              </div>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-xl mb-3">Правила голодания по Брэггу</h4>
        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <ul className="space-y-3 text-sm text-violet-800 dark:text-violet-200/90">
            <li className="flex items-start gap-3">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Только вода:</strong> Во время голодания пейте дистиллированную или чистую воду в достаточном количестве.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Никакого сахара:</strong> Никаких сладких напитков, соков, чая с мёдом. Только вода.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Активность сохраняется:</strong> Брэгг рекомендовал лёгкие упражнения и прогулки во время голодания.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Плавный выход:</strong> После голодания не наедайтесь. Начните с овощного салата или сока.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Apple className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Питание между голоданиями</h3>
        </div>

        <p className="mb-4">
          Голодание — только часть системы Брэгга. Не менее важное значение он придавал повседневному питанию. Его подход близок к современному сыроедению.
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 mb-6">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-3">Принципы питания по Брэггу</h4>
          <ul className="space-y-3 text-sm text-emerald-800 dark:text-emerald-200/90">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>70% сырой еды:</strong> Большая часть рациона — свежие фрукты, овощи, орехи, семена.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>Никакой обработанной пищи:</strong> Никаких консервов, колбас, сахара, белой муки.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>Раздельное питание:</strong> Белки и углеводы есть отдельно, чтобы не перегружать пищеварение.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span><strong>Меньше соли:</strong> Брэгг считал избыток соли причиной отёков и давления.</span>
            </li>
          </ul>
        </div>

        <p>
          Брэгг признавал, что такой переход может быть сложным. Он рекомендовал постепенное изменение привычек, а не радикальный отказ от всего привычного сразу.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Физическая активность</h3>
        </div>

        <p className="mb-4">
          Брэгг был убеждённым сторонником активного образа жизни. Сам он занимался бегом, плаванием, ходьбой и тренировками с отягощениями до глубокой старости.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30">
          <p className="text-base text-amber-900 leading-relaxed mb-3">
            Голодание и движение — идеальная комбинация. Во время голодания организм более эффективно использует энергию, а физическая активность усиливает циркуляцию лимфы и крови, помогая выведению токсинов.
          </p>
          <p className="text-sm text-amber-800 dark:text-amber-200/90">
            Брэгг не рекомендовал интенсивные тренировки во время голодания, но настаивал на том, чтобы не вести малоподвижный образ жизни. Лёгкая прогулка, растяжка или йога подходят идеально.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Droplets className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Вода и детокс</h3>
        </div>

        <p className="mb-4">
          Особое внимание Брэгг уделял качеству воды. Он считал водопроводную воду источником токсинов и рекомендовал дистиллированную или хорошо очищенную.
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Количество воды',
              desc: 'Во время голодания пейте 2-3 литра воды в день. Это необходимо для вымывания токсинов.'
            },
            {
              title: 'Температура',
              desc: 'Брэгг предпочитал тёплую или комнатной температуры воду. Холодная может вызвать спазм.'
            },
            {
              title: 'Между голоданиями',
              desc: 'Он также рекомендовал пить воду в течение дня, а не только во время голодания.'
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
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Риски и противопоказания</h3>
        </div>

        <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]">
          <ul className="space-y-3 text-sm text-red-800/90">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Беременность и лактация:</strong> Голодание противопоказано во время беременности и кормления.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Диабет 1 типа:</strong> Инсулинозависимый диабет требует медицинского контроля. Голодание может вызвать гипогликемию.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Истощение:</strong> Если у вас дефицит массы или хроническое истощение, голодание может усилить проблему.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Приём лекарств:</strong> Многие лекарства нужно принимать с едой. Обсудите голодание с врачом.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Практические выводы</h3>

        <div className="space-y-4">
          {[
            {
              title: 'Регулярность важнее длительности',
              desc: 'Лучше голодать 24 часа каждую неделю, чем 7 дней раз в год. Организм адаптируется к регулярной практике.'
            },
            {
              title: 'Начните с малого',
              desc: 'Если вы новичок, начните с 12-часового голодания. Постепенно увеличивайте время по мере привыкания.'
            },
            {
              title: 'Следите за самочувствием',
              desc: 'Головокружение, слабость, тошнота — сигналы прекратить голодание и поесть. Не геройствуйте.'
            },
            {
              title: 'Выход так же важен',
              desc: 'После голодания не наедайтесь. Начните с овощного салата или фруктов. Дайте организму время включиться.'
            },
            {
              title: 'Комбинируйте с сыроедением',
              desc: 'Брэгг считал, что сыроедение между голоданиями усиливает эффект. Старайтесь есть больше сырой еды.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.title}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-6 h-6 text-green-400" />
          <h4 className="font-bold">Главный урок Брэгга</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          Голодание — это не наказание, а отдых для пищеварительной системы. Короткие регулярные голодания в сочетании с здоровым питанием и физической активностью могут поддерживать организм в тонусе. Главное — прислушиваться к своему телу и не форсировать процесс.
        </p>
      </div>

    </div>
  ),
};
