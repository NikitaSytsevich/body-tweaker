import { createPortal } from 'react-dom';
import { Activity, Clock3, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPhaseBgClasses, getPhaseTextClasses, getPhaseAccentTextClasses } from '../data/stages';
import type { FastingStage } from '../data/stages';
import { cn } from '../../../utils/cn';
import { AnimatedSticker } from '../../../components/ui/AnimatedSticker';

interface Props {
  phase: FastingStage | null;
  onClose: () => void;
}

const SURFACE_BY_PHASE: Record<number, string> = {
  1: 'from-blue-50 via-sky-50 to-white dark:from-blue-950/50 dark:via-slate-900 dark:to-slate-900',
  2: 'from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900',
  3: 'from-amber-50 via-orange-50 to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900',
  4: 'from-rose-50 via-pink-50 to-white dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900',
  5: 'from-violet-50 via-fuchsia-50 to-white dark:from-violet-950/40 dark:via-slate-900 dark:to-slate-900',
  6: 'from-cyan-50 via-sky-50 to-white dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900',
  7: 'from-teal-50 via-emerald-50 to-white dark:from-teal-950/40 dark:via-slate-900 dark:to-slate-900',
  8: 'from-slate-100 via-zinc-50 to-white dark:from-slate-900 dark:via-zinc-900 dark:to-slate-900',
  9: 'from-stone-100 via-zinc-50 to-white dark:from-stone-900 dark:via-zinc-900 dark:to-slate-900',
};

const STICKERS_BY_PHASE: Record<number, [string, string, string]> = {
  1: ['sparkles', 'book', 'check'],
  2: ['wind', 'sparkles', 'check'],
  3: ['fire', 'sparkles', 'book'],
  4: ['fire', 'rocket', 'check'],
  5: ['rocket', 'sparkles', 'trophy'],
  6: ['wind', 'check', 'sparkles'],
  7: ['trophy', 'sparkles', 'check'],
  8: ['book', 'wind', 'check'],
  9: ['book', 'sparkles', 'check'],
};

const splitPhysiology = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const getRangeLabel = (phase: FastingStage) => `${phase.hoursStart} — ${phase.hoursEnd ?? '∞'} ч`;

export const PhaseSheet = ({ phase, onClose }: Props) => {
  if (!phase) return null;
  const iconBgClass = getPhaseBgClasses(phase);
  const iconTextClass = getPhaseTextClasses(phase);
  const accentTextClass = getPhaseAccentTextClasses(phase);
  const physiologyParagraphs = splitPhysiology(phase.details.physiology);
  const [heroSticker, textSticker, footerSticker] = STICKERS_BY_PHASE[phase.id] ?? ['sparkles', 'book', 'check'];
  const heroSurface = SURFACE_BY_PHASE[phase.id] ?? SURFACE_BY_PHASE[1];

  const content = (
    <div className="fixed inset-0 z-[120] app-page animate-fade-in">
      <div className="sticky top-0 z-30 px-4 pt-[calc(var(--app-top-offset)+10px)] pb-3 bg-[linear-gradient(180deg,var(--tg-bg)_0%,color-mix(in_srgb,var(--tg-bg)_88%,transparent)_100%)] backdrop-blur-xl border-b border-[color:var(--tg-border)]/60">
        <div className="flex items-center justify-between gap-3">
          <div className="tg-chip">Физиология этапа</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть этап"
            className="w-10 h-10 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] flex items-center justify-center text-[color:var(--tg-muted)] active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100dvh-var(--app-top-offset)-58px)] overflow-y-auto px-4 pb-28">
        <div className={cn('relative mt-2 rounded-[34px] overflow-hidden border border-[color:var(--tg-border)] shadow-[var(--app-shadow-card)] bg-gradient-to-br p-6', heroSurface)}>
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-white/35 dark:bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-12 w-48 h-48 rounded-full bg-[color:var(--tg-accent)]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-bold app-muted">Этап {phase.id} из 9</p>
              <h2 className="text-[31px] leading-[1.08] font-[900] tracking-tight app-header">{phase.subtitle}</h2>
              <p className="text-[15px] app-muted leading-relaxed">{phase.title}</p>
            </div>
            <motion.div
              animate={{ y: [0, -4, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AnimatedSticker name={heroSticker} size={62} className="shadow-[var(--app-shadow-soft)]" />
            </motion.div>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold app-muted">Окно фазы</p>
              <p className={cn('mt-1 text-[16px] font-[800]', accentTextClass)}>{getRangeLabel(phase)}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.18em] font-bold app-muted">Метаболизм</p>
              <p className="mt-1 text-[16px] font-[800] app-header">Перестройка</p>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex items-center gap-3">
            <div className={cn('w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg shrink-0', iconBgClass)}>
              <phase.icon className={cn('w-8 h-8', iconTextClass)} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold app-muted">Сейчас в организме</p>
              <p className="text-[14px] app-header mt-1 leading-relaxed">
                Энергетический профиль смещается, а нейроэндокринная система подстраивает регуляцию под длительность окна.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 app-panel rounded-[30px] p-6">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[color:var(--tg-accent)]" />
              <h3 className="font-bold app-header">Что происходит физиологически</h3>
            </div>
            <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] app-muted whitespace-nowrap">
              Только физиология
            </div>
          </div>

          <div className="space-y-5">
            {physiologyParagraphs.map((paragraph, index) => (
              <p
                key={`${phase.id}-phys-${index}`}
                className={cn(
                  'font-[Iowan_Old_Style,Georgia,serif] text-[17px] leading-[1.9] text-[color:var(--tg-text)]/90',
                  index === 0 && 'text-[18px] leading-[1.88] text-[color:var(--tg-text)]'
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] p-4 flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0"
            >
              <AnimatedSticker name={textSticker} size={48} />
            </motion.div>
            <p className="text-[14px] leading-relaxed app-muted">
              Метаболическая динамика не переключается мгновенно. Организм проходит переходные окна, и признаки фазы
              могут частично пересекаться с соседними этапами.
            </p>
          </div>
        </div>

        <div className="mt-4 app-card-soft rounded-[24px] p-4 border border-[color:var(--tg-border)]">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -2, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              className="shrink-0"
            >
              <AnimatedSticker name={footerSticker} size={42} />
            </motion.div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] font-bold app-muted">Физиологическая заметка</p>
              <p className="text-[14px] app-header leading-relaxed mt-1">
                Часы фазы показывают ориентир. Индивидуальный темп адаптации зависит от исходного метаболического
                состояния, сна, уровня стресса и предыдущего пищевого режима.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 px-1 pb-2">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold app-muted">
            <Clock3 className="w-4 h-4" />
            {getRangeLabel(phase)}
          </div>
        </div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
};
