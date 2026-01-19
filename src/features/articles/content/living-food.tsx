import type { Article } from '../types';
import { 
  Sun, 
  Flame, 
  HeartHandshake, 
  Microscope,
  BatteryCharging,
  AlertTriangle
} from 'lucide-react';

export const livingFood: Article = {
  id: 'living-food',
  title: 'Живая еда: Энергетика питания',
  category: 'Философия',
  summary: 'Арнольд Эрет, Лев Толстой и концепция «чистого топлива». Почему вареная еда забирает энергию, а сырая — дает.',
  imageUrl: '/images/articles/living-food.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      {/* Вступление */}
      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          Мы привыкли считать еду в калориях. Но яблоко и пончик могут иметь одинаковую калорийность, при этом одно тело строит, а другое — разрушает. Разница не в цифрах, а в <strong>жизненной силе</strong>.
        </p>
      </section>

      {/* Теория Эрета */}
      <section className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 mb-8">
        <h3 className="text-2xl font-[900] text-orange-900 mb-4">Формула Жизни</h3>
        <p className="mb-4 text-orange-800/90 text-base">
            В начале XX века профессор Арнольд Эрет предложил формулу, которая перевернула натуропатию:
        </p>
        <div className="bg-white/60 p-4 rounded-2xl text-center mb-4 backdrop-blur-sm">
            <p className="text-3xl font-mono font-black text-orange-600 tracking-wider">V = P - O</p>
        </div>
        <ul className="space-y-2 text-sm text-orange-800/80">
            <li><strong>V (Vitality)</strong> — Жизненная сила (то, как вы себя чувствуете).</li>
            <li><strong>P (Power)</strong> — Энергия тела (ресурс нервной системы).</li>
            <li><strong>O (Obstruction)</strong> — Засорение (слизь, токсины, лишний вес).</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-orange-200/50">
            <p className="text-sm font-bold text-orange-900">
                Вывод: Чтобы стать сильнее, не нужно больше есть (увеличивать P). Нужно меньше засорять себя (уменьшать O).
            </p>
        </div>
      </section>

      {/* Пищевой лейкоцитоз */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Microscope className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">Наука: Пищевой лейкоцитоз</h3>
        </div>
        <p className="mb-4">
            В 1930-х годах доктор Кучаков открыл удивительный феномен. После приема вареной пищи количество лейкоцитов (иммунных клеток) в крови резко возрастает. 
        </p>
        <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
            <p className="text-sm text-slate-600 mb-2">
                Организм воспринимает термически обработанную еду как <strong>чужеродный вирус</strong> и мобилизует армию защиты.
            </p>
            <p className="text-sm text-slate-600">
                В итоге, вместо того чтобы давать энергию, обед забирает ресурс иммунитета. Именно поэтому после плотного вареного обеда так хочется спать.
            </p>
        </div>
        <p className="mt-4 font-bold text-green-700">
            Важно: При употреблении сырой пищи лейкоцитоз не возникает. Организм принимает её как «свою».
        </p>
      </section>

      {/* Энзимы */}
      <section className="my-8">
        <h3 className="text-2xl font-[900] text-slate-900 mb-4">Загадка Энзимов</h3>
        <p className="mb-4">
            Энзимы (ферменты) — это «рабочие», которые разбирают еду на кирпичики.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-2 -mt-2 z-0" />
                <div className="relative z-10">
                    <h4 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <Flame className="w-5 h-5"/>
                        Вареная еда
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        При нагревании выше 43°C энзимы погибают. Еда становится «мертвой материей». Чтобы её переварить, организм вынужден тратить <strong>свои собственные</strong> запасы ферментов. Это истощает поджелудочную железу и ускоряет старение.
                    </p>
                </div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-2 -mt-2 z-0" />
                <div className="relative z-10">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                        <Sun className="w-5 h-5"/>
                        Живая еда
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Сырое яблоко содержит в себе всё необходимое для собственного переваривания. Это «самораспаковывающийся архив». Организм почти не тратит энергию, получая чистую глюкозу и витамины.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Практика: Переход */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">Как начать?</h3>
        </div>
        <p className="mb-4">
            Не нужно завтра становиться 100% сыроедом. Это приведет к срыву. Начните с малого:
        </p>
        
        <div className="space-y-3">
            <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0 mt-0.5">1</span>
                <div>
                    <h5 className="font-bold text-slate-800">Завтрак только из фруктов</h5>
                    <p className="text-sm text-slate-500">До 12:00 ешьте только сочные фрукты. Это продлит ночное очищение.</p>
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0 mt-0.5">2</span>
                <div>
                    <h5 className="font-bold text-slate-800">Салат перед едой</h5>
                    <p className="text-sm text-slate-500">Всегда начинайте обед с большой тарелки сырого салата. Это создаст «ферментную подушку».</p>
                </div>
            </div>
            <div className="flex gap-4 items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold shrink-0 mt-0.5">3</span>
                <div>
                    <h5 className="font-bold text-slate-800">Моно-дни</h5>
                    <p className="text-sm text-slate-500">Раз в неделю устраивайте день на одном виде фруктов (например, только арбузы или яблоки).</p>
                </div>
            </div>
        </div>
      </section>

      {/* Этика Толстого */}
      <section className="bg-slate-100 p-6 rounded-[2rem] mt-8">
        <div className="flex items-center gap-3 mb-3">
            <HeartHandshake className="w-6 h-6 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800">Нравственный аспект</h3>
        </div>
        <p className="text-sm text-slate-600 italic mb-4 border-l-4 border-slate-300 pl-4">
            «Пока существуют скотобойни, будут и поля битв. Вегетарианство — это первая ступень к нравственному возрождению». <br/>— Лев Толстой
        </p>
        <p className="text-sm text-slate-600">
            Очищение тела невозможно без очищения мыслей. Тяжелая пища, полученная через насилие, «заземляет» сознание, делает его инертным и агрессивным. Легкая пища дает ясность ума и спокойствие.
        </p>
      </section>

      {/* Предупреждение */}
      <div className="flex gap-3 items-center mt-8 opacity-70">
        <AlertTriangle className="w-5 h-5 text-slate-400" />
        <p className="text-xs text-slate-400">
            Резкий переход на сыроедение может вызвать сильную детоксикацию ("криз"). Действуйте плавно.
        </p>
      </div>

    </div>
  ),
};
