import type { Article } from '../types';
import { Activity, AlertTriangle, Pill, Stethoscope, Users, CheckCircle2, BookOpen } from 'lucide-react';

export const diabetesFasting: Article = {
  id: 'diabetes-fasting',
  title: 'Голодание при сахарном диабете: Полное руководство',
  category: 'Здоровье',
  summary: 'Можно ли голодать при диабете 1 и 2 типа? Как безопасно проводить лечебное голодание без риска гипогликемии и кетоацидоза?',
  imageUrl: '/images/articles/new/IMG_0425.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      {/* Вступление */}
      <p className="font-medium text-xl text-slate-600 dark:text-slate-300">
        Голодание при диабете — тема, требующая предельной осторожности и медицинского контроля. С одной стороны, научные исследования подтверждают, что голодание может улучшить чувствительность к инсулину и снизить вес. С другой — несет прямую угрозу жизни при неправильном подходе.
      </p>

      {/* Критическое предупреждение */}
      <div className="bg-red-600 p-6 rounded-3xl flex gap-4 text-white">
        <AlertTriangle className="w-10 h-10 shrink-0" />
        <div>
            <h4 className="font-bold mb-1 text-lg">Критическое предупреждение</h4>
            <p className="text-sm text-red-50 leading-snug">
                <strong>Ни в коем случае не начинайте голодание без консультации эндокринолога!</strong> При диабете 1 типа самовольное голодание может привести к диабетическому кетоацидозу — состоянию, угрожающему жизни. Без медицинского контроля это может закончиться реанимацией.
            </p>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-white/10" />

      {/* Диабет 1 типа */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Диабет 1 типа</h3>
        </div>
        <p className="mb-4">
            Для людей с диабетом 1 типа классическое длительное голодание <strong>противопоказано</strong>. Организм не вырабатывает инсулин, и при отсутствии поступления углеводов риск кетоацидоза резко возрастает.
        </p>

        <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]">
            <h4 className="font-bold text-red-900 dark:text-rose-300 mb-3">Почему это опасно?</h4>
            <ul className="space-y-3 text-sm text-red-800 dark:text-rose-200">
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Кетоацидоз:</strong> без инсулина организм не может утилизировать глюкозу и переходит на расщепление жиров с образованием кетонов. В отличие от здоровых людей, у диабетиков 1 типа процесс выходит из-под контроля — кетоны достигают опасного уровня, кровь закисляется.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Гипогликемия:</strong> при снижении дозы инсулина для голодания легко ошибиться с расчетом. Критическое падение сахара (ниже 2.5 ммоль/л) может привести к коме.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Непредсказуемость реакции:</strong> каждый организм реагирует по-разному. Без постоянного мониторинга сахара и кетонов это смертельно опасно.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Отсутствие исследований:</strong> исследований по безопасности длительного голодания при диабете 1 типа критически мало. Нет проверенных протоколов.</span>
                </li>
            </ul>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Альтернатива для диабета 1 типа</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Вместо полного голодания врачи рекомендуют <strong>периодическое питание</strong> с низким гликемическим индексом.
            </p>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 font-bold">•</span>
                    <span><strong>Интервальный режим 16/8:</strong> 16 часов без еды, 8 часов питания — под строгим контролем сахара и коррекцией доз инсулина.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 font-bold">•</span>
                    <span><strong>Низкоуглеводная диета:</strong> снижение количества углеводов до 30-50 г в день для уменьшения колебаний сахара.</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-blue-500 dark:text-blue-400 font-bold">•</span>
                    <span><strong>Мониторинг:</strong> обязательное измерение сахара каждые 3-4 часа в течение всего периода.</span>
                </li>
            </ul>
        </div>
      </section>

      {/* Диабет 2 типа */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Диабет 2 типа</h3>
        </div>
        <p className="mb-4">
            При диабете 2 типа ситуация другая. Голодание может быть <strong>эффективным методом лечения</strong>, так как основная проблема этого типа — инсулинорезистентность. Подтверждено клиническими исследованиями.
        </p>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 space-y-4">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">Польза голодания при диабете 2 типа:</h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Восстановление чувствительности к инсулину:</strong> клетки начинают лучше реагировать на инсулин уже через 24-48 часов голодания. Исследования показывают увеличение чувствительности на 50-75%.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Снижение веса:</strong> каждый килограмм потери веса улучшает показатели сахара в крови. Голодание — самый эффективный способ сброса веса.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Снижение уровня сахара:</strong> при голодании печень перестает выбрасывать глюкозу в кровь. Показатели стабилизируются на нормальных значениях.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Отмена лекарств:</strong> многие пациенты со временем могут снизить дозу метформина или полностью отказаться от нее (под контролем врача).</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Снижение воспаления:</strong> голодание уменьшает хроническое воспаление, которое является одной из причин инсулинорезистентности.</span>
                </li>
            </ul>
        </div>

        <div className="mt-6 bg-slate-50 dark:bg-[#3A3A3C] p-6 rounded-3xl">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Научные данные</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
                Исследования доктора Джейсона Фанга (Канада) показывают, что периодическое голодание может приводить к полной ремиссии диабета 2 типа даже у пациентов с многолетним стажем заболевания. В его клинике тысячи пациентов успешно снизили дозы лекарств или полностью от них отказались.
            </p>
        </div>
      </section>

      {/* Научные исследования */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Научные исследования</h3>
        </div>

        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Ремиссия диабета 2 типа</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование в «BMJ» показало, что интервальное голодание может привести к ремиссии диабета 2 типа у 60% пациентов. Средняя потеря веса составила 10-15 кг.
                </p>
                <a href="https://www.bmj.com/content/368/bmj.m694" target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-800 dark:hover:text-blue-300">
                    McCombie L. et al., Remission of type 2 diabetes, 2020
                </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Периодическое голодание и инсулин</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование в «Cell Metabolism» показало, что периодическое голодание улучшает чувствительность к инсулину, снижает уровень сахара в крови и способствует регенерации бета-клеток поджелудочной железы.
                </p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/28887544/" target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-800 dark:hover:text-blue-300">
                    Cheng C. et al., Fasting-Mimicking Diet, 2017
                </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Снижение лекарств при голодании</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Клиническое исследование доктора Фанга показало, что 3-дневное голодание может снизить уровень сахара с 12-15 ммоль/л до 6-8 ммоль/л и позволить пациентам сократить дозы лекарств вдвое.
                </p>
                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6353026/" target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-800 dark:hover:text-blue-300">
                    Fung J. et al., Therapeutic Fasting, 2018
                </a>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Голодаание и метформин</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                    Исследование показало, что комбинация периодического голодания с приемом метформина более эффективна для снижения сахара и веса, чем каждый метод по отдельности.
                </p>
                <a href="https://pubmed.ncbi.nlm.nih.gov/30476413/" target="_blank" rel="noopener noreferrer" className="text-xs underline hover:text-blue-800 dark:hover:text-blue-300">
                    Song P. et al., Metformin and Intermittent Fasting, 2019
                </a>
            </div>
        </div>
      </section>

      {/* Правила безопасности */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
                <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Правила безопасности для диабета 2 типа</h3>
        </div>

        <div className="space-y-4">
            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Начните с интервалов
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Не идите сразу на длительное голодание. Начните с схемы 16/8 (16 часов без еды, 8 часов питания). Постепенно увеличивайте интервалы: 18/6, 20/4, 24-часовые голодания 1-2 раза в неделю.
                </p>
            </div>

            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Контролируйте сахар
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Измеряйте уровень глюкозы каждые 3-4 часа в первые несколько раз. Ваша цель — держать сахар выше 3.5 ммоль/л. Если падает ниже — немедленно прерывайте голодание.
                </p>
            </div>

            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Пейте много воды
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Обезвоживание при диабете особенно опасно. Пейте не менее 2-3 литров чистой воды в день. Это поможет почкам выводить кетоны и токсины.
                </p>
            </div>

            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Следите за кетонами
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Купите тест-полоски для мочи или кетометр. Умеренный кетоз (1.5-3 ммоль/л) — нормально и полезно. Если выше 5 ммоль/л и есть симптомы (тошнота, одышка) — прервитесь.
                </p>
            </div>

            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    Откорректируйте лекарства
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Метформин обычно продолжают принимать, но дозу инсулина или препаратов, стимулирующих выработку инсулина (гликлазид, глимепирид), нужно снижать <strong>до</strong> начала голодания. Только с врачом!
                </p>
            </div>

            <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                    Имеете план действий
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Знайте, что делать при гипогликемии. Имейте при себе глюкозу, сок или конфеты. Сообщите близким, что вы голодаете, чтобы они могли помочь в случае необходимости.
                </p>
            </div>
        </div>
      </section>

      {/* Симптомы опасности */}
      <section className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
        <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100">Срочно прервите голодание при симптомах:</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {[
                "Сахар крови ниже 3.5 ммоль/л",
                "Дрожь, холодный пот, сильная слабость",
                "Спутанность сознания, трудности с речью",
                "Тошнота, многократная рвота",
                "Фруктовый запах ацетона изо рта (признак кетоацидоза)",
                "Боль в животе, одышка",
                "Потеря сознания или судороги"
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white dark:bg-[#3A3A3C] p-3 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                </div>
            ))}
        </div>
        <div className="mt-4 p-4 bg-red-600 rounded-xl text-white">
            <p className="text-sm font-medium">
                <strong>При этих симптомах немедленно съешьте что-то сладкое (фрукт, сок, конфету) и вызовите скорую помощь!</strong> Не ждите, это может быть опасно для жизни.
            </p>
        </div>
      </section>

      {/* Консультация с врачом */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Какой врач должен быть в курсе?</h3>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 space-y-4">
            <p className="text-blue-900 dark:text-blue-100">
                Вам нужен эндокринолог, который <strong>поддерживает</strong> идею голодания и понимает, как это работает. К сожалению, многие врачи традиционной школы против этого метода. Вам может потребоваться найти врача функциональной медицины или интегративного подхода.
            </p>
            <div className="space-y-3">
                <h4 className="font-bold text-blue-900 dark:text-blue-100">Что обсудить на приеме:</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <span>Из каких препаратов можно снизить дозу и на сколько?</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <span>Как часто нужно измерять сахар и кетоны?</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <span>Какой план действий при гипогликемии?</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <span>Какие у вас конкретные противопоказания?</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 dark:text-blue-400">•</span>
                        <span>Какой протокол голодания лучше начать с?</span>
                    </li>
                </ul>
            </div>
        </div>
      </section>

      {/* Итог */}
      <section className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
            <Pill className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold">Главный вывод</h3>
        </div>
        <p className="text-slate-200 leading-relaxed mb-4">
            При диабете 2 типа голодание может стать мощным инструментом для восстановления здоровья, но только при грамотном подходе. Не рискуйте — работайте с врачом, начинайте с коротких интервалов, внимательно следите за самочувствием. При диабете 1 типа от длительного голодания лучше отказаться — используйте интервальное питание под строгим контролем.
        </p>
        <div className="p-4 bg-slate-800 rounded-2xl">
            <p className="text-sm text-slate-300 italic">
                «Лучшее лечение — то, которое проводится под медицинским контролем. Ваше здоровье стоит того, чтобы найти поддерживающего врача. Голодание — не панацея, но мощный инструмент в умелых руках.»
            </p>
        </div>
      </section>

    </div>
  ),
};
