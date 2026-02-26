import { useState, useEffect, useMemo, useCallback, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import {
  Flame,
  Wind,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Hourglass,
  BarChart3,
  Sparkles,
  CalendarDays,
  TrendingUp,
  Target,
  ListFilter,
  Goal,
  LineChart,
  SlidersHorizontal,
  X,
  Check,
} from 'lucide-react';

import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { HistorySkeleton } from './components/HistorySkeleton';
import { RecordDetails } from './components/RecordDetails';
import { AnimatedSticker } from '../../components/ui/AnimatedSticker';

import {
  storageGetHistory,
  storageSaveHistory,
  HISTORY_UPDATED_EVENT_NAME,
} from '../../utils/storage';
import type { HistoryRecord, SegmentedControlOption } from '../../utils/types';
import { cn } from '../../utils/cn';
import { HISTORY_MENU_VISIBILITY_EVENT_NAME } from './historyEvents';

dayjs.extend(isoWeek);
dayjs.locale('ru');

type HistoryTab = 'fasting' | 'breathing';
type ViewMode = 'feed' | 'calendar' | 'insights' | 'goals';
type RangeFilter = 'day' | 'week' | 'month' | 'all';
type DurationFilter = 'all' | 'short' | 'medium' | 'long';
type TimeSlotFilter = 'all' | 'morning' | 'day' | 'evening' | 'night';
type SortMode = 'recent' | 'duration_desc' | 'duration_asc';

type DayActivity = {
  count: number;
  totalSeconds: number;
  maxSeconds: number;
};

type CalculatedStats = {
  sessionCount: number;
  totalSeconds: number;
  maxSeconds: number;
  avgSeconds: number;
  uniqueDayCount: number;
  streakDays: number;
  bestWeekdayLabel: string;
};

type MetricCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
  toneClass: string;
};

const HISTORY_KEY = 'history_fasting';
const PAGE_SIZE = 12;

const WEEKDAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const WEEKDAY_LONG = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

const rangeLabels: Record<RangeFilter, string> = {
  day: 'День',
  week: 'Неделя',
  month: 'Месяц',
  all: 'Всё',
};

const viewMeta: Array<{ id: ViewMode; label: string; icon: ComponentType<{ className?: string }> }> = [
  { id: 'feed', label: 'Лента', icon: ListFilter },
  { id: 'calendar', label: 'Календарь', icon: CalendarDays },
  { id: 'insights', label: 'Инсайты', icon: LineChart },
  { id: 'goals', label: 'Цели', icon: Goal },
];

const durationFilterLabels: Record<DurationFilter, string> = {
  all: 'Любая',
  short: 'Короткая',
  medium: 'Средняя',
  long: 'Длинная',
};

const timeSlotLabels: Record<TimeSlotFilter, string> = {
  all: 'Весь день',
  morning: 'Утро',
  day: 'День',
  evening: 'Вечер',
  night: 'Ночь',
};

const sortLabels: Record<SortMode, string> = {
  recent: 'Сначала новые',
  duration_desc: 'Дольше сначала',
  duration_asc: 'Короче сначала',
};

const capitalizeFirst = (value: string) => {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
};

const getDayKey = (value: string | Dayjs) => dayjs(value).format('YYYY-MM-DD');

const formatDuration = (seconds: number, type: HistoryTab, compact: boolean = true) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  if (type === 'breathing') {
    const totalMinutes = Math.floor(safeSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return compact ? `${hours}ч ${minutes}м` : `${hours} ч ${minutes} мин`;
    }
    return compact ? `${totalMinutes}м` : `${totalMinutes} мин`;
  }

  const totalHours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);

  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    if (hours > 0) return compact ? `${days}д ${hours}ч` : `${days} д ${hours} ч`;
    return compact ? `${days}д` : `${days} д`;
  }

  if (totalHours > 0) {
    if (minutes > 0) return compact ? `${totalHours}ч ${minutes}м` : `${totalHours} ч ${minutes} мин`;
    return compact ? `${totalHours}ч` : `${totalHours} ч`;
  }

  return compact ? `${minutes}м` : `${minutes} мин`;
};

const parseTargetHoursFromScheme = (scheme: string): number | null => {
  const match = scheme.toLowerCase().match(/(\d+(?:[.,]\d+)?)\s*(ч|час|часа|часов|h|hour|мин|м|min)?/u);
  if (!match) return null;

  const rawValue = Number.parseFloat(match[1].replace(',', '.'));
  if (!Number.isFinite(rawValue) || rawValue <= 0) return null;

  const unit = match[2] ?? '';
  if (unit.includes('мин') || unit === 'м' || unit === 'min') {
    return rawValue / 60;
  }

  return rawValue;
};

const getTimeSlot = (dateIso: string): TimeSlotFilter => {
  const hour = dayjs(dateIso).hour();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 23) return 'evening';
  return 'night';
};

const formatDateGroupTitle = (date: Dayjs) => {
  const today = dayjs();
  if (date.isSame(today, 'day')) return 'Сегодня';
  if (date.isSame(today.subtract(1, 'day'), 'day')) return 'Вчера';
  return capitalizeFirst(date.format('D MMMM, dddd'));
};

const calculateStreakDays = (records: HistoryRecord[]) => {
  if (!records.length) return 0;

  const uniqueDays = Array.from(new Set(records.map((record) => getDayKey(record.endTime))))
    .map((day) => dayjs(day))
    .sort((a, b) => b.valueOf() - a.valueOf());

  if (!uniqueDays.length) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const diff = uniqueDays[index - 1].diff(uniqueDays[index], 'day');
    if (diff === 1) {
      streak += 1;
      continue;
    }
    break;
  }

  return streak;
};

