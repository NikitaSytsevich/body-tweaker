import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowUpRight, Sparkles, Shield, BookOpen, Timer, CheckCircle2, Target } from 'lucide-react';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { useFastingTimerContext } from './context/TimerContext';
import { articlesMeta } from '../articles/content';
import type { ArticleMeta } from '../articles/types';
import { storageGetHistory, HISTORY_UPDATED_EVENT_NAME } from '../../utils/storage';
import type { HistoryRecord } from '../../utils/types';
import { cn } from '../../utils/cn';

type KnowledgeFocus = 'prep' | 'fundamentals' | 'nutrition' | 'safety' | 'exit' | 'special';
type FilterOption = 'all' | KnowledgeFocus;
type KnowledgeMode = 'onboarding' | 'preparation' | 'steady' | 'finishing' | 'exit';

interface FocusOption {
  id: FilterOption;
  label: string;
}

interface KnowledgeHistoryStats {
  totalSessions: number;
  avgDurationHours: number;
  completionRate: number;
  lastSessionAt: string | null;
}

interface KnowledgeProfile {
  focus: KnowledgeFocus[];
  readMinutes: number;
  intensity: 1 | 2 | 3;
}

interface RankedArticle {
  article: ArticleMeta;
  profile: KnowledgeProfile;
  score: number;
  reason: string;
}

const FILTERS: FocusOption[] = [
  { id: 'all', label: 'Все' },
  { id: 'prep', label: 'Подготовка' },
  { id: 'fundamentals', label: 'Фундамент' },
  { id: 'nutrition', label: 'Питание' },
  { id: 'safety', label: 'Безопасность' },
  { id: 'exit', label: 'Выход' },
  { id: 'special', label: 'Особые случаи' }
];

const EMPTY_HISTORY_STATS: KnowledgeHistoryStats = {
  totalSessions: 0,
  avgDurationHours: 0,
  completionRate: 0,
  lastSessionAt: null
};

const ARTICLE_PROFILES: Record<string, KnowledgeProfile> = {
  'how-to-prepare': { focus: ['prep', 'safety'], readMinutes: 15, intensity: 1 },
  'fasting-day-regimen': { focus: ['prep', 'safety'], readMinutes: 12, intensity: 1 },
  'six-stages-rdt': { focus: ['fundamentals', 'prep'], readMinutes: 11, intensity: 1 },
  'acidotic-crisis': { focus: ['safety', 'fundamentals'], readMinutes: 11, intensity: 2 },
  'inpatient-vs-home': { focus: ['safety', 'special'], readMinutes: 10, intensity: 2 },
  'exit-mistakes': { focus: ['exit', 'safety'], readMinutes: 11, intensity: 1 },
  'shelton-fasting-art': { focus: ['fundamentals', 'exit'], readMinutes: 18, intensity: 2 },
  'bragg-miracle-fasting': { focus: ['fundamentals', 'prep'], readMinutes: 14, intensity: 1 },
  'china-study': { focus: ['nutrition'], readMinutes: 16, intensity: 2 },
  'greger-how-not-to-die': { focus: ['nutrition'], readMinutes: 17, intensity: 2 },
  'furman-eat-to-live': { focus: ['nutrition', 'prep'], readMinutes: 14, intensity: 1 },
  'meat-for-weaklings': { focus: ['nutrition', 'fundamentals'], readMinutes: 13, intensity: 2 },
  'raw-food-monodiet': { focus: ['nutrition', 'special'], readMinutes: 12, intensity: 3 },
  'smoking-and-fasting': { focus: ['safety', 'special'], readMinutes: 11, intensity: 2 },
  'diabetes-fasting': { focus: ['safety', 'special'], readMinutes: 18, intensity: 3 },
  'preventive-short-fasts': { focus: ['prep', 'special'], readMinutes: 10, intensity: 1 },
  'movement-during-fasting': { focus: ['prep', 'fundamentals'], readMinutes: 10, intensity: 1 },
  'skin-detox-hygiene': { focus: ['safety', 'prep'], readMinutes: 9, intensity: 1 },
  'fractional-method': { focus: ['special', 'safety'], readMinutes: 11, intensity: 2 },
  'how-to-exit': { focus: ['exit', 'safety'], readMinutes: 13, intensity: 1 }
};

