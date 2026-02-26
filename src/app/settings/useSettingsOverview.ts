import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import WebApp from '@twa-dev/sdk';
import { storageGet, storageGetHistory } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';
import type { HistoryRecord } from '../../utils/types';

export type InstallState = 'installed' | 'available' | 'unavailable';

export interface SettingsOverview {
  isLoading: boolean;
  themeLabel: string;
  historyCount: number;
  lastActivityLabel: string;
  lastBackupLabel: string;
  legalAccepted: boolean;
  installState: InstallState;
  installLabel: string;
  readinessScore: number;
}

const getInstallState = (): InstallState => {
  if (typeof window === 'undefined') return 'unavailable';

  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  if (standalone) return 'installed';

  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);

  try {
    if (WebApp.isVersionAtLeast('8.0')) return 'available';
  } catch {
    // ignore
  }

  if (isIOS) return 'available';

  return 'unavailable';
};

const formatRelativeDate = (value: string | null) => {
  if (!value) return 'Нет данных';
  const parsed = dayjs(value);
  if (!parsed.isValid()) return 'Нет данных';

  const now = dayjs();
  if (parsed.isSame(now, 'day')) return `Сегодня, ${parsed.format('HH:mm')}`;
  if (parsed.isSame(now.subtract(1, 'day'), 'day')) return `Вчера, ${parsed.format('HH:mm')}`;
  return parsed.format('D MMM YYYY');
};

const getThemeLabel = (mode: 'light' | 'dark' | 'auto') => {
  if (mode === 'light') return 'Светлая';
  if (mode === 'dark') return 'Тёмная';
  return 'Авто';
};

const calcReadinessScore = (params: {
  historyCount: number;
  legalAccepted: boolean;
  hasBackup: boolean;
  installState: InstallState;
}) => {
  let score = 30;

  if (params.historyCount > 0) score += 20;
  if (params.legalAccepted) score += 20;
  if (params.hasBackup) score += 20;
  if (params.installState === 'installed') score += 10;

  return Math.min(100, score);
};

export const useSettingsOverview = () => {
  const { mode } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [historyCount, setHistoryCount] = useState(0);
  const [lastActivityLabel, setLastActivityLabel] = useState('Нет данных');
  const [lastBackupLabel, setLastBackupLabel] = useState('Не создан');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [installState, setInstallState] = useState<InstallState>('unavailable');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [history, acceptedRaw, backupRaw] = await Promise.all([
        storageGetHistory<HistoryRecord>('history_fasting'),
        storageGet('has_accepted_terms'),
        storageGet('last_backup_export_at'),
      ]);

      const sorted = history
        .filter((record) => Number.isFinite(Date.parse(record.endTime)))
        .sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));

      setHistoryCount(sorted.length);
      setLastActivityLabel(sorted.length ? formatRelativeDate(sorted[0].endTime) : 'Нет записей');
      setLastBackupLabel(backupRaw ? formatRelativeDate(backupRaw) : 'Не создан');
      setLegalAccepted(acceptedRaw === 'true');
      setInstallState(getInstallState());
    } catch (error) {
      console.error('Failed to load settings overview', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const installLabel = useMemo(() => {
    if (installState === 'installed') return 'Установлено';
    if (installState === 'available') return 'Доступно';
    return 'Недоступно';
  }, [installState]);

  const themeLabel = useMemo(() => getThemeLabel(mode), [mode]);

  const readinessScore = useMemo(
    () => calcReadinessScore({
      historyCount,
      legalAccepted,
      hasBackup: lastBackupLabel !== 'Не создан',
      installState,
    }),
    [historyCount, legalAccepted, lastBackupLabel, installState]
  );

  return {
    isLoading,
    themeLabel,
    historyCount,
    lastActivityLabel,
    lastBackupLabel,
    legalAccepted,
    installState,
    installLabel,
    readinessScore,
    refresh,
  } satisfies SettingsOverview & { refresh: () => Promise<void> };
};
