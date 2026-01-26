import type { Article } from '../types';
import { Apple, Droplet, Grape, Leaf, Salad, Shield, Sunrise } from 'lucide-react';

export const rawFoodMonodiet: Article = {
  id: 'raw-food-monodiet',
  title: 'Сыроедческая монодиета',
  category: 'Сыроедение',
  summary: 'Фруктомонодиеты как способ глубокого очищения. Польза и риски длительного сыроедения.',
  imageUrl: '/images/articles/new/IMG_0423.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          Сыроедение — практика питания продуктами без термической обработки. Книга «Сыроедческая монодиета» фокусируется на особом подходе: временном питании одним типом сырых продуктов, обычно фруктов, для глубокого очищения организма.
        </p>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
          <div className="flex items-center gap-3 mb-3">
            <Sunrise className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="font-bold text-green-900">Концепция монодиеты</h4>
          </div>
          <p className="text-base text-green-800 dark:text-green-200/90 leading-relaxed">
            Монодиета означает питание одним продуктом в течение определённого времени — от одного дня до нескольких недель. Идея в том, что упрощение состава еды снижает нагрузку на пищеварение и позволяет организму переключиться на глубокую очистку и восстановление.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Основы сыроедения</h3>
        </div>

        <p className="mb-4">
          Прежде чем переходить к монодиетам, важно понять базовые принципы сыроедения.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              principle: 'Максимальная сохранность нутриентов',
              detail: 'Термическая обработка разрушает часть витаминов, ферментов и фитоchemicals. Сырая еда сохраняет их.'
            },
            {
              principle: 'Ферменты живой еды',
              detail: 'Сырые продукты содержат ферменты, которые помогают пищеварению. При готовке они инактивируются.'
            },
            {
              principle: 'Вода в еде',
              detail: 'Фрукты и овощи на 70-95% состоят из воды. Это гидратация на клеточном уровне.'
            },
            {
              principle: 'Клетчатка',
              detail: 'Сырая растительная еда богата клетчаткой, которая кормит микробиом и улучшает пищеварение.'
            },
            {
              principle: 'Низкая калорийная плотность',
              detail: 'Много объёма, мало калорий. Легше поддерживать здоровый вес.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 mb-2">{item.principle}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
          <p className="text-base text-emerald-900 leading-relaxed">
            Сыроедение — это не только салаты. Включает фрукты, овощи, орехи, семена, проростки, иногда сырые яйца или рыбу (если не вегетарианское сыроедение). Основой обычно являются фрукты и овощи.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Grape className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Фруктомонодиеты</h3>
        </div>

        <p className="mb-4">
          Самый популярный вид монодиет — фруктовый. Фрукты легко усваиваются, содержат много воды и простых сахаров, которые быстро дают энергию.
        </p>

        <h4 className="font-bold text-xl mb-3">Популярные фруктомонодиеты</h4>
        <div className="space-y-4 mb-6">
          {[
            {
              fruit: 'Арбузная монодиета',
              duration: '1-7 дней',
              benefits: 'Мочегонный эффект, очищение почек, гидратация',
              caution: 'Низкокалорийная, не дольше 3-7 дней'
            },
            {
              fruit: 'Виноградная монодиета',
              duration: '3-14 дней',
              benefits: 'Антиоксиданты, резveratrol, энергия',
              caution: 'Высокий сахар, не для диабетиков'
            },
            {
              fruit: 'Дынная монодиета',
              duration: '1-5 дней',
              benefits: 'Лёгкая, освежающая, витаминов много',
              caution: 'Не смешивать с другой едой'
            },
            {
              fruit: 'Цитрусовая монодиета',
              duration: '3-10 дней',
              benefits: 'Витамин C, детокс, иммунитет',
              caution: 'Кислота может раздражать желудок'
            },
            {
              fruit: 'Яблочная монодиета',
              duration: '1-3 дня',
              benefits: 'Пектин, клетчатка, мягкая',
              caution: 'Больше 3 дней не рекомендуется'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center font-bold text-xl shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-slate-800 mb-2">{item.fruit}</h5>
                  <p className="text-sm font-medium text-xl text-slate-600 dark:text-slate-300 mb-2">Длительность: {item.duration}</p>
                  <p className="text-base text-slate-700 dark:text-slate-300 mb-2">{item.benefits}</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">⚠ {item.caution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 dark:border-violet-900/30">
          <h4 className="font-bold text-violet-900 dark:text-violet-100 mb-3">Правила фруктомонодиеты</h4>
          <ul className="space-y-2 text-sm text-violet-800 dark:text-violet-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span>Ешьте один фрукт до насыщения, когда голодны</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span>Пейте воду по необходимости, но не перебарщивайте</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span>Не смешивайте разные фрукты в одной диете</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span>Слушайте организм — слабость, голод — сигналы прекратить</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0" />
              <span>Плавный выход — не наедайтесь тяжёлой едой сразу после</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Droplet className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Механизм действия</h3>
        </div>

        <p className="mb-4">
          Почему монодиета может работать лучше, чем просто разнообразное сыроедение?
        </p>

        <div className="space-y-4">
          {[
            {
              title: 'Упрощение пищеварения',
              desc: 'Один тип еды требует определённых ферментов. Разнообразная смесь создаёт конфликт в желудке. Монодиета упрощает процесс.'
            },
            {
              title: 'Снижение нагрузки',
              desc: 'Пищеварительная система работает в «экономном режиме». Ресурс освобождается для очищения и восстановления.'
            },
            {
              title: 'Отдых печени',
              desc: 'Меньше разнообразных токсинов и сочетаний пищи. Печень может заниматься детоксом, а не постоянной переработкой сложных смесей.'
            },
            {
              title: 'Снижение воспаления',
              desc: 'Фрукты низко inflammatory. Меньше пищевых воспалений — больше энергии на восстановление.'
            },
            {
              title: 'Гидратация',
              desc: 'Фрукты на 80-95% вода. Это гидратация на клеточном уровне, что помогает выводить токсины.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 mb-2">{item.title}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Salad className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Долгосрочное сыроедение</h3>
        </div>

        <p className="mb-4">
          Монодиеты обычно временные практики. Долгосрочное сыроедение требует более разнообразного подхода.
        </p>

        <h4 className="font-bold text-xl mb-3">Типы сыроедения</h4>
        <div className="space-y-3 mb-6">
          {[
            {
              type: 'Веганское сыроедение',
              desc: 'Только растения: фрукты, овощи, орехи, семена, проростки'
            },
            {
              type: 'Вегетарианское сыроедение',
              desc: 'Растения + сырые яйца, молочные продукты, мёд'
            },
            {
              type: 'Палео-сыроедение',
              desc: 'Растения + сырая рыба, мясо, яйца (продукты палео-диеты)'
            },
            {
              type: 'Фрукторианство',
              desc: 'Только фрукты, орехи, семена. Самое ограничительное направление'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-4 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200">{item.type}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/30">
          <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-3">Типичный день сыроеда</h4>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200/90">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600 shrink-0">•</span>
              <span><strong>Утро:</strong> Свежие фрукты, смузи, фруктовый салат</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600 shrink-0">•</span>
              <span><strong>Обед:</strong> Большой салат с авокадо, орехами, овощами</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600 shrink-0">•</span>
              <span><strong>Ужин:</strong> Овощи с ореховым соусом, сыроедческие супы</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600 shrink-0">•</span>
              <span><strong>Перекусы:</strong> Фрукты, орехи, семена, свежевыжатые соки</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Риски и ограничения</h3>
        </div>

        <p className="mb-4">
          Сыроедение и монодиеты имеют реальные риски, особенно при длительной практике без подготовки.
        </p>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
          <h4 className="font-bold text-red-900 dark:text-red-100 mb-3">Основные риски</h4>
          <ul className="space-y-2 text-sm text-red-800/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Дефицит B12:</strong> Витамин B12 практически отсутствует в растениях. Сыроеды-веганы должны добавлять его обязательно.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Низкая калорийность:</strong> Фрукты и овощи низкокалорийны. Можно не добирать калорий, что ведёт к потере веса и усталости.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Проблемы с зубами:</strong> Кислые фрукты и сухофрукты могут разрушать эмаль при частом употреблении.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Пищевые инфекции:</strong> Сырая еда может содержать патогены. Мойте тщательно, выбирайте качественные продукты.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Проблемы с пищеварением:</strong> Резкий переход к высококлетчаточной диете может вызвать вздутие, газы, дискомфорт.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span><strong>Социальная изоляция:</strong> Сыроедение сильно ограничивает выбор в ресторанах и мероприятиях.</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Практические выводы</h3>

        <div className="space-y-4">
          {[
            {
              title: 'Короткие монодиеты безопаснее',
              desc: '1-3 дня на одном фрукте — безопасная практика для большинства. Длительные монодиеты требуют подготовки.'
            },
            {
              title: 'Постепенный переход',
              desc: 'Не переходите к 100% сыроедению резко. Начните с сырого завтрака, затем обеда.'
            },
            {
              title: 'Следите за весом и энергией',
              desc: 'Если теряете слишком много веса или чувствуете хроническую усталость — добавляйте больше калорий.'
            },
            {
              title: 'Добавляйте B12',
              desc: 'Если исключаете животные продукты, B12 обязателен. Не полагайтесь на «fermented» продукты.'
            },
            {
              title: 'Разнообразие важно',
              desc: 'Долгосрочное сыроедение требует разнообразия: фрукты, овощи, орехи, семена, проростки.'
            },
            {
              title: 'Монодиета — это инструмент',
              desc: 'Фруктомонодиеты — временные практики для очищения, а не постоянный образ питания.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 mb-2">{item.title}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 dark:text-white mb-6">Связь с голоданием</h3>

        <div className="bg-slate-50 dark:bg-[#3A3A3C] p-6 rounded-3xl border border-slate-100 dark:border-white/10">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            Сыроедение и голодание — родственные практики. Обе дают отдых пищеварительной системе и способствуют очищению. Монодиеты можно рассматривать как «мягкое голодание» — вы едите, но очень упрощённую пищу. После голодания фрукты — идеальный первый приём еды: они легко усваиваются, дают энергию и не перегружают систему. Многие люди, регулярно голодающие, естественным образом переходят к более сыроедческому питанию между голоданиями.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Критический взгляд</h3>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Научные доказательства преимуществ сыроедения ограничены и часто противоречивы</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Некоторые нутриенты лучше усваиваются из приготовленной еды (ликопин, бета-каротин)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Долгосрочное сыроедение может вести к дефицитам без тщательного планирования</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Идея «ферментов живой еды» частично миф — большинство ферментов разрушаются в желудке</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span>Качество и доступность свежих продуктов может ограничивать практику</span>
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
          Сыроедческая монодиета — это инструмент, а не постоянный образ жизни. Короткие фруктомонодиеты могут быть полезными для периодического очищения и отдыха пищеварительной системы. Долгосрочное сыроедение требует тщательного планирования и понимания рисков. Если вы практикуете голодание, сырые продукты — идеальная еда для входа и выхода: они лёгкие, питательные и поддерживают процесс очищения.
        </p>
      </div>

    </div>
  ),
};