const calculateStats = (records: HistoryRecord[]): CalculatedStats => {
  if (!records.length) {
    return {
      sessionCount: 0,
      totalSeconds: 0,
      maxSeconds: 0,
      avgSeconds: 0,
      uniqueDayCount: 0,
      streakDays: 0,
      bestWeekdayLabel: 'Нет данных',
    };
  }

  const totalSeconds = records.reduce((sum, record) => sum + record.durationSeconds, 0);
  const maxSeconds = records.reduce((max, record) => Math.max(max, record.durationSeconds), 0);

  const weekdayCounter = new Array<number>(7).fill(0);
  const uniqueDaySet = new Set<string>();

  for (const record of records) {
    uniqueDaySet.add(getDayKey(record.endTime));
    const weekdayIndex = dayjs(record.endTime).isoWeekday() - 1;
    weekdayCounter[weekdayIndex] += 1;
  }

  const bestWeekdayIndex = weekdayCounter.reduce((best, value, index) => {
    if (value > weekdayCounter[best]) return index;
    return best;
  }, 0);

  return {
    sessionCount: records.length,
    totalSeconds,
    maxSeconds,
    avgSeconds: Math.round(totalSeconds / records.length),
    uniqueDayCount: uniqueDaySet.size,
    streakDays: calculateStreakDays(records),
    bestWeekdayLabel: WEEKDAY_LONG[bestWeekdayIndex],
  };
};

const applyRangeFilter = (records: HistoryRecord[], range: RangeFilter, selectedDate: Dayjs) => {
  if (range === 'all') return records;
  if (range === 'day') {
    const key = getDayKey(selectedDate);
    return records.filter((record) => getDayKey(record.endTime) === key);
  }

  if (range === 'week') {
    const start = selectedDate.startOf('isoWeek');
    const end = selectedDate.endOf('isoWeek');
    return records.filter((record) => {
      const date = dayjs(record.endTime);
      return (date.isAfter(start) || date.isSame(start, 'day')) && (date.isBefore(end) || date.isSame(end, 'day'));
    });
  }

  return records.filter((record) => dayjs(record.endTime).isSame(selectedDate, 'month'));
};

const passDurationFilter = (record: HistoryRecord, tab: HistoryTab, filter: DurationFilter) => {
  if (filter === 'all') return true;

  if (tab === 'fasting') {
    const hours = record.durationSeconds / 3600;
    if (filter === 'short') return hours < 12;
    if (filter === 'medium') return hours >= 12 && hours < 24;
    return hours >= 24;
  }

  const minutes = record.durationSeconds / 60;
  if (filter === 'short') return minutes < 10;
  if (filter === 'medium') return minutes >= 10 && minutes < 20;
  return minutes >= 20;
};

const getActivityLevel = (activity: DayActivity | undefined, type: HistoryTab) => {
  if (!activity) return 0;

  const amount = type === 'fasting' ? activity.totalSeconds / 3600 : activity.totalSeconds / 60;
  if (type === 'fasting') {
    if (amount >= 24) return 3;
    if (amount >= 10) return 2;
    return 1;
  }

  if (amount >= 45) return 3;
  if (amount >= 20) return 2;
  return 1;
};

const calculateConsistencyPercent = (records: HistoryRecord[], range: RangeFilter, selectedDate: Dayjs) => {
  if (!records.length) return 0;

  let denominator = 1;
  if (range === 'week') denominator = 7;
  if (range === 'month') denominator = selectedDate.daysInMonth();
  if (range === 'all') {
    const oldest = dayjs(records[records.length - 1].endTime).startOf('day');
    const newest = dayjs(records[0].endTime).startOf('day');
    denominator = Math.max(1, newest.diff(oldest, 'day') + 1);
  }

  const unique = new Set(records.map((record) => getDayKey(record.endTime))).size;
  return Math.min(100, Math.round((unique / denominator) * 100));
};

const MetricCard = ({ label, value, hint, icon: Icon, toneClass }: MetricCardProps) => {
  return (
    <div className="app-card p-4 rounded-[1.4rem] border border-[color:var(--tg-border)]">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-[10px] font-bold uppercase tracking-[0.08em] leading-tight break-words app-muted">
          {label}
        </p>
        <Icon className={cn('w-4 h-4', toneClass)} />
      </div>
      <p className={cn('mt-2 text-xl leading-tight font-black', toneClass)}>{value}</p>
      <p className="mt-1 text-[11px] app-muted">{hint}</p>
    </div>
  );
};

