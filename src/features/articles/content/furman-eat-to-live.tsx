import type { Article } from '../types';
import { Activity, Apple, Calculator, Salad, Scale, Shield, Target, TrendingDown } from 'lucide-react';

export const furmanEatToLive: Article = {
  id: 'furman-eat-to-live',
  title: 'Ешь и худей по Фурману',
  category: 'Наука о питании',
  summary: 'Потеря веса через плотность нутриентов. Формула: Здоровье = Нутриенты / Калории. 6-недельный план.',
  imageUrl: '/images/articles/new/IMG_0420.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Доктор Джоэл Фурман — врач, специализирующийся на потере веса и профилактике заболеваний через питание. Его подход отличается от большинства диет: вместо подсчёта калорий или ограничений макронутриентов он предлагает фокусироваться на плотности микронутриентов.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
          <div className="flex items-center gap-3 mb-3">
            <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="font-bold text-green-900">Ключевая формула</h4>
          </div>
          <p className="text-base text-green-800 dark:text-green-200/90 leading-relaxed">
            Фурман предлагает простую формулу: <strong>Здоровье = Нутриенты / Калории</strong>. Продукты с высоким соотношением нутриентов к калориям должны составлять основу рациона. Это позволяет съедать больше объёма еды, получая меньше калорий и больше полезных веществ.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Salad className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Плотность нутриентов</h3>
        </div>

        <p className="mb-4">
          Фурман классифицирует продукты по их «плотности нутриентов» — количеству витаминов, минералов, фитоchemicals на единицу калорий.
        </p>

        <h4 className="font-bold text-xl mb-3">Иерархия продуктов по Фурману</h4>
        <div className="space-y-3 mb-6">
          {[
            {
              tier: 'Tier 1: Высокая плотность',
              color: 'green',
              foods: 'Зелёные овощи, капуста, салат, шпинат, брокколи'
            },
            {
              tier: 'Tier 2: Очень высокая',
              color: 'emerald',
              foods: 'Ягоды, бобовые, другие овощи, цельные зерновые'
            },
            {
              tier: 'Tier 3: Умеренная',
              color: 'amber',
              foods: 'Фрукты, крахмалистые овощи, рыба'
            },
            {
              tier: 'Tier 4: Низкая',
              color: 'orange',
              foods: 'Мясо, молочные продукты, яйца'
            },
            {
              tier: 'Tier 5: Очень низкая',
              color: 'red',
              foods: 'Масла, сахар, переработанная еда, фастфуд'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold ${
                  item.color === 'green' ? 'bg-green-500' :
                  item.color === 'emerald' ? 'bg-emerald-500' :
                  item.color === 'amber' ? 'bg-amber-500' :
                  item.color === 'orange' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.tier}</h5>
                  <p className="text-base text-slate-700 dark:text-slate-300">{item.foods}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-3">Логика подхода</h4>
          <p className="text-sm text-emerald-800 dark:text-emerald-200/90 leading-relaxed">
            Если вы заполняете желудок продуктами Tier 1 и 2, вы физически не съедите много калорий. Объём еды создаёт сытость, а высокая концентрация нутриентов снижает аппетит и улучшает метаболизм.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Почему обычные диеты не работают</h3>
        </div>

        <p className="mb-4">
          Фурман критикует популярные подходы к потере веса и объясняет, почему его метод отличается.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              problem: 'Подсчёт калорий',
              critique: 'Ограничивая калории, вы ограничиваете и нутриенты. Организм голодает и замедляет metabolism.'
            },
            {
              problem: 'Низкоуглеводные диеты',
              critique: 'Высокое количество мяса и масел может давать временную потерю веса, но долго не устойчиво.'
            },
            {
              problem: 'Низкожировые диеты',
              critique: 'Замена жиров на сахар и переработанные углеводы не решает проблему дефицита нутриентов.'
            },
            {
              problem: 'Порционный контроль',
              critique: 'Маленькие порции «пустой» еды не насыщают. Вы голодны и сорваетесь.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.problem}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.critique}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <p className="text-base text-blue-900 dark:text-blue-200/90 leading-relaxed">
            Фурман утверждает: проблема не в количестве еды, а в её качестве. Когда вы получаете достаточно нутриентов, организм сам регулирует аппетит. Вы не чувствуете голода, даже если едите меньше калорий.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">6-недельный план</h3>
        </div>

        <p className="mb-4">
          Книга содержит детальный 6-недельный план для потери веса. Это не диета, которую вы бросаете через 6 недель — переход к новому образу питания.
        </p>

        <h4 className="font-bold text-xl mb-3">Основные правила плана</h4>
        <div className="space-y-4 mb-6">
          {[
            {
              rule: 'Правило 90/10',
              desc: '90% еды — из Tier 1-3 (растения). 10% можно потратить на продукты с меньшей плотностью нутриентов.'
            },
            {
              rule: 'Неограниченные овощи',
              desc: 'Зелёные и non-starch овощи можно есть в любом количестве. Они создают объём.'
            },
            {
              rule: 'Ограничение масел',
              desc: 'Масла — это калории без нутриентов. Фурман советует резко ограничить или исключить.'
            },
            {
              rule: 'Бобовые каждый день',
              desc: 'Фасоль, чечевица, нут — основной источник белка и клетчатки.'
            },
            {
              rule: 'Фрукты вместо десерта',
              desc: 'Ягоды и фрукты — сладость с витаминами, не пустой сахар.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.rule}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <h4 className="font-bold text-violet-900 dark:text-violet-100 mb-3">Пример дня</h4>
          <ul className="space-y-2 text-sm text-violet-800 dark:text-violet-200/90">
            <li className="flex items-start gap-2">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Завтрак:</strong> Овсянка с ягодами и семенами</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Обед:</strong> Большой салат с бобовыми, овощами, лимонным dressing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Ужин:</strong> Овощное рагу с фасолью, цельнозерновой рис</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-violet-600 shrink-0">•</span>
              <span><strong>Перекусы:</strong> Фрукты, орехи, сырые овощи</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <TrendingDown className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Механизм потери веса</h3>
        </div>

        <p className="mb-4">
          Фурман объясняет, почему его подход приводит к потере веса без чувства голода.
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Объёмная сытость',
              desc: 'Овощи и фрукты содержат много воды и клетчатки. Они занимают место в желудке, создавая физическое ощущение сытости.'
            },
            {
              title: 'Микронутриентная сытость',
              desc: 'Когда организм получает достаточное количество витаминов и минералов, снижается «скрытый голод» и тягу к еде.'
            },
            {
              title: 'Низкая калорийная плотность',
              desc: 'Вы можете съесть большую тарелку овощей на 200 калорий вместо маленькой бургерной булки на те же 200 калорий.'
            },
            {
              title: 'Стабильный сахар в крови',
              desc: 'Клетчатка замедляет всасывание сахара. Нет резких скачков инсулина, нет резкого падения энергии и голода.'
            },
            {
              title: 'Улучшение метаболизма',
              desc: 'Питательные продукты улучшают функцию митохондрий, щитовидной железы, чувствительность к инсулину.'
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
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Добавки и «здоровые» продукты</h3>
        </div>

        <p className="mb-4">
          Фурман критикует индустрию «здоровых» добавок и объясняет, почему цельная еда превосходит таблетки.
        </p>

        <div className="bg-red-50 dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/30 p-6 rounded-3xl border border-red-100 dark:border dark:border-red-500/20 dark:border-l-4 dark:border-l-red-500 dark:border-y-0 dark:border-r-0 dark:shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]">
          <h4 className="font-bold text-red-900 dark:text-rose-300 mb-3">Синергия нутриентов</h4>
          <p className="text-sm text-red-800/90 leading-relaxed mb-3">
            В цельных продуктах витамины, минералы и фитоchemicals работают вместе. Изолированный additive в таблетке не даёт того же эффекта. Например, витамин C из апельсина лучше усваивается, чем из таблетки, благодаря сопровождающим соединениям.
          </p>
          <p className="text-sm text-red-800/90 leading-relaxed">
            Фурман не против добавок в принципе, но считает, что они должны дополнять, а не заменять хорошее питание.
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Практические выводы</h3>

        <div className="space-y-4">
          {[
            {
              title: 'Начните с добавления, а не исключения',
              desc: 'Сначала добавьте больше овощей и бобовых. Естественным образом вы будете есть меньше «пустой» еды.'
            },
            {
              title: 'Больше зелени',
              desc: 'Зелёные овощи — самый nutrient-dense продукт. Салат, шпинат, капуста должны быть в каждом приёме еды.'
            },
            {
              title: 'Ограничьте масла',
              desc: 'Кокосное, оливковое, авокадо — это 100% жир, 120 калорий на столовую ложку, почти без нутриентов.'
            },
            {
              title: 'Бобовые как основа',
              desc: 'Фасоль, чечевица, нут дают белок, клетчатку, медленные углеводы. Они сытные и питательные.'
            },
            {
              title: 'Фрукты вместо сахара',
              desc: 'Если хочется сладкого, ешьте фрукты. Ягоды особенно полезны.'
            },
            {
              title: 'Не бойтесь углеводов',
              desc: 'Проблема не в углеводах, а в типе углеводов. Цельные зерновые и овощи — хорошие углеводы.'
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
            Подход Фурмана хорошо сочетается с практикой голодания. Высокая плотность нутриентов в еде помогает быстрее восстановиться после голодания и обеспечить организм необходимыми ресурсами. Продукты Tier 1 (зелёные овощи) идеально подходят для первого приема пищи после голодания — они легко усваиваются и дают максимум нутриентов при минимальной нагрузке на пищеварение.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Риски и ограничения</h3>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Резкий переход к высококлетчаточной диете может вызвать вздутие и дискомфорт. Увеличивайте количество клетчатки постепенно.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Людям с диабетом, принимающим инсулин или сахароснижающие препараты, нужна корректировка доз под наблюдением врача.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>При заболеваниях щитовидной железы некоторые крестоцветные овощи могут interfere с функцией при употреблении в больших количествах.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Веганский рацион требует внимания к витамину B12, железу, кальцию, витаминину D.</span>
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
          «Ешь и худей» показывает, что потеря веса не обязательно связана с голоданием и ограничениями. Фокус на продуктах с высокой плотностью нутриентов позволяет есть больше, весить меньше и чувствовать себя лучше. Если вы практикуете голодание, этот подход к питанию поможет закрепить результаты и поддерживать здоровый вес в долгосрочной перспективе.
        </p>
      </div>

    </div>
  ),
};
