import type { Article } from '../types';
import { Flame, AlertTriangle, Heart, Wind, Zap, Trash2, Info, BookOpen } from 'lucide-react';

export const smokingAndFasting: Article = {
  id: 'smoking-and-fasting',
  title: 'Курение и вейпы при голодании: Полная правда',
  category: 'Безопасность',
  summary: 'Как никотин и пары влияют на процесс очищения организма? Можно ли курить во время голодания и к каким последствиям это приводит?',
  imageUrl: '/10.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      {/* Вступление */}
      <p className="font-medium text-xl text-slate-600 dark:text-slate-300">
        Голодание — это период глубокого очищения и регенерации. Курение (обычные сигареты или вейпы) в этот период не просто снижает эффективность процедуры, но и усиливает токсическую нагрузку на организм.
      </p>

      {/* Главное предупреждение */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30 flex gap-4">
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
        <div>
            <h4 className="font-bold text-red-800 dark:text-red-100 mb-1 text-lg">Краткий ответ</h4>
            <p className="text-sm text-red-800/80 dark:text-red-200/80 leading-snug">
                <strong>Нет, курить нельзя.</strong> Ни обычные сигареты, ни вейпы, ни кальян. Это противоречит самой сути голодания и наносит дополнительный вред.
            </p>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-white/10" />

      {/* Секция про обычные сигареты */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 text-white rounded-xl">
                <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Обычные сигареты</h3>
        </div>
        <p className="mb-4">
            Во время голодания организм переходит на внутреннее питание — потребляет собственные запасы. Вместо очищения вы вводите новую порцию токсинов.
        </p>

        <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-50 dark:bg-[#3A3A3C] p-5 rounded-2xl">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Удар по сердечно-сосудистой системе
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Никотин сужает сосуды и повышает давление на 15-25 мм рт. ст. На фоне голодания, когда и так снижен объем циркулирующей крови, это создает колоссальную нагрузку на сердце.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#3A3A3C] p-5 rounded-2xl">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Wind className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    Угарный газ вместо кислорода
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Каждая сигарета вводит в кровь угарный газ, который связывается с гемоглобином в 200 раз прочнее кислорода. Во время голодания кислород особенно нужен для процессов регенерации.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#3A3A3C] p-5 rounded-2xl">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">4000+ химических веществ</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Сигаретный дым содержит канцерогены, смолы, тяжелые металлы. Печень и почки, которые должны заниматься детоксикацией во время голодания, вынуждены перерабатывать этот яд вместо восстановления организма.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#3A3A3C] p-5 rounded-2xl">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Замедление аутофагии</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Исследования показывают, что курение подавляет аутофагию — процесс очистки клеток от поврежденных компонентов. Это один из ключевых механизмов лечебного действия голодания.
                </p>
            </div>
        </div>
      </section>

      {/* Секция про вейпы */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
                <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Вейпы и электронные сигареты</h3>
        </div>
        <p className="mb-4">
            Многие ошибочно считают вейпы «безопасной» альтернативой. Это миф, особенно в условиях голодания.
        </p>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30 space-y-4">
            <h4 className="font-bold text-violet-900 dark:text-violet-100">Что содержит жидкость для вейпа:</h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-50 dark:bg-violet-900/200 mt-2.5 shrink-0" />
                    <span><strong>Пропиленгликоль:</strong> при нагревании превращается в формальдегид (канцероген класса 1) и акролеин — токсичные соединения.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-50 dark:bg-violet-900/200 mt-2.5 shrink-0" />
                    <span><strong>Глицерин:</strong> может выделять акролеин при высоких температурах нагревания.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-50 dark:bg-violet-900/200 mt-2.5 shrink-0" />
                    <span><strong>Ароматизаторы:</strong> диацетил, вызывающий облитерирующий бронхиолит («попкорновая болезнь»), и другие химикаты, повреждающие легкие.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-50 dark:bg-violet-900/200 mt-2.5 shrink-0" />
                    <span><strong>Тяжелые металлы:</strong> свинец, никель, олово, хром из нагревательного элемента и спирали.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-50 dark:bg-violet-900/200 mt-2.5 shrink-0" />
                    <span><strong>Свободные радикалы:</strong> концентрация свободных радикалов в паре вейпа может быть выше, чем в табачном дыме.</span>
                </li>
            </ul>
        </div>

        <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
            <h4 className="font-bold text-orange-900 dark:text-orange-100 mb-2">Особая опасность при голодании</h4>
            <p className="text-sm text-orange-800 dark:text-orange-200">
                Во время голодания слизистая желудка и кишечника особенно уязвима. Попадание паров пропиленгликоля и ароматизаторов на раздраженную слизистую может вызвать воспаление, гастрит и усилить тошноту.
            </p>
        </div>

        <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
            <h4 className="font-bold text-red-900 mb-2">Влияние на легкие</h4>
            <p className="text-sm text-red-800 dark:text-red-100">
                Исследования 2022 года показали, что вейпинг вызывает воспаление дыхательных путей, снижает функцию легких и повышает susceptibility к респираторным инфекциям — именно то, чего нужно избегать при голодании.
            </p>
        </div>
      </section>

      {/* Научные данные */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Что говорит наука</h3>
        </div>

        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Исследование влияния курения на аутофагию</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование, опубликованное в журнаle «Cell», показало, что компоненты табачного дыма подавляют аутофагию — ключевой процесс очищения клеток, активируемый при голодании.
                </p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/32426392/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:text-blue-200">
                    Ghosh A. et al., Tobacco Smoking and Autophagy, 2020
                </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Вред вейпов для легких</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование в «American Journal of Physiology» показало, что пары электронных сигарет вызывают воспаление легких и снижают их функцию даже без никотина.
                </p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/30592963/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:text-blue-200">
                    Wu Q. et al., Electronic Cigarette Aerosol Induces Lung Inflammation, 2018
                </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Токсичные вещества в парах вейпа</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование Университета Джонса Хопкинса выявило в парах вейпа тысячи неизвестных химических веществ, включая токсичные соединения, не указанные на упаковке.
                </p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/35577246/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:text-blue-200">
                    Link B. et al., Chemical profiling of e-cig aerosols, 2022
                </a>
            </div>
        </div>
      </section>

      {/* Почему голодание — идеальное время бросить */}
      <section className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
        <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Голодание — лучший момент бросить курить</h3>
        </div>
        <div className="space-y-4">
            <p className="text-emerald-800 dark:text-emerald-200">
                Если вы курите, голодание может стать переломным моментом. Вот почему это идеальное время:
            </p>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/200 mt-2.5 shrink-0" />
                    <span><strong>Снижение вкусовой чувствительности:</strong> во время голодания притупляются вкусовые ощущения, включая удовольствие от курения. Это облегчает отказ.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/200 mt-2.5 shrink-0" />
                    <span><strong>Перезагрузка рецепторов:</strong> никотиновые рецепторы начинают восстанавливаться уже через 24-48 часов без никотина. Уменьшается физическая зависимость.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/200 mt-2.5 shrink-0" />
                    <span><strong>Психологический настрой:</strong> если вы настроены на улучшение здоровья через голодание, добавьте к этому отказ от курения для синергетического эффекта.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/200 mt-2.5 shrink-0" />
                    <span><strong>Чистый старт:</strong> голодание — это «сброс настроек» организма. Легче бросить привычку, когда организм проходит через полную перезагрузку.</span>
                </li>
            </ul>
        </div>
      </section>

      {/* Синдром отмены */}
      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-4">Что если бросить не получается?</h3>
        <p className="mb-4">
            Если вы не готовы бросить курить полностью, учтите следующее:
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 space-y-4">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Снижение эффективности</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Курение снижает лечебный эффект голодания примерно на 40-50%. Подавляется аутофагия, повышается воспаление, ухудшается детоксикация. Вы получаете лишь половину пользы.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Усиление абстинентного синдрома</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Во время голодания чувствительность к никотину повышается в 2-3 раза. Каждая сигарета будет вызывать более сильное головокружение, тошноту и учащенное сердцебиение.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Компромиссный вариант</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Если не можете бросить полностью — хотя бы сократите количество в 2-3 раза. Лучше короткое голодание без курения, чем длинное с курением. Используйте никотиновые пластыри вместо сигарет.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Временный отказ</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        Договоритесь с собой: не курить в период голодания и выхода из него. Например, при 7-дневном голодании не курить 10 дней. Это посильная задача, которая даст максимальную пользу.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Итоговый блок */}
      <section className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
        <h3 className="text-xl font-bold mb-4">Вывод</h3>
        <p className="text-slate-200 leading-relaxed">
            Голодание и курение — несовместимы по самой своей сути. Голодание стремится очистить организм, курение — загрязняет его. Если вы всерьез подходите к голоданию, используйте этот момент как трамплин для отказа от табака. Здоровье — комплексный процесс, и одно действие без другого будет неполным.
        </p>
        <div className="mt-6 p-4 bg-slate-800 rounded-2xl">
            <p className="text-sm text-slate-300 italic">
                «Лучшее голодание — то, которое проводится в чистой среде. Без алкоголя, без табака, без токсинов. Каждый выкуренный сигаретой день голодания — день впустую.»
            </p>
        </div>
      </section>

    </div>
  ),
};
