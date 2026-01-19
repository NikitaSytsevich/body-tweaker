import type { Article } from '../types';
import { Citrus, Trash2, Wind, Pipette } from 'lucide-react';

export const mucuslessDiet: Article = {
  id: 'mucusless-diet',
  title: 'Теория Слизи: Чистые трубы',
  category: 'Детокс',
  summary: 'Арнольд Эрет и его «Бесслизистая диета». Почему мы болеем и как фрукты работают «метлой» для организма.',
  imageUrl: '/images/articles/mucusless.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          Представьте водопроводную систему, в которую годами сбрасывали жир, волосы и мусор. Трубы забиты. Вода едва сочится. Это — кишечник и сосуды современного человека.
        </p>
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <h4 className="font-bold text-orange-900 mb-2">Формула Жизни по Эрету</h4>
            <p className="text-xl font-mono font-black text-orange-600 mb-2">V = P - O</p>
            <p className="text-sm text-orange-800/80">
                <strong>V (Vitality)</strong> — Жизненная сила<br/>
                <strong>P (Power)</strong> — Мощь (энергия тела)<br/>
                <strong>O (Obstruction)</strong> — Засорение (слизь, токсины)<br/><br/>
                Мы слабы не потому, что нам не хватает еды (энергии), а потому, что наше Засорение (O) слишком велико. Уберите препятствия, и энергия потечет рекой.
            </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Что такое Слизь?</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Клей внутри нас</h4>
        </div>
        <p className="mb-4">
            По Эрету, продукты распада крахмалов, молочки и мяса образуют вязкую субстанцию — слизь. Она выстилает ЖКТ, забивает носовые пазухи (привет, хронический насморк) и легкие.
        </p>
        <p>
            Болезнь — это попытка тела экстренно выбросить эту слизь (кашель, температура, высыпания). Мы сбиваем температуру таблетками, загоняя грязь обратно.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Фрукты как Растворитель</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-xl">
                <Citrus className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Агрессивное очищение</h4>
        </div>
        <p className="mb-4">
            Сырые фрукты (особенно цитрусовые) и зелень — это не «еда». Это мыло. Они агрессивно растворяют залежи старой слизи. 
        </p>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-4">
            <div className="flex gap-3 mb-2">
                <Pipette className="w-5 h-5 text-blue-500" />
                <h5 className="font-bold text-slate-800">Монодиета (Изюм)</h5>
            </div>
            <p className="text-sm text-slate-500">
                Легендарный Изюм предлагал есть один вид продукта за раз. Только яблоки. Или только морковь. Это экономит энергию пищеварения и направляет её на очистку.
            </p>
        </div>
      </section>

      <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
            <Wind className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-blue-900">Сухой пост</h4>
        </div>
        <p className="text-sm text-blue-800/80 leading-relaxed">
            По Эрету и Атерову, сухой пост (без воды) — это сжигание мусора в доменной печи. Температура тела внутри клеток растет, сжигая все чужеродное. Но к этому нужно готовиться годами.
        </p>
      </section>

    </div>
  ),
};
