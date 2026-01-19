import type { Article } from '../types';
import { Droplets, Bone, ShieldAlert, BadgeCheck } from 'lucide-react';

export const waterTruth: Article = {
  id: 'water-truth',
  title: 'Мифы о воде: Брэгг против всех',
  category: 'Продвинутый',
  summary: 'Поль Брэгг считал обычную воду ядом. Почему он пил только дистиллят и считал, что минералы делают нас «каменными».',
  imageUrl: '/images/articles/bragg-water.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3 mb-6">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 font-bold leading-snug">
            Внимание: Эта статья представляет альтернативную точку зрения классиков натуропатии. Она противоречит современной медицине, но важна для понимания истории голодания.
        </p>
      </div>

      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          Поль Брэгг, автор бестселлера «Чудо голодания», умер в 95 лет (по легенде, катаясь на серфе). Его главным секретом была вода. Но не простая.
        </p>
        <h3 className="text-2xl font-[900] text-slate-900 mb-4">Теория окаменения</h3>
        <p className="mb-4">
            Брэгг утверждал: <strong>«Человек умирает от того, что заизвестковывается»</strong>.
        </p>
        <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Bone className="w-5 h-5 text-slate-400"/>
                    Неорганические минералы
                </h4>
                <p className="text-sm text-slate-500">
                    Кальций и магний в воде из-под крана или в минералке — это неорганика. По Брэггу, организм не может их усвоить. Они оседают на стенках сосудов, в суставах (артрит) и в почках (камни).
                </p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-500"/>
                    Органические минералы
                </h4>
                <p className="text-sm text-slate-500">
                    Только растение может переработать «камень» в живую форму. Мы должны получать минералы из соков фруктов и овощей, а не из воды.
                </p>
            </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Дистиллированная вода</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-xl">
                <Droplets className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Великий Растворитель</h4>
        </div>
        <p className="mb-4">
            Брэгг пил только дистиллированную воду (H₂O в чистом виде). Он считал, что она работает как губка — притягивает к себе неорганические соли из суставов и сосудов и выводит их прочь.
        </p>
        <blockquote className="border-l-4 border-cyan-400 pl-4 py-2 italic text-slate-600 bg-slate-50 rounded-r-xl">
            «Жесткая вода — это цемент для вашей старости. Дистиллированная вода — это растворитель вашей смерти».
        </blockquote>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-bold text-slate-900 mb-3">Что делать нам?</h3>
        <p>
            Герберт Шелтон (другой классик) спорил с Брэггом и считал, что дистиллят вымывает и полезные соли тоже.
        </p>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 mt-4">
            <div className="flex items-center gap-2 mb-2">
                <BadgeCheck className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-800">Компромисс</span>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>На коротких голоданиях (до 3 дней) можно пить обычную фильтрованную воду с электролитами.</li>
                <li>На длительных курсах очищения многие практикуют курсы дистиллята для «промывки», но с осторожностью.</li>
            </ul>
        </div>
      </section>

    </div>
  ),
};

// Вспомогательный импорт для иконки Leaf, так как она используется в JSX
function Leaf(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
    )
}
