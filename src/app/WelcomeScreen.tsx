// src/app/WelcomeScreen.tsx
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { storageSet, storageSetJSON } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';
import { LEGAL_DOCS, LEGAL_VERSION, getLegalDocById, type LegalDocId } from './legal/legalDocs';

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const { theme } = useTheme();
  const [openDocId, setOpenDocId] = useState<LegalDocId | null>(null);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptConsent, setAcceptConsent] = useState(false);
  const [acceptMedical, setAcceptMedical] = useState(false);
  const [confirmAge, setConfirmAge] = useState(false);

  const canAccept = acceptTerms && acceptPrivacy && acceptConsent && acceptMedical && confirmAge;
  const openDoc = useMemo(() => (openDocId ? getLegalDocById(openDocId) ?? null : null), [openDocId]);

  const handleNext = () => setStep(1);

  // Асинхронное сохранение согласия
  const handleAgree = async () => {
    if (!canAccept) return;
    await storageSetJSON('legal_acceptance_v1', {
      version: LEGAL_VERSION,
      acceptedAt: new Date().toISOString(),
      ageConfirmed: true,
      docs: LEGAL_DOCS.map((doc) => ({
        id: doc.id,
        title: doc.title,
        version: doc.version
      }))
    });
    await storageSet('has_accepted_terms', 'true');
    onComplete();
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col justify-between p-6 overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#FFE5E0]'
    }`}>

      <AnimatePresence mode="wait">

        {/* STEP 1: INTRO (Telegram-style) */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            {/* Логотип приложения */}
            <div className="relative mb-12">
              {/* Логотип с градиентной подложкой */}
              <div className={`w-56 h-56 rounded-[3rem] flex items-center justify-center relative shadow-2xl transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#2C2C2E] to-slate-800 border-4 border-white/10'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white'
              }`}>
                <img
                  src="/logo.svg?v=2"
                  alt="Body Tweaker Logo"
                  className="w-40 h-40 rounded-3xl shadow-2xl"
                />
              </div>
            </div>

            {/* Заголовок и описание */}
            <div className="mb-8">
              <h1 className={`text-4xl font-black tracking-tight leading-tight mb-4 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]'
              }`}>
                Body Tweaker
              </h1>
              <p className={`text-base font-medium leading-relaxed max-w-xs transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-[#4a4a4a]'
              }`}>
                Научный подход к голоданию, дыханию и оздоровлению организма
              </p>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleNext}
              className={`w-full max-w-xs text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'bg-[#64B5F6] hover:bg-[#54A5E6]'
              }`}
            >
              Начать <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: LEGAL */}
        {step === 1 && (
          <motion.div
            key="legal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col h-full pt-10"
          >
            <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl shadow-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-white'
                }`}>
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className={`text-2xl font-[900] transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  Важно знать
                </h2>
              </div>

              <div className={`rounded-[2rem] p-6 shadow-sm border space-y-6 text-sm leading-relaxed transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-[#2C2C2E] border-white/10 text-slate-300'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}>
                <p>
                  Приложение <strong>Body Tweaker</strong> предоставляет информацию и инструменты для отслеживания интервального голодания и дыхательных практик.
                </p>

                <div className={`p-4 rounded-xl border-l-4 border-orange-400 transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-[#3A3A3C]' : 'bg-slate-50'
                }`}>
                  <h3 className={`font-bold mb-1 flex items-center gap-2 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-800'
                  }`}>
                    <Activity className="w-4 h-4 text-orange-500" />
                    Отказ от ответственности
                  </h3>
                  <p className={`text-xs transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Мы не являемся медицинским учреждением. Информация в приложении не заменяет консультацию врача.
                  </p>
                </div>

                <ul className={`space-y-3 list-disc pl-4 transition-colors duration-300 ${
                  theme === 'dark' ? 'marker:text-slate-600' : 'marker:text-slate-300'
                }`}>
                  <li>
                    Используя таймер голодания, вы подтверждаете, что у вас нет противопоказаний.
                  </li>
                  <li>
                    Дыхательные практики могут вызывать головокружение. Выполняйте их в безопасной обстановке.
                  </li>
                </ul>

                <div className="space-y-3">
                  <p className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                    theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Документы
                  </p>
                  <div className="space-y-2">
                    {LEGAL_DOCS.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setOpenDocId(doc.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors duration-300 ${
                          theme === 'dark'
                            ? 'bg-[#2A2A2C] border-white/10 hover:bg-[#343436]'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className={`text-sm font-semibold transition-colors duration-300 ${
                              theme === 'dark' ? 'text-white' : 'text-slate-800'
                            }`}>
                              {doc.shortTitle}
                            </p>
                            <p className={`text-xs transition-colors duration-300 ${
                              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              {doc.summary}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-blue-600">Открыть</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                    <span>Я принимаю Пользовательское соглашение.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                    />
                    <span>Я ознакомлен(а) с Политикой конфиденциальности.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      checked={acceptConsent}
                      onChange={(e) => setAcceptConsent(e.target.checked)}
                    />
                    <span>Я даю согласие на обработку персональных данных.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      checked={acceptMedical}
                      onChange={(e) => setAcceptMedical(e.target.checked)}
                    />
                    <span>Я ознакомлен(а) с медицинским предупреждением и понимаю риски.</span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      checked={confirmAge}
                      onChange={(e) => setConfirmAge(e.target.checked)}
                    />
                    <span>Мне исполнилось 18 лет.</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 shrink-0">
              <button
                onClick={handleAgree}
                disabled={!canAccept}
                className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 ${
                  canAccept
                    ? 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                Принять и продолжить
              </button>
              <button
                onClick={() => setStep(0)}
                className={`w-full py-3 font-bold text-xs uppercase tracking-wide mt-2 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'text-slate-500 hover:text-slate-300'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Назад
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {openDoc && (
          <motion.div
            key="legal-doc"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 z-[10000] flex flex-col ${
              theme === 'dark' ? 'bg-[#1C1C1E]' : 'bg-[#FFE5E0]'
            }`}
          >
            <div className="px-4 pt-6 pb-2 flex items-center gap-3">
              <button
                onClick={() => setOpenDocId(null)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#2C2C2E] border-white/10 text-white hover:bg-white/10'
                    : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <p className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Правовые документы
                </p>
                <h2 className={`text-lg font-[900] ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  {openDoc.shortTitle}
                </h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className={`rounded-[2rem] p-6 shadow-sm border space-y-6 transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-[#2C2C2E] border-white/10 text-slate-300'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}>
                <div className={`text-xs ${
                  theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Версия {openDoc.version} от {openDoc.effectiveDate}
                </div>
                {openDoc.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
