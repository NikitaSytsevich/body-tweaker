import type { Article } from '../types';
import { Apple, BookOpen, CheckCircle2, ListOrdered, Shield, Target } from 'lucide-react';

export const gregerHowNotToDie: Article = {
  id: 'greger-how-not-to-die',
  title: 'Как не умереть раньше времени',
  category: 'Наука о питании',
  summary: 'Доказательный подход к питанию: 15 причин смерти и как еда влияет на риск заболеваний. Ежедневная порция (Daily Dozen).',
  imageUrl: '/images/articles/new/IMG_0419.webp',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Доктор Майкл Грегер — врач, специализирующийся на нутрициологии. Его подход отличается от многих популярных диетологов: он не опирается на теории или авторитеты, а systematically разбирает научные исследования и извлекает из них практические рекомендации.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Структура книги</h4>
          </div>
          <p className="text-base text-blue-800 dark:text-blue-200/90 leading-relaxed">
            Первая часть посвящена 15 ведущим причинам смерти — от болезней сердца до диабета. Для каждой Грегер разбирает, какие продукты повышают риск, а какие снижают. Вторая часть — практическая: что именно и в каком количестве есть каждый день для профилактики.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">15 причин смерти</h3>
        </div>

        <p className="mb-4">
          Грегер систематизировал исследования по основным причинам преждевременной смерти. Для каждого заболевания он выделил продукты, которые научно доказанно влияют на риск.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              disease: 'Болезни сердца',
              food: 'Орехи, бобовые, цельные зерновые'
            },
            {
              disease: 'Рак лёгких',
              food: 'Крестоцветные овощи (капуста, брокколи)'
            },
            {
              disease: 'Диабет',
              food: 'Цельные зерновые, клетчатка'
            },
            {
              disease: 'Высокое давление',
              food: 'Свёкла, зелень, богаты калием продукты'
            },
            {
              disease: 'Рак кишечника',
              food: 'Клетчатка, бобовые, чеснок'
            },
            {
              disease: 'Болезни печени',
              food: 'Кофе, крестоцветные овощи'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.disease}</h5>
                <span className="text-sm text-green-600 dark:text-green-400">{item.food}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]">
          <h4 className="font-bold text-red-900 dark:text-rose-300 mb-3">Паттерн продуктов</h4>
          <p className="text-sm text-red-800/90 leading-relaxed">
            Растительные продукты (овощи, фрукты, бобовые, орехи, цельные зерновые) в исследованиях последовательно ассоциируются с более низким риском хронических заболеваний. Переработанные продукты, мясо, молочные продукты часто показывают обратную связь.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <ListOrdered className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Ежедневная дюжина (Daily Dozen)</h3>
        </div>

        <p className="mb-4">
          Самая известная часть книги — Daily Dozen, список продуктов и практик, которые Грегер рекомендует включать в ежедневный рацион. Это не строгая диета, а скорее чек-лист разнообразного питания.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              category: '1. Бобовые',
              amount: '3 порции',
              examples: 'Фасоль, горох, чечевица, нут'
            },
            {
              category: '2. Зелень',
              amount: '1-2 порции',
              examples: 'Шпинат, капуста, листовая зелень'
            },
            {
              category: '3. Крестоцветные',
              amount: '1 порция',
              examples: 'Брокколи, капуста, цветная капуста'
            },
            {
              category: '4. Другие овощи',
              amount: '2 порции',
              examples: 'Морковь, свёкла, помидоры'
            },
            {
              category: '5. Фрукты',
              amount: '3 порции',
              examples: 'Ягоды особенно полезны'
            },
            {
              category: '6. Цельные зерновые',
              amount: '3 порции',
              examples: 'Овсянка, гречка, бурый рис'
            },
            {
              category: '7. Специи',
              amount: '1 порция',
              examples: 'Турмерик особенно'
            },
            {
              category: '8. Напитки',
              amount: '5 стаканов',
              examples: 'Вода, чай, кофе'
            },
            {
              category: '9. Упражнения',
              amount: '90 минут',
              examples: 'Активность в день'
            },
            {
              category: '10. Орехи и семена',
              amount: '1 порция',
              examples: 'Грецкие, миндаль, льняное'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.category}</h5>
                    <span className="text-sm text-green-600 font-semibold">{item.amount}</span>
                  </div>
                  <p className="text-sm font-medium text-xl text-slate-600 dark:text-slate-300">{item.examples}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
          <p className="text-base text-green-900 leading-relaxed">
            Daily Dozen — это не обязательно жёстко следовать каждому пункту каждый день. Это ориентир для разнообразия. Если сегодня вы не съели все greens, это нормально. Главное — общий тренд питания.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Apple className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Ключевые продукты-суперфуды</h3>
        </div>

        <p className="mb-4">
          Грегер выделяет несколько продуктов, которые особенно хорошо изучены и показывают выраженные эффекты в исследованиях.
        </p>

        <div className="space-y-4">
          {[
            {
              name: 'Чеснок и лук',
              benefit: 'Антираковые свойства, сердечно-сосудистая защита',
              note: 'Нарезайте и давите за 10 минут до готовки'
            },
            {
              name: 'Ягоды',
              benefit: 'Антиоксиданты, защита мозга, когнитивные функции',
              note: 'Голубика и клубника особенно изучены'
            },
            {
              name: 'Крестоцветные',
              benefit: 'Детоксикация печени, защита от рака',
              note: 'Брокколи лучше на пару, не варить'
            },
            {
              name: 'Бобовые',
              benefit: 'Диабет, вес, сердечно-сосудистые заболевания',
              note: 'Чечевица, фасоль, нут — каждый день'
            },
            {
              name: 'Орехи',
              benefit: 'Долголетие, сердечно-сосудистые заболевания',
              note: 'Грецкие особенно для мозга'
            },
            {
              name: 'Турмерик (куркума)',
              benefit: 'Противовоспалительный, антираковый',
              note: 'С чёрным перцем для усвоения'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.name}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300 mb-2">{item.benefit}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Продукты для ограничения</h3>
        </div>

        <p className="mb-4">
          Грегер не призывает полностью исключать какие-то продукты, но он выделяет категории, которые в исследованиях ассоциируются с повышенным риском заболеваний.
        </p>

        <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)] mb-6">
          <h4 className="font-bold text-red-900 dark:text-rose-300 mb-3">На что обратить внимание</h4>
          <ul className="space-y-2 text-sm text-red-800/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Переработанное мясо:</strong> колбасы, бекон, сосиски — ВОЗ классифицирует как канцероген</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Сахарные напитки:</strong> соки, газировка, сладкий кофе — риск диабета и ожирения</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Трансжиры:</strong> частично гидрогенизированные масла — воспаление и сердце</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Избыток соли:</strong> переработанные продукты — давление и сердце</span>
            </li>
          </ul>
        </div>

        <p>
          Грегер подчёркивает: важно не только то, что вы добавляете в рацион, но и то, чем заменяете вредные продукты. Замена колбасы на фасоль — не просто удаление «плохого», но и добавление «хорошего».
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Научный подход</h3>
        </div>

        <p className="mb-4">
          Одна из сильных сторон книги — опора на исследования. Грегер не даёт советов «попробуйте, может поможет», а опирается на мета-анализы и рандомизированные контролируемые исследования.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Источники данных</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Грегер использует исследования из PubMed, базу данных медицинских публикаций. Он особенно ценит мета-анализы — исследования, которые объединяют результаты многих исследований.
            </p>
          </div>

          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Ограничения исследований</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Грегер признаёт ограничения. Большинство исследований по питанию наблюдательные, не экспериментальные. Корреляция не всегда означает причинность. Но когда множество исследований показывает один паттерн, это значимо.
            </p>
          </div>
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <p className="text-base text-violet-900 leading-relaxed">
            Важно понимать: наука о питании постоянно развивается. То, что кажется доказанным сегодня, может быть пересмотрено завтра. Грегер не предлагает «истину в последней инстанции», а даёт recommendations основанные на текущих данных.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Практические выводы</h3>

        <div className="space-y-4">
          {[
            {
              title: 'Разнообразие важнее одного «суперфуда»',
              desc: 'Не сосредотачивайтесь на одном «чудо-продукте». Ешьте разнообразную растительную еду.'
            },
            {
              title: 'Ешьте цельные продукты',
              desc: 'Вместо добавок старайтесь получить нутриенты из цельной еды. Синергия компонентов важнее.'
            },
            {
              title: 'Замена, а не ограничение',
              desc: 'Вместо «не ешьте Х» думайте «замени Х на Y». Это более устойчивый подход.'
            },
            {
              title: 'Постепенность',
              desc: 'Резкий переход к веганству может быть сложным. Начните с добавления больше растений.'
            },
            {
              title: 'Витамин B12',
              desc: 'Если вы исключаете животные продукты, обязательно добавляйте B12. Это consensus научного сообщества.'
            },
            {
              title: 'Еда — это профилактика',
              desc: 'Грегер не предлагает питание как лечение существующих заболеваний. Это прежде всего профилактика.'
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
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Связь с голоданием</h3>

        <div className="bg-slate-50 dark:bg-[#3A3A3C] p-6 rounded-3xl border border-slate-100 dark:border-white/10">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Грегер напрямую не обсуждает голодание, но его подход к питанию хорошо сочетается с практикой периодических отказов от еды. Растительная диета, богатая клетчаткой, может облегчить вход и выход из голодания. Кроме того, продукты из Daily Dozen (особенно ягоды, крестоцветные, зелень) отлично подходят для первого приема пищи после голодания.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Критика и ограничения</h3>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Некоторые исследователи указывают на то, что данные наблюдательных исследований могут переоценивать эффекты растительной диеты</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Полноценный веганский рацион требует планирования, особенно для B12, железа, кальция, витамина D</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Индивидуальные различия в генетике и микробиоме могут влиять на то, как диета влияет на здоровье</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Доступность свежих продуктов может ограничивать реализацию рекомендаций</span>
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <ListOrdered className="w-6 h-6 text-green-400" />
          <h4 className="font-bold">Главный урок книги</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          «Как не умереть раньше времени» даёт framework для мышления о еде как о профилактике болезней. Daily Dozen — это не жёсткая диета, а ориентир для разнообразного растительного питания. Если вы практикуете голодание, продукты из этой книги отлично подходят для здорового питания в периоды между голоданиями.
        </p>
      </div>

    </div>
  ),
};
