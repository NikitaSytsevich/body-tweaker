import type { Article } from '../types';
import { Activity, Apple, Dumbbell, Heart, Leaf, Shield, Zap } from 'lucide-react';

export const meatForWeaklings: Article = {
  id: 'meat-for-weaklings',
  title: 'Мясо для слабаков',
  category: 'Питание и этика',
  summary: 'Разбор мифов о мясе и силе. Исторические примеры, энергетическая эффективность и практические аспекты.',
  imageUrl: '/images/articles/new/IMG_0422.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Книга Боба и Дженн «Мясо для слабаков» исследует распространённый миф: для силы и здоровья обязательно нужно есть мясо. Авторы собирают исторические, биологические и практические данные, которые показывают более сложную картину.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-3">
            <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Центральный тезис</h4>
          </div>
          <p className="text-base text-blue-800 dark:text-blue-200/90 leading-relaxed">
            Мясо не является необходимым условием для физической силы, мышечного роста или здоровья. История знает множество примеров сильных и выносливых людей, которые не потребляли мясо. Растительное питание может обеспечить все необходимые нутриенты для активной жизни.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Исторические примеры</h3>
        </div>

        <p className="mb-4">
          Авторы приводят исторические данные, которые противоречат распространённому мнению о связи мяса и силы.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              example: 'Гладиаторы Рима',
              detail: 'Археологические исследования показывают, что большинство гладиаторов питались в основном растительной пищей. Их называли «hordearii» — «едоки ячменя».'
            },
            {
              example: 'Древние греки',
              detail: 'Олимпийские атлеты и воины часто тренировались на вегетарианской диете. Платон и Сократ выступали против излишнего потребления мяса.'
            },
            {
              example: 'Сильнейшие животные',
              detail: 'Горилла, лошадь, слон — вегетарианцы. Буйвол, который травоядный, может выиграть борьбу у льва. Мышечная масса не требует мяса.'
            },
            {
              example: 'Современные атлеты',
              detail: 'Множество чемпионов по бодибилдингу, силовым видам спорта, ультрамарафонцам — вегетарианцы.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.example}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30">
          <p className="text-base text-amber-900 leading-relaxed">
            Корреляция между потреблением мяса и физической силой не подтверждается ни исторически, ни биологически. Сила зависит от тренировок, генетики, общего питания и восстановления, а не от присутствия мяса в рационе.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Энергетическая эффективность</h3>
        </div>

        <p className="mb-4">
          Биологический argument против необходимости мяса связан с энергетической эффективностью питания.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 mb-6">
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-3">Энергетическая цепочка</h4>
          <p className="text-sm text-green-800 dark:text-green-200/90 leading-relaxed mb-3">
            Когда человек ест мясо, он получает энергию, которая уже прошла через один цикл переработки. Растение → животное → человек. На каждом этапе теряется около 90% энергии.
          </p>
          <p className="text-sm text-green-800 dark:text-green-200/90 leading-relaxed">
            Когда человек ест растения напрямую, он получает энергию первого цикла. Растение → человек. Это более эффективно и требует меньше пищеварительных затрат.
          </p>
        </div>

        <h4 className="font-bold text-xl mb-3">Пищеварительные затраты</h4>
        <div className="space-y-4">
          {[
            {
              food: 'Мясо',
              effort: 'Высокий',
              detail: 'На переваривание мяса организм тратит значительное количество энергии и времени. 4-6 часов в желудке.'
            },
            {
              food: 'Растительная еда',
              effort: 'Разный',
              detail: 'Фрукты перевариваются быстро (1-2 часа). Зерновые и бобовые дольше, но всё равно меньше мяса. Овощи — в среднем.'
            },
            {
              food: 'Клетчатка',
              effort: 'Положительный',
              detail: 'Ускоряет прохождение пищи, улучшает пищеварение, снижает net затраты энергии.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.food}</h5>
                  <p className="text-sm font-medium text-xl text-slate-600 dark:text-slate-300">{item.detail}</p>
                </div>
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-full text-sm font-semibold">
                  {item.effort}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Здоровье и заболевания</h3>
        </div>

        <p className="mb-4">
          Книга также затрагивает аспекты здоровья, связанные с потреблением и исключением мяса.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              topic: 'Сердечно-сосудистые заболевания',
              info: 'Множество исследований показывают связь между красным мясом и повышенным риском болезней сердца. Растительная диета ассоциируется с более низким риском.'
            },
            {
              topic: 'Диабет 2 типа',
              info: 'Потребление переработанного мяса ассоциируется с повышенным риском диабета. Растительная диета может улучшать чувствительность к инсулину.'
            },
            {
              topic: 'Рак',
              info: 'ВОЗ классифицирует переработанное мясо как канцероген группы 1, красное мясо — группы 2A. Растительная диета ассоциируется с более низким риском многих видов рака.'
            },
            {
              topic: 'Воспаление',
              info: 'Мясо, особенно жареное, содержит продукты гликации и другие воспалительные соединения. Растительная еда содержит противовоспалительные фитоchemicals.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.topic}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.info}</p>
            </div>
          ))}
        </div>

        <div className="bg-red-50 dark:bg-red-950/80 p-6 rounded-3xl border border-red-100 dark:border-red-800/50">
          <p className="text-base text-red-900 dark:text-rose-300 leading-relaxed">
            Важно понимать: корреляция не доказывает причинность. Исследования по питанию часто наблюдательные. Однако общий паттерн ясен: большие количества мяса, особенно переработанного, ассоциируются с повышенным риском хронических заболеваний.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Практические аспекты вегетарианства</h3>
        </div>

        <p className="mb-4">
          Если вы решаете уменьшить или исключить мясо,_book предлагает практические рекомендации.
        </p>

        <h4 className="font-bold text-xl mb-3">Источники белка без мяса</h4>
        <div className="space-y-3 mb-6">
          {[
            {
              source: 'Бобовые',
              protein: '15-20г на cup',
              note: 'Фасоль, чечевица, нут — основные источники'
            },
            {
              source: 'Соя',
              protein: '10-15г на cup',
              note: 'Тофу, темпе, эдамаме — полный белок'
            },
            {
              source: 'Зерновые',
              protein: '5-10г на cup',
              note: 'Киноа, амарант — полный белок'
            },
            {
              source: 'Орехи и семена',
              protein: '5-10г на 30г',
              note: 'Грецкие, миндаль, chia, hemp'
            },
            {
              source: 'Овощи',
              protein: '2-5г на cup',
              note: 'Брокколи, шпинат — дополнение'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.source}</h5>
                  <p className="text-sm font-medium text-xl text-slate-600 dark:text-slate-300">{item.note}</p>
                </div>
                <div className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                  {item.protein}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="font-bold text-xl mb-3">Нутриенты, требующие внимания</h4>
        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <ul className="space-y-2 text-sm text-violet-800 dark:text-violet-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong>Витамин B12:</strong> Не содержится в растениях. Вегетарианцам нужно добавлять.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong>Железо:</strong> Растительное железо (non-heme) усваивается хуже. Комбинируйте с витамином C.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong>Кальций:</strong> Если не употребляете молочные продукты, включайте обогащённые продукты.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong>Омега-3:</strong> ALA из растений (льняное, грецкие), но EPA/DHA из водорослей.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span><strong>Витамин D:</strong> Получайте от солнца или добавки, независимо от типа питания.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 font-medium text-xl text-slate-600 dark:text-slate-300 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Переход к растительному питанию</h3>
        </div>

        <p className="mb-4">
          Авторы не призывают к резкому отказу от мяса. Постепенный переход более устойчив и эффективен.
        </p>

        <div className="space-y-4">
          {[
            {
              step: 'Неделя 1-2: Замена',
              desc: 'Замените мясо в 2-3 приёмах еды на растительные альтернативы. Бобовые, tofu, грибы.'
            },
            {
              step: 'Неделя 3-4: Эксперименты',
              desc: 'Попробуйте новые рецепты и продукты. Индийская, ближневосточная, азиатская кухни богаты вегетарианскими блюдами.'
            },
            {
              step: 'Неделя 5-6: Планирование',
              desc: 'Научитесь планировать рацион так, чтобы получать достаточно белка и нутриентов.'
            },
            {
              step: 'Долгосрочно: Баланс',
              desc: 'Найдите баланс, который работает для вас. Некоторые люди сохраняют небольшое количество мяса, другие переходят полностью.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.step}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Практические выводы</h3>

        <div className="space-y-4">
          {[
            {
              title: 'Мясо не обязательно для силы',
              desc: 'Физическая сила зависит от тренировок и общего питания, а не от потребления мяса.'
            },
            {
              title: 'Растительное питание может быть полноценным',
              desc: 'С планированием и вниманием к ключевым нутриентам вегетарианская диета обеспечивает все потребности организма.'
            },
            {
              title: 'Постепенность — ключ к успеху',
              desc: 'Резкий переход к вегетарианству может быть сложным. Начните с уменьшения количества мяса.'
            },
            {
              title: 'Разнообразие важнее одного «суперфуда»',
              desc: 'Ешьте разнообразную растительную еду: бобовые, зерновые, овощи, фрукты, орехи, семена.'
            },
            {
              title: 'Слушайте организм',
              desc: 'Если чувствуете усталость, слабость — проверьте уровень B12, железа, general калорийность.'
            },
            {
              title: 'Не идеализируйте вегетарианство',
              desc: 'Вегетарианец может питаться нездорово (чипсы, сладости, фастфуд без мяса). Качество еды имеет значение.'
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
            Многие люди, практикующие голодание, отмечают, что после отказа от еды мясо становится менее привлекательным. Организм инстинктивно выбирает более лёгкую растительную пищу. Если вы голодали, это может быть естественным моментом для перехода к более растительному питанию. Продукты, рекомендуемые в книге (бобовые, овощи, фрукты), идеально подходят для здорового питания между голоданиями.
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
              <span>Исторические примеры selective — не все сильные люди были вегетарианцами</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Некоторые люди ощущают улучшение самочувствия при умеренном потреблении мяса</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Индивидуальные различия в генетике влияют на оптимальный тип питания</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Вегетарианство требует планирования и знаний о нутриентах</span>
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <Apple className="w-6 h-6 text-green-400" />
          <h4 className="font-bold">Главный урок книги</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          «Мясо для слабаков» показывает, что распространённый миф о необходимости мяса для силы не поддерживается ни историей, ни биологией. Растительное питание может быть полноценным и обеспечивать все потребности активного организма. Если вы практикуете голодание или рассматриваете переход к более здоровому питанию, уменьшение количества мяса — разумный шаг, который сочетается с пользой голодания для здоровья.
        </p>
      </div>

    </div>
  ),
};
