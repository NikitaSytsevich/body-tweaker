import type { Article } from '../types';
import { Soup, AlertTriangle, Clock, Ban, Apple, UtensilsCrossed } from 'lucide-react';

export const howToExit: Article = {
  id: 'how-to-exit',
  title: 'Выход из голодания: Важнее, чем сам процесс',
  category: 'Безопасность',
  summary: 'Самый опасный этап. Как запустить пищеварение заново, избежать отеков и сохранить лечебный эффект.',
  imageUrl: '/images/articles/2.webp',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      {/* Вступление */}
      <p className="font-medium text-xl text-slate-600 dark:text-slate-300">
        Выход из голодания — это не просто возвращение к еде. Это биологическая перестройка организма с внутреннего питания обратно на внешнее. Ошибка здесь может стоить здоровья и перечеркнуть все результаты.
      </p>

      {/* Блок Опасности */}
      <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)] flex gap-4 mt-2">
        <AlertTriangle className="w-10 h-10 text-red-500 shrink-0" />
        <div>
            <h4 className="font-bold text-red-800 dark:text-rose-300 mb-1 text-lg">Синдром рефидинга</h4>
            <p className="text-sm text-red-800/80 dark:text-rose-200/80 leading-snug">
                Резкий прием углеводов или соли после голода вызывает мощный выброс инсулина. Это задерживает воду (сильные отеки) и вымывает электролиты, что может привести к остановке сердца. Это не шутка.
            </p>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-white/10" />

      {/* Золотое правило */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Золотое правило времени</h3>
        </div>
        <div className="bg-white dark:bg-[#3A3A3C] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/10 text-center">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                Срок выхода должен быть равен сроку голодания.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Голодали 3 дня? Выходите 3 дня. Голодали 7 дней? Строгая диета неделю.
            </p>
        </div>
      </section>

      {/* Этап 1: Жидкое питание */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                <Soup className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Этап 1: Запуск (1-2 день)</h3>
        </div>
        <p className="mb-4">
            Ваш желудок уменьшился, ферменты спят. Твердая пища упадет «камнем». Начинать нужно с жидкостей.
        </p>

        <div className="space-y-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl">
                <h4 className="font-bold text-orange-800 dark:text-orange-100 mb-2">Разбавленные соки</h4>
                <p className="text-sm text-orange-800/80 dark:text-orange-200/80">
                    Свежевыжатый морковный или яблочный сок, разбавленный водой 50/50. Пить маленькими глотками, «жуя» жидкость. Никаких магазинных соков!
                </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-2xl">
                <h4 className="font-bold text-yellow-800 dark:text-yellow-100 mb-2">Овощной отвар</h4>
                <p className="text-sm text-yellow-800/80 dark:text-yellow-200/80">
                    Вода, в которой варились капуста, морковь, картофель. Без овощей, только бульон. Без соли.
                </p>
            </div>
        </div>
      </section>

      {/* Этап 2: Мягкая клетчатка */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Этап 2: «Метла» (3-4 день)</h3>
        </div>
        <p className="mb-4">
            Подключаем клетчатку, чтобы запустить перистальтику кишечника.
        </p>
        <ul className="list-disc pl-5 space-y-3 marker:text-green-500">
            <li><strong>Салат «Метла»:</strong> мелко натертая сырая морковь и капуста. Без масла и соли. Работает как скраб для кишечника.</li>
            <li><strong>Печеные яблоки:</strong> идеальный источник пектина.</li>
            <li><strong>Паровые овощи:</strong> кабачок, брокколи, цветная капуста.</li>
        </ul>
      </section>

      {/* Этап 3: Возвращение */}
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
                <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Этап 3: Плотная еда</h3>
        </div>
        <p>
            Только на этом этапе можно вводить каши на воде (гречка, овсянка), немного растительного масла, орехи (размоченные). Белок (рыба, яйца) вводится в самую последнюю очередь.
        </p>
      </section>

      {/* Запрещенка */}
      <section className="bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-[2rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
            <Ban className="w-8 h-8 text-red-400" />
            <h3 className="text-xl font-bold">Категорически нельзя</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
            {[
                "Соль (вызовет мгновенный отек)",
                "Сахар и сладости (удар по поджелудочной)",
                "Мясо, бульоны, грибы (слишком тяжело)",
                "Хлеб, выпечка, дрожжи",
                "Алкоголь (смертельно опасно)"
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 border-b border-slate-700 dark:border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Совет про жевание */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 text-center">
        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Главный секрет</h4>
        <p className="text-blue-800 dark:text-blue-200 text-lg font-serif italic">
            «Твердое — пить, жидкое — жевать».
        </p>
        <p className="text-blue-700/70 dark:text-blue-300/70 text-sm mt-2">
            Каждый кусочек нужно пережевывать до состояния воды (30-40 раз). Это запустит ферментацию уже во рту.
        </p>
      </div>

    </div>
  ),
};
