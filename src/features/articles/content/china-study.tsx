import type { Article } from '../types';
import { Apple, BarChart3, Beaker, Leaf, Shield, Target } from 'lucide-react';

export const chinaStudy: Article = {
  id: 'china-study',
  title: 'Китайское исследование: Питание и болезни',
  category: 'Наука о питании',
  summary: 'Масштабное исследование связи еды и хронических заболеваний. Что 20-летний проект в Китае показал о животном белке.',
  imageUrl: '/images/articles/new/IMG_0418.PNG',
  content: (
    <div className="space-y-8 text-slate-800 dark:text-slate-200 text-lg leading-relaxed pb-10">

      <section>
        <p className="font-medium text-xl text-slate-600 dark:text-slate-300 mb-6">
          «Китайское исследование» — один из самых цитируемых проектов в истории нутрициологии. Двадцать лет наблюдений, 65 округов Китая, 880 миллионов участников и данные о сотнях факторов питания и здоровья. Результаты изменили представление о связи еды и болезней.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-blue-900 dark:text-blue-100">Масштаб проекта</h4>
          </div>
          <p className="text-base text-blue-800 dark:text-blue-200/90 leading-relaxed">
            Исследование проводилось в 1980-х годах совместно китайскими и американскими учёными. Китай был выбран из-за разнообразия диет — от почти вегетарианской в сельских районах до богатой животными продуктами в городах. Это позволило сравнить эффекты разных типов питания на большом массиве данных.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Основная гипотеза</h3>
        </div>

        <p className="mb-4">
          Колин Кэмпбелл, руководивший проектом, исходил из простого вопроса: почему в разных регионах Китая показатели заболеваний радикально отличаются? Одни округа имели крайне низкие уровни рака и диабета, другие — высокие.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Что измеряли</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Участники сдавали анализы крови, мочи, отвечали на вопросы о рационе. Исследователи собирали данные о потреблении белков, жиров, углеводов, витаминов, минералов.
            </p>
          </div>

          <div className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Что сравнивали</h5>
            <p className="text-base text-slate-700 dark:text-slate-300">
              Диеты разных округов, уровни заболеваний, смертность, показатели крови. Цель — найти корреляции между тем, что люди едят, и тем, чем они болеют.
            </p>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-3xl border border-green-100 dark:border-green-900/30">
          <h4 className="font-bold text-green-900 dark:text-green-100 mb-3">Ключевой вывод</h4>
          <p className="text-sm text-green-800 dark:text-green-200/90 leading-relaxed">
            Округи с наибольшим потреблением животных продуктов имели более высокие уровни рака, диабета, сердечно-сосудистых заболеваний. Округи с преобладанием растительной еды — наоборот.
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-xl">
            <Beaker className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Животный белок и рак</h3>
        </div>

        <p className="mb-4">
          Один из самых обсуждаемых результатов исследования касается животного белка, особенно казеина — основного белка молока. Лабораторные эксперименты Кэмпбелла показали интересную закономерность.
        </p>

        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-3xl border border-violet-100 mb-6">
          <h4 className="font-bold text-violet-900 dark:text-violet-100 mb-3">Эксперимент с афлатоксином</h4>
          <p className="text-sm text-violet-800 dark:text-violet-200/90 leading-relaxed mb-3">
            Афлатоксин — канцероген, который содержится в плесневых орехах и зерне. В экспериментах на крысах выяснилось: при высоком уровне казеина в рационе афлатоксин вызывал рак печени. При низком — опухоли не развивались.
          </p>
          <p className="text-sm text-violet-800 dark:text-violet-200/90 leading-relaxed">
            Более того, существовал пороговый эффект: при уровне казеина выше 20% калорийности опухоли росли. Ниже 5% — рост останавливался.
          </p>
        </div>

        <p className="mb-4">
          Критики указывали на ограничения исследования: данные были наблюдательными, не экспериментальными. Корреляция не доказывает причинность. Кроме того, генетические и экологические факторы в разных регионах Китая тоже могли влиять на результаты.
        </p>

        <div className="bg-slate-50 dark:bg-[#3A3A3C] p-6 rounded-3xl border border-slate-100 dark:border-white/10">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Ограничения исследования</h4>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
              <span>Наблюдательный дизайн не доказывает причинно-следственные связи</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
              <span>Диеты различались не только белком, но и многими другими факторами</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
              <span>Генетические различия между регионами могли влиять на заболеваемость</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Растительное питание</h3>
        </div>

        <p className="mb-4">
          Позитивная сторона исследования — данные о пользе растительной диеты. Округи с высоким потреблением овощей, фруктов, зерновых демонстрировали лучшие показатели здоровья.
        </p>

        <div className="space-y-4 mb-6">
          {[
            {
              title: 'Более низкий уровень холестерина',
              desc: 'Вегетарианские регионы имели значительно меньший уровень холестерина в крови.'
            },
            {
              title: 'Меньшая заболеваемость раком',
              desc: 'Особенно раком груди, простаты, кишечника.'
            },
            {
              title: 'Редкий диабет',
              desc: 'Диабет 2 типа был практически неизвестен в регионах с растительной диетой.'
            },
            {
              title: 'Низкое давление',
              desc: 'Гипертония встречалась реже при меньшем потреблении животных продуктов.'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-[#3A3A3C] p-5 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm">
              <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{item.title}</h5>
              <p className="text-base text-slate-700 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <p>
          Важно отметить: растительная диета в Китае того времени была не просто «без мяса». Это была традиционная диета из риса, овощей, небольшого количества рыбы или мяса по праздникам. Современный веганский фастфуд может не дать тех же эффектов.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Критика и контекст</h3>
        </div>

        <p className="mb-4">
          «Китайское исследование» имеет как сторонников, так и критиков. Академическое сообщество разделилось в оценке значимости результатов.
        </p>

        <div className="bg-red-50 dark:bg-red-950/80 p-6 rounded-3xl border border-red-100 dark:border-red-800/50 mb-6">
          <h4 className="font-bold text-red-900 dark:text-rose-300 mb-3">Основные критические замечания</h4>
          <ul className="space-y-2 text-sm text-red-800/90">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>Интерпретация данных может быть слишком категоричной</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>Корреляция не доказывает, что животный белок вызывает болезни</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>Некоторые метаболические исследования не подтверждают все выводы</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
              <span>Полноценный веганский рацион требует планирования (B12, железо)</span>
            </li>
          </ul>
        </div>

        <p>
          Другие исследования показали смешанные результаты. Некоторые мета-анализы подтверждают связь между красным мясом и определёнными болезнями, другие не находят значимых эффектов при умеренном потреблении.
        </p>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Apple className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-[900] text-slate-900 dark:text-white">Практические выводы</h3>
        </div>

        <div className="space-y-4">
          {[
            {
              title: 'Больше растений — меньше животных продуктов',
              desc: 'Независимо от того, соглашаетесь ли вы с радикальными выводами Кэмпбелла, переход к более растительной диете ассоциируется с улучшением здоровья.'
            },
            {
              title: 'Ограничьте переработанное мясо',
              desc: 'Колбасы, бекон, сосиски показали более чёткую связь с болезнями, чем цельное мясо. Это консенсус большинства исследований.'
            },
            {
              title: 'Смотрите на общую диету, а не на один продукт',
              desc: 'Китайская диета была не просто «без мяса», но и богата овощами, клетчаткой, низка в сахаре. Важен общий паттерн питания.'
            },
            {
              title: 'Учитывайте индивидуальные особенности',
              desc: 'Генетика, образ жизни, окружение — всё это влияет на то, как диета влияет на здоровье. То, что работает для большинства, может не работать для вас.'
            },
            {
              title: 'Не делайте радикальных выводов',
              desc: 'Исследование показывает корреляции, но не доказывает, что животный белок «вреден». Мoderation — разумный подход.'
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
            Практика голодания часто естественным образом приводит к снижению потребления животных продуктов. Люди, регулярно голодающие, склонны выбирать более лёгкую растительную еду для входа и выхода. Китайское исследование даёт дополнительный контекст: если после голодания вы хотите сохранить достигнутый эффект, растительная диета может быть разумным выбором.
          </p>
        </div>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
          <BarChart3 className="w-6 h-6 text-green-400" />
          <h4 className="font-bold">Главный урок исследования</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          «Китайское исследование» не даёт окончательного ответа на все вопросы о питании, но оно показывает, что диета с преобладанием растительных продуктов ассоциируется с лучшими показателями здоровья. Если вы практикуете голодание, переход к более растительному питанию может усилить и закрепить результаты.
        </p>
      </div>

    </div>
  ),
};
