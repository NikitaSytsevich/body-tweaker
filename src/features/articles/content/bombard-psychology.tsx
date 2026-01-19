import type { Article } from '../types';
import { Anchor, Skull, BrainCircuit, Waves } from 'lucide-react';

export const bombardPsychology: Article = {
  id: 'bombard-psychology',
  title: 'За бортом по своей воле',
  category: 'Психология',
  summary: 'Убивает не голод, убивает страх. История Алена Бомбара и как настроить мозг на выживание.',
  imageUrl: '/images/articles/bombard.jpg',
  content: (
    <div className="space-y-8 text-slate-800 text-lg leading-relaxed pb-10">
      
      <section>
        <p className="font-medium text-xl text-slate-600 mb-6">
          «Жертвы легендарных кораблекрушений, погибшие преждевременно, я знаю: вас убило не море, вас убил не голод, вас убил не жажда! Раскачиваясь на волнах под жалобные крики чаек, вы умерли от страха».
        </p>
        <p className="text-right text-sm font-bold text-slate-400">— Ален Бомбар</p>
      </section>

      <section>
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 my-6">
            <div className="flex items-center gap-3 mb-3">
                <Anchor className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-blue-900">Эксперимент</h4>
            </div>
            <p className="text-sm text-blue-800/80 leading-relaxed">
                В 1952 году врач Ален Бомбар в одиночку пересек Атлантический океан на резиновой лодке. Без запасов еды и воды. Путешествие длилось 65 дней. Он пил немного морской воды (строго дозированно!) и выжимал сок из пойманной рыбы.
            </p>
        </div>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Анатомия Страха</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-900 text-white rounded-xl">
                <Skull className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Что нас убивает?</h4>
        </div>
        <p className="mb-4">
            Бомбар доказал: человек может жить без еды больше месяца (до 60-70 дней), если у него есть вода и... Надежда.
        </p>
        <p>
            Когда мы пропускаем обед, у нас начинается паника. «Я умру, у меня упадет сахар, я потеряю мышцы». Этот страх запускает выброс кортизола, который реально начинает разрушать мышцы. <strong>Мы убиваем себя своими мыслями.</strong>
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-[900] text-slate-900 mb-6">Квантовый скачок</h3>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-xl">
                <BrainCircuit className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-slate-800">Александр Бореев</h4>
        </div>
        <p className="mb-4">
            В книге «Осознанное голодание» Бореев развивает эту мысль. Голод — это способ переключить тумблер в голове. Перестать быть рабом инстинктов.
        </p>
        <ul className="list-disc pl-5 space-y-3 marker:text-violet-500">
            <li>Если вы боитесь голода, вы будете страдать.</li>
            <li>Если вы принимаете его с радостью как очищение, вы будете полны энергии.</li>
        </ul>
      </section>

      <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] text-center border border-slate-200">
        <Waves className="w-8 h-8 text-blue-400 mx-auto mb-3" />
        <p className="text-lg font-serif italic text-slate-700">
            «Если Бомбар выжил 65 дней в океане, я точно смогу пережить 24 часа без ужина в теплой квартире».
        </p>
      </div>

    </div>
  ),
};