export const HistoryPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<HistoryTab>('fasting');
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>('week');

  const [allRecords, setAllRecords] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [timeSlotFilter, setTimeSlotFilter] = useState<TimeSlotFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [onlyGoalTracked, setOnlyGoalTracked] = useState(false);

  const tabs = useMemo<SegmentedControlOption<HistoryTab>[]>(() => ([
    { value: 'fasting', label: 'Голод', icon: Flame },
    { value: 'breathing', label: 'Дыхание', icon: Wind },
  ]), []);

  const loadHistory = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setIsLoading(true);

    try {
      const saved = await storageGetHistory<HistoryRecord>(HISTORY_KEY);
      const validRecords = saved
        .filter((record) => (
          Boolean(record) &&
          typeof record.id === 'string' &&
          (record.type === 'fasting' || record.type === 'breathing') &&
          Number.isFinite(record.durationSeconds) &&
          record.durationSeconds > 0 &&
          Number.isFinite(Date.parse(record.endTime))
        ))
        .sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));

      setAllRecords(validRecords);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      if (!options?.silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ key?: string }>).detail;
      if (!detail?.key || detail.key === HISTORY_KEY) {
        void loadHistory({ silent: true });
      }
    };

    window.addEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
    return () => window.removeEventListener(HISTORY_UPDATED_EVENT_NAME, handleHistoryUpdate);
  }, [loadHistory]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent(HISTORY_MENU_VISIBILITY_EVENT_NAME, {
        detail: { isOpen: menuOpen },
      })
    );
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      window.dispatchEvent(
        new CustomEvent(HISTORY_MENU_VISIBILITY_EVENT_NAME, {
          detail: { isOpen: false },
        })
      );
    };
  }, []);

  const tabRecords = useMemo(
    () => allRecords.filter((record) => record.type === activeTab),
    [allRecords, activeTab]
  );

  const selectedDayKey = selectedDate.format('YYYY-MM-DD');

  useEffect(() => {
    if (!tabRecords.length) return;

    const hasSelectedDayRecords = tabRecords.some(
      (record) => getDayKey(record.endTime) === selectedDayKey
    );

    if (hasSelectedDayRecords) return;

    const latestRecordDate = dayjs(tabRecords[0].endTime);
    setSelectedDate(latestRecordDate.startOf('day'));
    setCurrentDate(latestRecordDate.startOf('month'));
  }, [tabRecords, selectedDayKey]);

  const filteredByMenu = useMemo(() => {
    return tabRecords.filter((record) => {
      if (!passDurationFilter(record, activeTab, durationFilter)) return false;
      if (timeSlotFilter !== 'all' && getTimeSlot(record.endTime) !== timeSlotFilter) return false;
      if (onlyGoalTracked && activeTab === 'fasting') return parseTargetHoursFromScheme(record.scheme) != null;
      return true;
    });
  }, [tabRecords, activeTab, durationFilter, timeSlotFilter, onlyGoalTracked]);

  const rangedRecords = useMemo(
    () => applyRangeFilter(filteredByMenu, rangeFilter, selectedDate),
    [filteredByMenu, rangeFilter, selectedDate]
  );

  const sortedRangeRecords = useMemo(() => {
    const records = [...rangedRecords];

    if (sortMode === 'duration_desc') {
      records.sort((a, b) => b.durationSeconds - a.durationSeconds);
      return records;
    }

    if (sortMode === 'duration_asc') {
      records.sort((a, b) => a.durationSeconds - b.durationSeconds);
      return records;
    }

    records.sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));
    return records;
  }, [rangedRecords, sortMode]);

  const selectedDayRecords = useMemo(
    () => filteredByMenu
      .filter((record) => getDayKey(record.endTime) === selectedDayKey)
      .sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime)),
    [filteredByMenu, selectedDayKey]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, rangeFilter, selectedDayKey, durationFilter, timeSlotFilter, sortMode, onlyGoalTracked]);

  const visibleRecords = useMemo(
    () => sortedRangeRecords.slice(0, visibleCount),
    [sortedRangeRecords, visibleCount]
  );

  const groupedVisibleRecords = useMemo(() => {
    const groups = new Map<string, HistoryRecord[]>();

    for (const record of visibleRecords) {
      const key = getDayKey(record.endTime);
      const list = groups.get(key);
      if (list) {
        list.push(record);
      } else {
        groups.set(key, [record]);
      }
    }

    return Array.from(groups.entries())
      .map(([key, records]) => ({
        key,
        date: dayjs(key),
        title: formatDateGroupTitle(dayjs(key)),
        records,
      }))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf());
  }, [visibleRecords]);

  const activityByDay = useMemo(() => {
    const map = new Map<string, DayActivity>();

    for (const record of filteredByMenu) {
      const key = getDayKey(record.endTime);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
        existing.totalSeconds += record.durationSeconds;
        existing.maxSeconds = Math.max(existing.maxSeconds, record.durationSeconds);
      } else {
        map.set(key, {
          count: 1,
          totalSeconds: record.durationSeconds,
          maxSeconds: record.durationSeconds,
        });
      }
    }

    return map;
  }, [filteredByMenu]);

  const rangeStats = useMemo(() => calculateStats(sortedRangeRecords), [sortedRangeRecords]);
  const baselineStats = useMemo(() => calculateStats(tabRecords), [tabRecords]);

  const monthlyStats = useMemo(() => {
    const records = filteredByMenu.filter((record) => dayjs(record.endTime).isSame(currentDate, 'month'));
    return calculateStats(records);
  }, [filteredByMenu, currentDate]);

  const previousWeekRecords = useMemo(() => {
    const currentWeekStart = selectedDate.startOf('isoWeek');
    const previousWeekStart = currentWeekStart.subtract(1, 'week');
    const previousWeekEnd = previousWeekStart.endOf('isoWeek');

    return filteredByMenu.filter((record) => {
      const value = dayjs(record.endTime);
      return (value.isAfter(previousWeekStart) || value.isSame(previousWeekStart, 'day'))
        && (value.isBefore(previousWeekEnd) || value.isSame(previousWeekEnd, 'day'));
    });
  }, [filteredByMenu, selectedDate]);

  const weekDeltaPercent = useMemo(() => {
    const current = rangeFilter === 'week'
      ? rangeStats.totalSeconds
      : applyRangeFilter(filteredByMenu, 'week', selectedDate).reduce((sum, item) => sum + item.durationSeconds, 0);
    const previous = previousWeekRecords.reduce((sum, item) => sum + item.durationSeconds, 0);

    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }, [rangeFilter, rangeStats.totalSeconds, filteredByMenu, selectedDate, previousWeekRecords]);

  const timeSlotDistribution = useMemo(() => {
    const counters: Record<Exclude<TimeSlotFilter, 'all'>, number> = {
      morning: 0,
      day: 0,
      evening: 0,
      night: 0,
    };

    for (const record of sortedRangeRecords) {
      const slot = getTimeSlot(record.endTime);
      if (slot !== 'all') counters[slot] += 1;
    }

    const max = Math.max(counters.morning, counters.day, counters.evening, counters.night, 1);

    return (['morning', 'day', 'evening', 'night'] as const).map((slot) => ({
      slot,
      label: timeSlotLabels[slot],
      count: counters[slot],
      width: Math.round((counters[slot] / max) * 100),
    }));
  }, [sortedRangeRecords]);

  const consistencyPercent = useMemo(
    () => calculateConsistencyPercent(sortedRangeRecords, rangeFilter, selectedDate),
    [sortedRangeRecords, rangeFilter, selectedDate]
  );

  const bestTimeSlotLabel = useMemo(() => {
    const bestSlot = [...timeSlotDistribution].sort((a, b) => b.count - a.count)[0];
    if (!bestSlot || bestSlot.count === 0) return 'нет данных';
    return bestSlot.label;
  }, [timeSlotDistribution]);

  const fastingGoalStats = useMemo(() => {
    if (activeTab !== 'fasting') {
      return {
        tracked: 0,
        completed: 0,
        completionRate: 0,
        avgDeltaHours: 0,
        nearMisses: [] as HistoryRecord[],
      };
    }

    const goalRecords = sortedRangeRecords
      .map((record) => {
        const targetHours = parseTargetHoursFromScheme(record.scheme);
        if (targetHours == null) return null;
        const deltaSeconds = record.durationSeconds - targetHours * 3600;
        return { record, deltaSeconds };
      })
      .filter((item): item is { record: HistoryRecord; deltaSeconds: number } => item != null);

    if (!goalRecords.length) {
      return {
        tracked: 0,
        completed: 0,
        completionRate: 0,
        avgDeltaHours: 0,
        nearMisses: [] as HistoryRecord[],
      };
    }

    const completed = goalRecords.filter((item) => item.deltaSeconds >= 0).length;
    const completionRate = Math.round((completed / goalRecords.length) * 100);
    const avgDeltaHours = Math.round((goalRecords.reduce((sum, item) => sum + item.deltaSeconds, 0) / goalRecords.length / 3600) * 10) / 10;

    const nearMisses = goalRecords
      .filter((item) => item.deltaSeconds < 0 && item.deltaSeconds >= -2 * 3600)
      .slice(0, 4)
      .map((item) => item.record);

    return {
      tracked: goalRecords.length,
      completed,
      completionRate,
      avgDeltaHours,
      nearMisses,
    };
  }, [activeTab, sortedRangeRecords]);

  const breathingFocusStats = useMemo(() => {
    if (activeTab !== 'breathing') {
      return {
        deepSessions: 0,
        focusMinutes: 0,
        sessionsPerActiveDay: 0,
      };
    }

    const deepSessions = sortedRangeRecords.filter((record) => record.durationSeconds >= 20 * 60).length;
    const focusMinutes = Math.round(sortedRangeRecords.reduce((sum, record) => sum + record.durationSeconds, 0) / 60);
    const sessionsPerActiveDay = rangeStats.uniqueDayCount > 0
      ? Math.round((sortedRangeRecords.length / rangeStats.uniqueDayCount) * 10) / 10
      : 0;

    return {
      deepSessions,
      focusMinutes,
      sessionsPerActiveDay,
    };
  }, [activeTab, sortedRangeRecords, rangeStats.uniqueDayCount]);

  const daysInMonth = useMemo(() => {
    const monthStart = currentDate.startOf('month');
    const monthEnd = currentDate.endOf('month');

    const days: Array<number | null> = [];
    const leadingSlots = monthStart.isoWeekday() - 1;

    for (let index = 0; index < leadingSlots; index += 1) days.push(null);
    for (let day = 1; day <= monthEnd.date(); day += 1) days.push(day);

    return days;
  }, [currentDate]);

  const scopeLabel = useMemo(() => {
    if (rangeFilter === 'day') {
      return selectedDate.isSame(dayjs(), 'day')
        ? 'Сегодня'
        : capitalizeFirst(selectedDate.format('D MMMM'));
    }

    if (rangeFilter === 'week') {
      const start = selectedDate.startOf('isoWeek');
      const end = selectedDate.endOf('isoWeek');
      return `${start.format('D MMM')} — ${end.format('D MMM')}`;
    }

    if (rangeFilter === 'month') {
      return capitalizeFirst(selectedDate.format('MMMM YYYY'));
    }

    return 'За всё время';
  }, [rangeFilter, selectedDate]);

  const jumpToToday = () => {
    const today = dayjs();
    setSelectedDate(today.startOf('day'));
    setCurrentDate(today.startOf('month'));
    setRangeFilter('day');
  };

  const jumpToLatestRecord = () => {
    if (!tabRecords.length) return;
    const latest = dayjs(tabRecords[0].endTime);
    setSelectedDate(latest.startOf('day'));
    setCurrentDate(latest.startOf('month'));
    setRangeFilter('day');
  };

  const resetAdvancedFilters = () => {
    setDurationFilter('all');
    setTimeSlotFilter('all');
    setSortMode('recent');
    setOnlyGoalTracked(false);
  };

  const handleDelete = async (id: string) => {
    const next = allRecords.filter((record) => record.id !== id);
    setAllRecords(next);
    setSelectedRecord(null);
    await storageSaveHistory(HISTORY_KEY, next);
  };

  const handleUpdate = async (updatedRecord: HistoryRecord) => {
    const next = allRecords.map((record) => (
      record.id === updatedRecord.id ? updatedRecord : record
    ));
    setAllRecords(next);
    setSelectedRecord(updatedRecord);
    await storageSaveHistory(HISTORY_KEY, next);
  };

  const hasAnyRecordsInTab = tabRecords.length > 0;

  return (
    <div className="min-h-full flex flex-col pb-6 relative z-0">
      <div className="px-6 pt-6 mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-[900] app-header leading-tight">Штаб истории</h1>
          <p className="mt-1 text-[12px] app-muted">
            {scopeLabel} • {sortedRangeRecords.length} сессий после фильтров
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-full app-panel flex items-center justify-center app-muted"
            aria-label="Открыть меню истории"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <ProfileAvatar onClick={() => navigate('/profile/settings')} />
        </div>
      </div>

      <div className="px-4 mb-3">
        <SegmentedControl options={tabs} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {viewMeta.map((view) => (
            <button
              key={view.id}
              type="button"
              onClick={() => setViewMode(view.id)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide whitespace-nowrap border transition-colors',
                viewMode === view.id
                  ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] border-transparent'
                  : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
              )}
            >
              <view.icon className="w-3.5 h-3.5" />
              {view.label}
            </button>
          ))}

          {(Object.keys(rangeLabels) as RangeFilter[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setRangeFilter(range)}
              className={cn(
                'px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide whitespace-nowrap border transition-colors',
                rangeFilter === range
                  ? 'bg-[color:var(--tg-accent)] text-[color:var(--tg-accent-contrast)] border-transparent'
                  : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
              )}
            >
              {rangeLabels[range]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 px-4">
        {viewMode === 'feed' && (
          <div className="space-y-5">
            <section className="app-card rounded-[2rem] p-5 border border-[color:var(--tg-border)] overflow-hidden relative">
              <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-400/10 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest app-muted">Фокус периода</p>
                    <p className="mt-1 text-lg font-black app-header">{rangeLabels[rangeFilter]}: {rangeStats.sessionCount} сессий</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <MetricCard
                    label="Серия"
                    value={`${baselineStats.streakDays} дн`}
                    hint="Текущий ритм"
                    icon={TrendingUp}
                    toneClass="text-emerald-500"
                  />
                  <MetricCard
                    label="Среднее"
                    value={formatDuration(rangeStats.avgSeconds, activeTab)}
                    hint="На сессию"
                    icon={BarChart3}
                    toneClass="text-violet-500"
                  />
                  <MetricCard
                    label="Суммарно"
                    value={formatDuration(rangeStats.totalSeconds, activeTab)}
                    hint="За период"
                    icon={Hourglass}
                    toneClass="text-blue-500"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold app-muted uppercase tracking-widest mb-3 pl-1">
                Лента • {scopeLabel}
              </h3>

              {isLoading ? (
                <HistorySkeleton />
              ) : sortedRangeRecords.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-[color:var(--tg-border)] rounded-2xl bg-[color:var(--tg-glass)]">
                  <div
                    className={cn(
                      'mx-auto mb-3 flex items-center justify-center',
                      hasAnyRecordsInTab
                        ? 'w-14 h-14 rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]'
                        : 'w-16 h-16'
                    )}
                  >
                    {!hasAnyRecordsInTab ? (
                      <AnimatedSticker name="sun" size={54} className="animate-article-orbit" />
                    ) : (
                      <>
                        {activeTab === 'fasting' ? (
                          <Flame className="w-7 h-7 text-blue-500" />
                        ) : (
                          <Wind className="w-7 h-7 text-violet-500" />
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-sm font-medium app-muted">
                    {hasAnyRecordsInTab ? 'Нет записей в этом диапазоне' : 'Пока нет записей. Начнем?'}
                  </p>
                  {hasAnyRecordsInTab && (
                    <button
                      type="button"
                      onClick={resetAdvancedFilters}
                      className="mt-3 px-3 py-2 rounded-xl border border-[color:var(--tg-border)] text-[11px] font-bold uppercase tracking-wide app-muted"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  {groupedVisibleRecords.map((group) => (
                    <div key={group.key}>
                      <div className="text-[11px] font-bold uppercase tracking-wide app-muted mb-2 pl-1">
                        {group.title}
                      </div>

                      <div className="space-y-2">
                        {group.records.map((record) => {
                          const isFasting = record.type === 'fasting';
                          const targetHours = isFasting ? parseTargetHoursFromScheme(record.scheme) : null;
                          const targetDiffSeconds = targetHours != null
                            ? record.durationSeconds - targetHours * 3600
                            : null;

                          const targetBadge = targetDiffSeconds == null
                            ? null
                            : Math.abs(targetDiffSeconds) < 5 * 60
                              ? 'по плану'
                              : `${targetDiffSeconds >= 0 ? '+' : '-'}${formatDuration(Math.abs(targetDiffSeconds), 'fasting')}`;

                          const slot = getTimeSlot(record.endTime);

                          return (
                            <button
                              key={record.id}
                              type="button"
                              onClick={() => setSelectedRecord(record)}
                              className={cn(
                                'w-full text-left app-card rounded-[1.4rem] border border-[color:var(--tg-border)] p-4 flex items-center gap-3 active:scale-[0.99] transition-transform',
                                isFasting ? 'hover:border-blue-200/60' : 'hover:border-violet-200/60'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-white shadow-sm',
                                  isFasting ? 'bg-blue-500' : 'bg-violet-500'
                                )}
                              >
                                {isFasting ? <Flame className="w-5 h-5" /> : <Wind className="w-5 h-5" />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold app-header truncate">{record.scheme}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] app-muted">
                                  <span>{dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}</span>
                                  <span className="px-2 py-0.5 rounded-full border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]">
                                    {timeSlotLabels[slot]}
                                  </span>
                                  {targetBadge && (
                                    <span
                                      className={cn(
                                        'px-2 py-0.5 rounded-full font-bold border',
                                        targetBadge === 'по плану' && 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-400/30',
                                        targetBadge !== 'по плану' && targetDiffSeconds != null && targetDiffSeconds > 0 && 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400/30',
                                        targetBadge !== 'по плану' && targetDiffSeconds != null && targetDiffSeconds < 0 && 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-400/30'
                                      )}
                                    >
                                      {targetBadge}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className={cn('text-sm font-black tabular-nums', isFasting ? 'text-blue-600' : 'text-violet-600')}>
                                  {formatDuration(record.durationSeconds, activeTab)}
                                </p>
                                <p className="text-[10px] app-muted mt-1">{dayjs(record.endTime).format('D MMM')}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {sortedRangeRecords.length > visibleCount && (
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, sortedRangeRecords.length))}
                      className="w-full py-3 rounded-2xl border border-[color:var(--tg-border)] text-xs font-bold uppercase tracking-widest text-[color:var(--tg-muted)] hover:bg-[color:var(--tg-glass)] transition-colors"
                    >
                      Показать ещё
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="space-y-5">
            <section className="app-card rounded-[2rem] p-5 border border-[color:var(--tg-border)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black app-header capitalize">{currentDate.format('MMMM YYYY')}</h2>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentDate((value) => value.subtract(1, 'month'))}
                    className="p-2 rounded-full hover:bg-[color:var(--tg-glass)] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[color:var(--tg-muted)]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentDate((value) => value.add(1, 'month'))}
                    className="p-2 rounded-full hover:bg-[color:var(--tg-glass)] transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[color:var(--tg-muted)]" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={jumpToToday}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)]"
                >
                  <CalendarDays className="w-3.5 h-3.5" /> Сегодня
                </button>
                <button
                  type="button"
                  onClick={jumpToLatestRecord}
                  disabled={!tabRecords.length}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] disabled:opacity-40"
                >
                  <Target className="w-3.5 h-3.5" /> Последняя запись
                </button>
              </div>

              <div className="grid grid-cols-7 gap-y-3 mb-3">
                {WEEKDAY_SHORT.map((weekday) => (
                  <div key={weekday} className="text-center text-[10px] font-bold uppercase app-muted">{weekday}</div>
                ))}

                {daysInMonth.map((dayNumber, index) => {
                  if (dayNumber == null) return <div key={`empty-${index}`} />;

                  const date = currentDate.date(dayNumber).startOf('day');
                  const key = getDayKey(date);
                  const isSelected = selectedDate.isSame(date, 'day');
                  const isToday = dayjs().isSame(date, 'day');
                  const activity = activityByDay.get(key);
                  const level = getActivityLevel(activity, activeTab);

                  return (
                    <div key={key} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(date);
                          setRangeFilter('day');
                        }}
                        className={cn(
                          'w-10 h-10 rounded-full text-sm font-bold relative flex items-center justify-center transition-all',
                          isSelected
                            ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] shadow-lg scale-105'
                            : 'text-[color:var(--tg-text)] hover:bg-[color:var(--tg-glass)]',
                          isToday && !isSelected && 'text-[color:var(--tg-accent)]'
                        )}
                      >
                        {dayNumber}
                        {!isSelected && level > 0 && (
                          <span
                            className={cn(
                              'absolute bottom-1.5 w-1.5 h-1.5 rounded-full',
                              level === 1 && 'bg-[color:var(--tg-border)]',
                              level === 2 && (activeTab === 'fasting' ? 'bg-blue-400' : 'bg-violet-400'),
                              level === 3 && (activeTab === 'fasting' ? 'bg-blue-600' : 'bg-violet-600')
                            )}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2 flex items-center justify-between text-[11px]">
                <span className="app-muted">В месяце: {monthlyStats.sessionCount} сессий</span>
                <span className="font-bold app-header">{formatDuration(monthlyStats.totalSeconds, activeTab)}</span>
              </div>
            </section>

            <section>
              <h3 className="text-[11px] font-bold app-muted uppercase tracking-widest mb-3 pl-1">
                День • {selectedDate.isSame(dayjs(), 'day') ? 'Сегодня' : selectedDate.format('D MMMM')}
              </h3>

              {selectedDayRecords.length === 0 ? (
                <div className="text-center py-8 app-card rounded-[1.6rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)]">
                  <p className="text-sm app-muted">Нет записей в выбранный день</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDayRecords.map((record) => (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedRecord(record)}
                      className="w-full text-left app-card rounded-[1.4rem] border border-[color:var(--tg-border)] p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold app-header truncate">{record.scheme}</p>
                        <p className="text-[11px] app-muted mt-1">
                          {dayjs(record.startTime).format('HH:mm')} - {dayjs(record.endTime).format('HH:mm')}
                        </p>
                      </div>
                      <p className={cn('text-sm font-black', record.type === 'fasting' ? 'text-blue-600' : 'text-violet-600')}>
                        {formatDuration(record.durationSeconds, activeTab)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {viewMode === 'insights' && (
          <div className="space-y-5">
            <section className="grid grid-cols-2 gap-2">
              <MetricCard
                label="Суммарно"
                value={formatDuration(rangeStats.totalSeconds, activeTab)}
                hint="В выбранном диапазоне"
                icon={Hourglass}
                toneClass="text-blue-500"
              />
              <MetricCard
                label="Рекорд"
                value={formatDuration(rangeStats.maxSeconds, activeTab)}
                hint="Лучшая сессия"
                icon={Trophy}
                toneClass="text-amber-500"
              />
              <MetricCard
                label="Среднее"
                value={formatDuration(rangeStats.avgSeconds, activeTab)}
                hint="На сессию"
                icon={BarChart3}
                toneClass="text-violet-500"
              />
              <MetricCard
                label="Стабильность"
                value={`${consistencyPercent}%`}
                hint="Активные дни"
                icon={TrendingUp}
                toneClass="text-emerald-500"
              />
            </section>

            <section className="app-card rounded-[1.8rem] p-4 border border-[color:var(--tg-border)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest app-muted">Динамика недели</p>
                <p className={cn('text-sm font-black', weekDeltaPercent >= 0 ? 'text-emerald-500' : 'text-amber-500')}>
                  {weekDeltaPercent >= 0 ? '+' : ''}{weekDeltaPercent}%
                </p>
              </div>
              <p className="text-xs app-muted">
                Сравнение текущей недели с предыдущей по суммарной длительности.
              </p>
            </section>

            <section className="app-card rounded-[1.8rem] p-4 border border-[color:var(--tg-border)]">
              <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-3">Профиль времени</p>
              <div className="space-y-2">
                {timeSlotDistribution.map((slot) => (
                  <div key={slot.slot}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="app-muted">{slot.label}</span>
                      <span className="font-bold app-header">{slot.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[color:var(--tg-glass)] overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', activeTab === 'fasting' ? 'bg-blue-500' : 'bg-violet-500')}
                        style={{ width: `${slot.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="app-card rounded-[1.8rem] p-4 border border-[color:var(--tg-border)]">
              <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2">Лучший день недели</p>
              <p className="text-lg font-black app-header">{rangeStats.bestWeekdayLabel}</p>
              <p className="text-xs app-muted mt-1">Сессий в периоде: {rangeStats.sessionCount}</p>
            </section>
          </div>
        )}

        {viewMode === 'goals' && (
          <div className="space-y-5">
            {activeTab === 'fasting' ? (
              <>
                <section className="grid grid-cols-3 gap-2">
                  <MetricCard
                    label="Отслеживается"
                    value={`${fastingGoalStats.tracked}`}
                    hint="С целью"
                    icon={Target}
                    toneClass="text-blue-500"
                  />
                  <MetricCard
                    label="Выполнено"
                    value={`${fastingGoalStats.completionRate}%`}
                    hint="Точность"
                    icon={Check}
                    toneClass="text-emerald-500"
                  />
                  <MetricCard
                    label="Средний дельта"
                    value={`${fastingGoalStats.avgDeltaHours >= 0 ? '+' : ''}${fastingGoalStats.avgDeltaHours}ч`}
                    hint="Факт к плану"
                    icon={BarChart3}
                    toneClass="text-violet-500"
                  />
                </section>

                {fastingGoalStats.tracked === 0 ? (
                  <div className="app-card rounded-[1.8rem] p-5 border border-[color:var(--tg-border)] text-center">
                    <p className="text-sm font-semibold app-header">Пока нет отслеживаемых целей</p>
                    <p className="text-xs app-muted mt-2">
                      Добавляйте длительность в название схемы, например: «Классика 24ч», чтобы получить аналитику выполнения.
                    </p>
                  </div>
                ) : (
                  <section className="app-card rounded-[1.8rem] p-4 border border-[color:var(--tg-border)]">
                    <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-3">Почти достигнутые цели</p>
                    {fastingGoalStats.nearMisses.length === 0 ? (
                      <p className="text-sm app-muted">Отлично, критичных недоборов в диапазоне нет.</p>
                    ) : (
                      <div className="space-y-2">
                        {fastingGoalStats.nearMisses.map((record) => (
                          <button
                            key={record.id}
                            type="button"
                            onClick={() => setSelectedRecord(record)}
                            className="w-full text-left rounded-xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2"
                          >
                            <p className="text-sm font-semibold app-header truncate">{record.scheme}</p>
                            <p className="text-[11px] app-muted mt-1">
                              {dayjs(record.endTime).format('D MMM • HH:mm')} • {formatDuration(record.durationSeconds, 'fasting')}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>
                )}
              </>
            ) : (
              <>
                <section className="grid grid-cols-3 gap-2">
                  <MetricCard
                    label="Глубокие"
                    value={`${breathingFocusStats.deepSessions}`}
                    hint=">= 20 минут"
                    icon={Wind}
                    toneClass="text-violet-500"
                  />
                  <MetricCard
                    label="Фокус"
                    value={`${breathingFocusStats.focusMinutes}м`}
                    hint="Всего минут"
                    icon={Hourglass}
                    toneClass="text-blue-500"
                  />
                  <MetricCard
                    label="Ритм"
                    value={`${breathingFocusStats.sessionsPerActiveDay}`}
                    hint="Сессий/день"
                    icon={TrendingUp}
                    toneClass="text-emerald-500"
                  />
                </section>

                <section className="app-card rounded-[1.8rem] p-4 border border-[color:var(--tg-border)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2">Рекомендация</p>
                  <p className="text-sm app-header font-semibold">
                    {timeSlotDistribution[0]?.count === 0
                      ? 'Добавьте 3 короткие практики на этой неделе для стабильного ритма.'
                      : 'Зафиксируйте одно стабильное окно практики и держите серию 7 дней.'}
                  </p>
                  <p className="text-xs app-muted mt-2">
                    Лучшее текущее окно: {bestTimeSlotLabel}.
                  </p>
                </section>
              </>
            )}
          </div>
        )}
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[100]"
            onClick={() => setMenuOpen(false)}
            aria-label="Закрыть меню"
          />

          <div
            className="fixed left-0 right-0 bottom-0 z-[101] max-w-md mx-auto h-[85vh] app-surface rounded-t-[2.4rem] border-t border-[color:var(--tg-border)] animate-sheet-in flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-[color:var(--tg-border)] rounded-full" />
            </div>

            <div className="px-5 pb-3 flex items-center justify-between border-b border-[color:var(--tg-border)] shrink-0">
              <div>
                <h3 className="text-lg font-black app-header">Расширенное меню</h3>
                <p className="text-xs app-muted">{sortedRangeRecords.length} сессий после фильтров</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full app-panel flex items-center justify-center"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4 app-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 pb-safe">
              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2 pl-1">Фокус</p>
                <div className="app-card rounded-[1.4rem] p-3 border border-[color:var(--tg-border)] space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(rangeLabels) as RangeFilter[]).map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setRangeFilter(range)}
                        className={cn(
                          'px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border',
                          rangeFilter === range
                            ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] border-transparent'
                            : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                        )}
                      >
                        {rangeLabels[range]}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {viewMeta.map((view) => (
                      <button
                        key={view.id}
                        type="button"
                        onClick={() => setViewMode(view.id)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border',
                          viewMode === view.id
                            ? 'bg-[color:var(--tg-accent)] text-[color:var(--tg-accent-contrast)] border-transparent'
                            : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                        )}
                      >
                        <view.icon className="w-3.5 h-3.5" />
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2 pl-1">Фильтры</p>
                <div className="app-card rounded-[1.4rem] p-3 border border-[color:var(--tg-border)] space-y-3">
                  <div>
                    <p className="text-[11px] font-semibold app-muted mb-2">Длительность</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(durationFilterLabels) as DurationFilter[]).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setDurationFilter(filter)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border',
                            durationFilter === filter
                              ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] border-transparent'
                              : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                          )}
                        >
                          {durationFilterLabels[filter]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold app-muted mb-2">Время дня</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(timeSlotLabels) as TimeSlotFilter[]).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTimeSlotFilter(slot)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide border',
                            timeSlotFilter === slot
                              ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] border-transparent'
                              : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                          )}
                        >
                          {timeSlotLabels[slot]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTab === 'fasting' && (
                    <button
                      type="button"
                      onClick={() => setOnlyGoalTracked((value) => !value)}
                      className={cn(
                        'w-full text-left rounded-xl border px-3 py-2 text-[11px] font-bold uppercase tracking-wide',
                        onlyGoalTracked
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                      )}
                    >
                      Только с указанной целью
                    </button>
                  )}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2 pl-1">Сортировка</p>
                <div className="app-card rounded-[1.4rem] p-3 border border-[color:var(--tg-border)] space-y-2">
                  {(Object.keys(sortLabels) as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSortMode(mode)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-xl border text-[12px] font-semibold',
                        sortMode === mode
                          ? 'bg-[color:var(--tg-text)] text-[color:var(--tg-bg)] border-transparent'
                          : 'bg-[color:var(--tg-glass)] text-[color:var(--tg-muted)] border-[color:var(--tg-border)]'
                      )}
                    >
                      {sortLabels[mode]}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest app-muted mb-2 pl-1">Операции</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={jumpToToday}
                    className="app-card rounded-[1.2rem] p-3 border border-[color:var(--tg-border)] text-xs font-bold uppercase tracking-wide app-muted"
                  >
                    Сегодня
                  </button>
                  <button
                    type="button"
                    onClick={jumpToLatestRecord}
                    className="app-card rounded-[1.2rem] p-3 border border-[color:var(--tg-border)] text-xs font-bold uppercase tracking-wide app-muted"
                  >
                    Последняя запись
                  </button>
                  <button
                    type="button"
                    onClick={resetAdvancedFilters}
                    className="app-card rounded-[1.2rem] p-3 border border-[color:var(--tg-border)] text-xs font-bold uppercase tracking-wide app-muted col-span-2"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              </section>
            </div>
          </div>
        </>
      )}

      {selectedRecord && (
        <RecordDetails
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};