const getKnowledgeProfile = (id: string): KnowledgeProfile => {
  return ARTICLE_PROFILES[id] ?? { focus: ['fundamentals'], readMinutes: 10, intensity: 1 };
};

const calculateHistoryStats = (records: HistoryRecord[]): KnowledgeHistoryStats => {
  const fastingRecords = records
    .filter((record) => record.type === 'fasting' && Number.isFinite(record.durationSeconds) && record.durationSeconds > 0)
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());

  if (!fastingRecords.length) return EMPTY_HISTORY_STATS;

  const totalSeconds = fastingRecords.reduce((sum, record) => sum + record.durationSeconds, 0);
  const totalSessions = fastingRecords.length;
  const avgDurationHours = Number((totalSeconds / totalSessions / 3600).toFixed(1));
  const completionRate = Math.round(
    (fastingRecords.filter((record) => record.durationSeconds >= 24 * 3600).length / totalSessions) * 100
  );

  return {
    totalSessions,
    avgDurationHours,
    completionRate,
    lastSessionAt: fastingRecords[0]?.endTime ?? null
  };
};

const getKnowledgeMode = (
  params: { isFasting: boolean; elapsed: number; goalSeconds: number; history: KnowledgeHistoryStats }
): KnowledgeMode => {
  const { isFasting, elapsed, goalSeconds, history } = params;
  if (history.totalSessions === 0) return 'onboarding';
  if (!isFasting) return 'preparation';
  if (elapsed >= goalSeconds) return 'exit';
  if (goalSeconds - elapsed <= 3 * 3600) return 'finishing';
  return 'steady';
};

const scoreArticle = (
  article: ArticleMeta,
  profile: KnowledgeProfile,
  ctx: {
    mode: KnowledgeMode;
    isFasting: boolean;
    completionRate: number;
    elapsedHours: number;
  }
): { score: number; reason: string } => {
  const { mode, isFasting, completionRate, elapsedHours } = ctx;
  let score = 10 + profile.readMinutes;
  let reason = 'Полезно для общей стратегии голодания';

  const hasFocus = (focus: KnowledgeFocus) => profile.focus.includes(focus);

  if (mode === 'onboarding') {
    if (hasFocus('prep')) {
      score += 70;
      reason = 'Лучший старт для первой безопасной сессии';
    } else if (hasFocus('fundamentals')) {
      score += 45;
      reason = 'Помогает понять базовую механику процесса';
    }
  }

  if (mode === 'preparation') {
    if (hasFocus('prep')) {
      score += 55;
      reason = 'Актуально перед запуском следующего цикла';
    }
    if (hasFocus('nutrition')) {
      score += 28;
      reason = 'Полезно для настройки питания между циклами';
    }
  }

  if (mode === 'steady') {
    if (hasFocus('fundamentals')) {
      score += 34;
      reason = 'Поддерживает фокус и понимание процесса в сессии';
    }
    if (hasFocus('safety')) {
      score += 32;
      reason = 'Закрывает вопросы контроля самочувствия в процессе';
    }
    if (elapsedHours >= 12 && hasFocus('nutrition')) {
      score += 15;
      reason = 'Помогает заранее подготовить стратегию выхода';
    }
  }

  if (mode === 'finishing') {
    if (hasFocus('exit')) {
      score += 70;
      reason = 'Самая важная тема перед завершением цикла';
    } else if (hasFocus('safety')) {
      score += 45;
      reason = 'Снижает риски ошибок в финишном окне';
    }
  }

  if (mode === 'exit') {
    if (hasFocus('exit')) {
      score += 90;
      reason = 'Сейчас ключевая тема: мягкий и безопасный выход';
    } else if (hasFocus('nutrition')) {
      score += 36;
      reason = 'Подсказывает как вернуть питание без перегрузки';
    }
  }

  if (completionRate < 50 && hasFocus('safety')) {
    score += 22;
  }
  if (completionRate >= 70 && hasFocus('nutrition')) {
    score += 12;
  }
  if (!isFasting && hasFocus('special')) {
    score += 8;
  }

  score -= profile.intensity * 2;
  score += article.title.length % 7;

  return { score, reason };
};

