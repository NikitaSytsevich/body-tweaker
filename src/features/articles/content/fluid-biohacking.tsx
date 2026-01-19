import type { Article } from '../types';
import { 
  Zap, 
  Ban, 
  FlaskConical, 
  Activity, 
  Droplets,
  ThumbsUp
} from 'lucide-react';

export const fluidBiohacking: Article = {
  id: 'fluid-biohacking',
  title: 'Вода и Соль: Секрет легкого голода',
  category: 'Практика',
  summary: 'Почему болит голова, зачем пить соленую воду и как пережить голодание без мучений.',
  imageUrl: '/images/articles/fluids.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      {/* Вступление */}
      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          Многие бросают голодание на второй день не из-за пустого желудка, а из-за дикой головной боли и слабости. Хорошая новость: это не «голодный обморок». Это просто нехватка соли.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Простая физиология
            </h4>
            <p className="text-sm text-blue-800/80 leading-relaxed">
                Когда вы едите, инсулин задерживает воду и соль в организме. Когда вы перестаете есть, инсулин падает, и почки открывают шлюзы: вода начинает стремительно уходить. 
                <br/><br/>
                Вместе с водой «вымываются» важные минералы. Если пить пустую воду, вы просто прогоняете её через себя как через трубу, вымывая последние остатки солей. Отсюда и головная боль.
            </p>
        </div>
      </section>

      {/* Раздел: Трио минералов */}
      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Три кита вашего самочувствия</h3>
        <p className="mb-4 text-slate-600">
            Вам не нужны дорогие БАДы. Вам нужны три простых элемента, чтобы чувствовать себя отлично:
        </p>
        
        <div className="space-y-4">
            {/* Натрий */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-xl">Обычная Соль (Натрий)</h4>
                    <span className="text-2xl">🧂</span>
                </div>
                <p className="text-sm text-slate-600">
                    Самый важный элемент. Именно соль удерживает воду в сосудах. 
                    <br/><strong>Лайфхак:</strong> Если закружилась голова или резко упали силы — просто положите щепотку соли под язык. Эффект наступит через пару минут.
                </p>
            </div>

            {/* Магний */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-xl">Магний</h4>
                    <span className="text-2xl">😴</span>
                </div>
                <p className="text-sm text-slate-600">
                    Отвечает за расслабление. Если на голоде сводит икры или вы не можете уснуть — вам нужен магний. Лучше всего принимать перед сном.
                </p>
            </div>

            {/* Калий */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-xl">Калий</h4>
                    <span className="text-2xl">❤️</span>
                </div>
                <p className="text-sm text-slate-600">
                    Нужен для сердца. Обычно продается в магазинах как «Соль с пониженным содержанием натрия» (смесь соли и калия).
                </p>
            </div>
        </div>
      </section>

      {/* Рецепт Воды */}
      <section className="my-8">
        <h3 className="text-2xl font-[900] text-slate-900 mb-4">Рецепт «Живой воды»</h3>
        <p className="text-slate-600 mb-4">
            Чтобы не мучиться с подсчетами, сделайте себе бутылку правильной воды на весь день. На вкус она будет как минералка без газа.
        </p>
        
        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <FlaskConical className="absolute -right-6 -top-6 w-40 h-40 text-white/5" />
            
            <div className="relative z-10 space-y-4">
                <div className="border-b border-white/10 pb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">На 2 литра воды</p>
                    <div className="flex justify-between items-center">
                        <span>Розовая или морская соль</span>
                        <span className="font-mono font-bold text-emerald-400">1 ч.л.</span>
                    </div>
                </div>
                
                <div className="border-b border-white/10 pb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Для сердца</p>
                    <div className="flex justify-between items-center">
                        <span>Хлорид Калия (соль с калием)</span>
                        <span className="font-mono font-bold text-emerald-400">1 ч.л.</span>
                    </div>
                </div>

                <div className="border-b border-white/10 pb-4">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Для мягкости вкуса</p>
                    <div className="flex justify-between items-center">
                        <span>Пищевая сода</span>
                        <span className="font-mono font-bold text-emerald-400">1 ч.л.</span>
                    </div>
                </div>

                <div className="pt-2 flex gap-3 items-center opacity-80">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <p className="text-xs">Пейте это вместо обычной воды в течение дня.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Только вода */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-xl">
                <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">Почему только вода?</h3>
        </div>
        <p className="mb-4 text-slate-700">
            Мы рекомендуем исключить даже чай и кофе. Почему? 
        </p>
        <ul className="list-disc pl-5 space-y-2 text-base text-slate-600">
            <li><strong>Отдых рецепторов:</strong> Дайте своим вкусовым рецепторам перезагрузиться. После голодания обычное яблоко покажется вам божественным десертом.</li>
            <li><strong>Отдых нервной системы:</strong> Кофеин — это стимулятор. Голодание — это время покоя и восстановления. Дайте надпочечникам отдохнуть от стимуляции.</li>
            <li><strong>Чистота процесса:</strong> Вода — лучший и единственный растворитель, который идеально вымывает токсины.</li>
        </ul>
      </section>

      {/* Запрещенка */}
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 mt-6">
        <div className="flex items-center gap-3 mb-3">
            <Ban className="w-6 h-6 text-red-500" />
            <h4 className="font-bold text-red-800 text-lg">Никакой «Колы Зеро»</h4>
        </div>
        <p className="text-sm text-red-800/80 leading-snug mb-3">
            «Но там же ноль калорий!» — скажете вы. Это ловушка. Сладкий вкус (даже от заменителя) обманывает мозг. Он думает, что поступил сахар, и готовит инсулин.
        </p>
        <div className="flex gap-3 items-start bg-white/50 p-3 rounded-xl">
            <span className="text-xl">🐺</span>
            <p className="text-xs font-bold text-red-700 mt-1">
                Итог: дикий, звериный голод через 30 минут. Не дразните зверя. Пейте соленую воду.
            </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm">
              <ThumbsUp className="w-4 h-4" />
              Всего 3 дня, и вы привыкнете
          </div>
      </div>

    </div>
  ),
};
