import type { Article } from '../types';
import { Leaf, Scale, AlertOctagon } from 'lucide-react';

export const chinaStudy: Article = {
  id: 'china-study',
  title: 'Китайское исследование: Почему мы болеем?',
  category: 'Питание',
  summary: 'Самое масштабное исследование связи еды и болезней. Животный белок как «кнопка рака» и этический взгляд Толстого.',
  imageUrl: '/images/articles/china-study.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          «Завтрак — это политический акт». То, что вы кладете в рот после голодания, определит, строите вы новое тело или кормите старые болезни.
        </p>
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
            <h4 className="font-bold text-green-900 mb-2">Колин Кэмпбелл доказал:</h4>
            <p className="text-sm text-green-800/80 leading-relaxed">
                В ходе 20-летнего исследования в Китае выяснилось: люди, потребляющие животный белок (казеин), имеют в разы выше риск онкологии и диабета. Кэмпбелл назвал животный белок «тумблером», который включает рост раковых клеток. Растительный белок этот тумблер выключает.
            </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Мясо для слабаков?</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <AlertOctagon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Миф о силе</h4>
        </div>
        <p className="mb-4">
            Джозеф Джон в книге «Мясо для слабаков» разрушает миф о том, что мужику нужно мясо. Гладиаторы Рима были вегетарианцами (их называли «едоками ячменя»). Горилла — одно из самых сильных животных — веган.
        </p>
        <p>
            Организм тратит колоссальное количество энергии на переваривание мяса (до 60% от полученного). На растительном топливе КПД выше, а токсинов меньше.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Первая ступень</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                <Scale className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Лев Толстой</h4>
        </div>
        <p className="mb-4 italic text-slate-600 border-l-4 border-slate-300 pl-4">
            «Пока существуют скотобойни, будут и поля битв. Вегетарианство — это первая ступень к нравственному возрождению».
        </p>
        <p>
            Невозможно очистить тело, продолжая загрязнять душу насилием. Голодание часто само приводит к отказу от мяса — организм просто перестает его принимать, чувствуя «тяжелые вибрации» продукта.
        </p>
      </section>

      <div className="mt-8 p-6 bg-slate-900 text-white rounded-3xl">
        <div className="flex items-center gap-3 mb-3">
            <Leaf className="w-6 h-6 text-green-400" />
            <h4 className="font-bold">Совет на выход</h4>
        </div>
        <p className="text-sm text-slate-300">
            Попробуйте после голода продержаться на растительном питании хотя бы столько же дней, сколько длился голод. Вы почувствуете разницу в ясности ума и легкости.
        </p>
      </div>

    </div>
  ),
};
