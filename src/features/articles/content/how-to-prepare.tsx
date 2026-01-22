import type { Article } from '../types';
import { Leaf, Droplets, Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const howToPrepare: Article = {
  id: 'how-to-prepare',
  title: 'Как правильно подготовиться к голоданию',
  category: 'Гайд',
  summary: 'Полное руководство по входу: питание за 3 дня до старта, процедура очищения и психологический настрой.',
  imageUrl: '/images/articles/1.PNG',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      {/* Вступление */}
      <p className="font-medium text-xl text-slate-600">
        Успех голодания на 90% зависит от того, что вы делали за три дня до его начала. Резкий вход «с места в карьер» — главная ошибка, ведущая к тошноте, головным болям и срывам.
      </p>

      <hr className="border-slate-200" />

      {/* Блок 1: Питание */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">Правило 3-х дней</h3>
        </div>
        <p className="mb-4">
            За трое суток до старта необходимо полностью изменить рацион. Ваша задача — разгрузить печень и почки, чтобы они могли заниматься выводом токсинов, а не перевариванием тяжелой пищи.
        </p>
        
        <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
            <h4 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Строго исключить</h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Животный белок:</strong> мясо, рыбу, яйца, творог. Продукты распада белка при голодании усиливают интоксикацию.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Алкоголь и кофеин:</strong> они вызывают обезвоживание и спазм сосудов.</span>
                </li>
                <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 shrink-0" />
                    <span><strong>Сахар и мучное:</strong> вызывают резкие скачки инсулина, что сделает голод невыносимым.</span>
                </li>
            </ul>
        </div>

        <p className="mt-6 mb-4">
            <strong>Что нужно есть:</strong> каши на воде (гречка, овсянка), тушеные овощи, свежие фрукты, салаты с небольшим количеством масла.
        </p>
      </section>

      {/* Блок 2: Процедура очищения */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">«Выключение» голода</h3>
        </div>
        <p className="mb-4">
            Особенность классического (советского) подхода РДТ — принудительное очищение кишечника перед стартом. Это делается не просто для чистоты.
        </p>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <p className="font-medium text-blue-900 mb-2">
                Пока в кишечнике есть остатки пищи, организм продолжает требовать еду.
            </p>
            <p className="text-blue-800/80 text-base">
                Как только кишечник становится абсолютно пустым (после приема сульфата магния или клизмы), пищевой центр в мозгу «засыпает». Чувство голода исчезает практически полностью.
            </p>
        </div>
        
        <h4 className="font-bold text-xl mt-6 mb-3">Протокол Магнезии:</h4>
        <ol className="list-decimal pl-5 space-y-3 marker:text-blue-500 marker:font-bold">
            <li>Купите в аптеке <strong>Сульфат Магния</strong> (порошок, 40-60г).</li>
            <li>Вечером перед днем голода растворите пакет в стакане теплой воды.</li>
            <li>Выпейте залпом (вкус горький, можно запить водой с лимоном).</li>
            <li>В течение часа процедура очищения завершится.</li>
        </ol>
      </section>

      {/* Блок 3: Психология */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-xl">
                <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900">Настройка сознания</h3>
        </div>
        <p>
            Голодание — это стресс только если вы воспринимаете его как лишение. Поменяйте установку.
        </p>
        <div className="my-6 p-6 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                Аффирмация
            </span>
            <p className="text-xl font-serif italic leading-relaxed">
                «Я не лишаю себя еды. Я даю своему организму долгожданный отпуск. Это лечебная процедура, операция без ножа, которую проводит сама природа.»
            </p>
        </div>
      </section>

      {/* Блок 4: Чек-лист */}
      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Чек-лист готовности</h3>
        <div className="space-y-4">
            {[
                "Я исключил мясо и кофе за 3 дня до старта",
                "Я купил магнезию или кружку Эсмарха",
                "Я выбрал день, когда мне не нужно много работать",
                "Я предупредил близких, чтобы меня не дразнили едой",
                "Я пью не менее 2 литров воды в день"
            ].map((item, i) => (
                <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 text-base">{item}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Важное предупреждение */}
      <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex gap-4 mt-8">
        <AlertTriangle className="w-8 h-8 text-orange-500 shrink-0" />
        <div>
            <h4 className="font-bold text-orange-800 mb-1">Противопоказания</h4>
            <p className="text-sm text-orange-700/80 leading-snug">
                Не начинайте голодание при беременности, диабете 1 типа, дефиците массы тела или острых заболеваниях ЖКТ без консультации врача.
            </p>
        </div>
      </div>

    </div>
  ),
};