const getModeLabels = (mode: KnowledgeMode) => {
  switch (mode) {
    case 'onboarding':
      return {
        badge: 'Первый цикл',
        title: 'Соберите базу перед стартом',
        description: 'Структурировали материалы так, чтобы вы быстро прошли безопасную подготовку и уверенно запустили первую сессию.'
      };
    case 'preparation':
      return {
        badge: 'Подготовка',
        title: 'Готовим следующий заход',
        description: 'Рекомендации смещены на предзапуск: питание, фундамент, риски и точное планирование следующего цикла.'
      };
    case 'steady':
      return {
        badge: 'Активная сессия',
        title: 'Поддержка во время процесса',
        description: 'Подборка держит фокус на стабильном темпе, понимании физиологии и контроле самочувствия.'
      };
    case 'finishing':
      return {
        badge: 'Финишный коридор',
        title: 'Подготовьте мягкий выход',
        description: 'Сейчас приоритет у материалов по завершению сессии и бережному возврату к питанию.'
      };
    case 'exit':
      return {
        badge: 'После цели',
        title: 'Выход важнее продления',
        description: 'В топе статьи по безопасному завершению и восстановлению после целевого окна голодания.'
      };
  }
};

const formatLastSession = (iso: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
};

export const MetabolismMapPage = () => {
  const navigate = useNavigate();
  const { isFasting, elapsed, scheme } = useFastingTimerContext();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [historyStats, setHistoryStats] = useState<KnowledgeHistoryStats>(EMPTY_HISTORY_STATS);

  const goalSeconds = scheme.hours * 3600;
  const elapsedHours = elapsed / 3600;
  const remainingSeconds = Math.max(0, goalSeconds - elapsed);
  const mode = getKnowledgeMode({ isFasting, elapsed, goalSeconds, history: historyStats });
  const modeLabels = getModeLabels(mode);

  const loadHistory = useCallback(async () => {
    try {
      const history = await storageGetHistory<HistoryRecord>('history_fasting');
      setHistoryStats(calculateHistoryStats(history));
    } catch (error) {
      console.error('Failed to load knowledge history stats:', error);
      setHistoryStats(EMPTY_HISTORY_STATS);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (!detail?.key || detail.key === 'history_fasting') {
        void loadHistory();
      }
    };
    window.addEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
    return () => window.removeEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
  }, [loadHistory]);

  const rankedArticles = useMemo<RankedArticle[]>(() => {
    return articlesMeta
      .map((article) => {
        const profile = getKnowledgeProfile(article.id);
        const rank = scoreArticle(article, profile, {
          mode,
          isFasting,
          completionRate: historyStats.completionRate,
          elapsedHours
        });
        return {
          article,
          profile,
          score: rank.score,
          reason: rank.reason
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [mode, isFasting, historyStats.completionRate, elapsedHours]);

  const filteredArticles = useMemo(() => {
    return rankedArticles.filter((item) => {
      if (filter !== 'all' && !item.profile.focus.includes(filter)) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase().trim();
      return (
        item.article.title.toLowerCase().includes(q) ||
        item.article.summary.toLowerCase().includes(q) ||
        item.article.category.toLowerCase().includes(q)
      );
    });
  }, [filter, query, rankedArticles]);

  const spotlight = filteredArticles[0] ?? null;
  const quickPicks = filteredArticles.slice(1, 4);
  const catalog = filteredArticles.slice(4);

  const heroStatLeft = isFasting
    ? remainingSeconds > 0
      ? `До цели ${Math.ceil(remainingSeconds / 3600)}ч`
      : 'Цель достигнута'
    : `${historyStats.totalSessions} сессий`;

  const heroStatRight = `Точность ${historyStats.completionRate}%`;

  return (
    <div className="relative z-0 flex flex-col pb-[calc(6.5rem+var(--app-safe-bottom))]">
      <div className="app-card relative flex flex-col z-10 min-h-[85vh] overflow-hidden">
        <div className="px-5 pt-6 pb-4 z-20 relative border-b border-[color:var(--tg-border)]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[28px] font-black tracking-tight app-header">Знания</h1>
            <ProfileAvatar onClick={() => navigate('/profile')} />
          </div>

          <div className="rounded-[24px] border border-[color:var(--tg-border)] bg-[linear-gradient(150deg,color-mix(in_srgb,var(--tg-surface)_93%,transparent)_0%,color-mix(in_srgb,var(--tg-glass)_83%,transparent)_100%)] p-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] app-muted">
              <Sparkles className="w-3 h-3 text-[color:var(--tg-accent)]" />
              {modeLabels.badge}
            </div>

            <h2 className="mt-2 text-[20px] font-[900] leading-tight app-header">{modeLabels.title}</h2>
            <p className="mt-1 text-[12px] app-muted leading-relaxed">{modeLabels.description}</p>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Фокус</p>
                <p className="mt-1 text-[12px] font-bold app-header">{heroStatLeft}</p>
              </div>
              <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Результат</p>
                <p className="mt-1 text-[12px] font-bold app-header">{heroStatRight}</p>
              </div>
              <div className="rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-2.5 py-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] app-muted">Последняя</p>
                <p className="mt-1 text-[12px] font-bold app-header">{formatLastSession(historyStats.lastSessionAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 pb-8 pt-5 space-y-4">
          <div className="rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2.5 flex items-center gap-2">
            <Search className="w-4 h-4 text-[color:var(--tg-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по материалам"
              className="w-full bg-transparent outline-none text-[13px] app-header placeholder:text-[color:var(--tg-muted)]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {FILTERS.map((option) => {
              const active = filter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors',
                    active
                      ? 'bg-[color:var(--tg-accent)] text-white border-[color:var(--tg-accent)]'
                      : 'border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] app-muted'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {spotlight && (
            <Link
              to={`/articles/${spotlight.article.id}`}
              className="group block rounded-[24px] overflow-hidden border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] shadow-[var(--app-shadow-card)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={spotlight.article.imageUrl}
                  alt={spotlight.article.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/75" />
                <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/35 text-white text-[11px] font-semibold px-3 py-1 backdrop-blur-md border border-white/25">
                  <Target className="w-3.5 h-3.5" />
                  Сейчас в приоритете
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[22px] font-[900] leading-tight app-header">{spotlight.article.title}</h3>
                <p className="mt-2 text-[13px] app-muted leading-relaxed line-clamp-2">{spotlight.reason}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-[color:var(--tg-accent)]">
                  Читать сейчас
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          )}

          {!!quickPicks.length && (
            <div className="grid grid-cols-1 gap-2.5">
              {quickPicks.map((item, index) => (
                <Link
                  key={item.article.id}
                  to={`/articles/${item.article.id}`}
                  className="group rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3.5 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[color:var(--tg-accent)]/14 text-[color:var(--tg-accent)] text-[11px] font-black flex items-center justify-center shrink-0">
                      {index + 2}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-[800] app-header leading-snug line-clamp-2">{item.article.title}</h4>
                      <p className="mt-1 text-[11px] app-muted line-clamp-2">{item.reason}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 shrink-0 text-[color:var(--tg-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-black app-header uppercase tracking-[0.1em]">Каталог</h3>
              <span className="text-[11px] app-muted">{filteredArticles.length} материалов</span>
            </div>

            <div className="space-y-2.5">
              {(catalog.length ? catalog : filteredArticles).map((item) => (
                <Link
                  key={item.article.id}
                  to={`/articles/${item.article.id}`}
                  className="group rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] px-3.5 py-3.5 flex items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.profile.focus.includes('safety') ? (
                      <Shield className="w-4 h-4 text-amber-500" />
                    ) : item.profile.focus.includes('exit') ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : item.profile.focus.includes('prep') ? (
                      <Timer className="w-4 h-4 text-sky-500" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-[color:var(--tg-accent)]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[14px] font-[800] leading-snug app-header line-clamp-2">{item.article.title}</h4>
                    <p className="mt-1 text-[11px] app-muted line-clamp-2">{item.article.summary}</p>
                    <div className="mt-1.5 text-[10px] font-semibold text-[color:var(--tg-accent)]/90">
                      {item.reason} • ~{item.profile.readMinutes} мин
                    </div>
                  </div>

                  <ArrowUpRight className="w-4 h-4 shrink-0 text-[color:var(--tg-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
