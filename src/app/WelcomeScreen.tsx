// src/app/WelcomeScreen.tsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, ChevronRight } from 'lucide-react';
import { storageSet, storageSetJSON } from '../utils/storage';
import { LEGAL_DOCS, LEGAL_VERSION, getLegalDocById, type LegalDocId } from './legal/legalDocs';
import WebApp from '@twa-dev/sdk';
import { AnimatedEmoji } from '../components/ui/AnimatedEmoji';

interface Props {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [openDocId, setOpenDocId] = useState<LegalDocId | null>(null);

  const [acceptAll, setAcceptAll] = useState(false);

  const canAccept = acceptAll;
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

  useEffect(() => {
    if (!openDocId) {
      try {
        WebApp.BackButton.hide();
      } catch {
        // ignore
      }
      return;
    }

    const handleBack = () => setOpenDocId(null);
    try {
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(handleBack);
    } catch {
      // ignore
    }
    return () => {
      try {
        WebApp.BackButton.offClick(handleBack);
        WebApp.BackButton.hide();
      } catch {
        // ignore
      }
    };
  }, [openDocId]);

  return (
    <div
      style={{ paddingTop: 'calc(1.5rem + var(--app-top-offset))' }}
      className="fixed inset-0 z-[9999] flex flex-col justify-between p-6 overflow-hidden app-surface"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(76,141,255,0.22)_0%,rgba(76,141,255,0)_55%)]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-[var(--app-top-offset)] bg-gradient-to-b from-white/60 via-white/30 to-transparent dark:from-[#0B0F14]/70 dark:via-[#0B0F14]/40" />

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
            <div className="relative mb-10">
              <AnimatedEmoji name="sparkles" size={220} fallback="✨" className="mx-auto" />
            </div>

            {/* Заголовок и описание */}
            <div className="mb-8">
              <h1 className="text-4xl font-black tracking-tight leading-tight mb-4 app-header">
                Body Tweaker
              </h1>
              <p className="text-base font-medium leading-relaxed max-w-xs app-muted">
                Научный подход к голоданию, дыханию и оздоровлению организма
              </p>
            </div>

            {/* Кнопка */}
            <button
              onClick={handleNext}
              className="tg-button w-full max-w-xs py-4 text-base font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
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
                <div className="p-3 rounded-xl app-card-soft">
                  <ShieldCheck className="w-6 h-6 text-[color:var(--tg-accent)]" />
                </div>
                <h2 className="text-2xl font-[900] app-header">
                  Важно знать
                </h2>
              </div>

              <div className="app-card p-6 space-y-6 text-sm leading-relaxed">
                <p>
                  Приложение <strong>Body Tweaker</strong> предоставляет информацию и инструменты для отслеживания интервального голодания и дыхательных практик.
                </p>

                <div className="p-4 rounded-xl border-l-4 border-[color:var(--tg-accent)] bg-[color:var(--tg-glass)]">
                  <h3 className="font-bold mb-1 flex items-center gap-2 app-header">
                    <Activity className="w-4 h-4 text-[color:var(--tg-accent)]" />
                    Отказ от ответственности
                  </h3>
                  <p className="text-xs app-muted">
                    Мы не являемся медицинским учреждением. Информация в приложении не заменяет консультацию врача.
                  </p>
                </div>

                <ul className="space-y-3 list-disc pl-4 marker:text-slate-300 dark:marker:text-slate-600">
                  <li>
                    Используя таймер голодания, вы подтверждаете, что у вас нет противопоказаний.
                  </li>
                  <li>
                    Дыхательные практики могут вызывать головокружение. Выполняйте их в безопасной обстановке.
                  </li>
                </ul>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest app-muted">
                    Документы
                  </p>
                  <div className="space-y-2">
                    {LEGAL_DOCS.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setOpenDocId(doc.id)}
                        className="w-full text-left p-3 rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] hover:bg-[color:var(--tg-glass-strong)] transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold app-header">
                              {doc.shortTitle}
                            </p>
                            <p className="text-xs app-muted">
                              {doc.summary}
                            </p>
                          </div>
                          <span className="tg-chip">Открыть</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[color:var(--tg-accent)]"
                      checked={acceptAll}
                      onChange={(e) => setAcceptAll(e.target.checked)}
                    />
                    <span>
                      Я принимаю Пользовательское соглашение, Политику конфиденциальности,
                      даю согласие на обработку персональных данных (включая специальные, если их указываю)
                      и возможную трансграничную передачу, а также подтверждаю, что мне исполнилось 18 лет.
                    </span>
                  </label>
                  <p className="text-[11px] leading-relaxed app-muted">
                    Документы доступны выше по ссылкам. Вы можете ознакомиться с ними перед принятием.
                  </p>
                </div>

              </div>
            </div>

            <div className="pt-4 shrink-0">
              <button
                onClick={handleAgree}
                disabled={!canAccept}
                className={`tg-button w-full py-4 text-base font-semibold transition-transform active:scale-95 ${
                  !canAccept ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Принять и продолжить
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full py-3 font-bold text-xs uppercase tracking-wide mt-2 text-[color:var(--tg-muted)] hover:text-[color:var(--tg-text)] transition-colors"
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
            className="absolute inset-0 z-[10000] flex flex-col app-surface"
          >
            <div
              className="px-4 pb-2"
              style={{ paddingTop: 'calc(7.5rem + var(--app-top-offset))' }}
            >
              <p className="text-xs uppercase tracking-widest font-bold app-muted">
                Правовые документы
              </p>
              <h2 className="text-lg font-[900] app-header">
                {openDoc.shortTitle}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="app-card p-6 space-y-6">
                <div className="text-xs app-muted">
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
