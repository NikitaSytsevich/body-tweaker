import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Download, Upload, Trash2, Loader2, Database, Clock3, HardDrive } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ToastNotification } from '../../components/ui/ToastNotification';
import {
  storageGet,
  storageRemove,
  storageGetJSON,
  storageSetJSON,
  storageSet,
  storageGetHistory,
  storageSaveHistory,
} from '../../utils/storage';
import type { HistoryRecord } from '../../utils/types';

interface DataStats {
  historyCount: number;
  historySizeBytes: number;
  lastSessionLabel: string;
  lastBackupLabel: string;
}

const MAX_BACKUP_SIZE = 5 * 1024 * 1024;

const formatDateLabel = (value: string | null) => {
  if (!value) return 'Нет данных';
  const date = dayjs(value);
  if (!date.isValid()) return 'Нет данных';
  if (date.isSame(dayjs(), 'day')) return `Сегодня, ${date.format('HH:mm')}`;
  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return `Вчера, ${date.format('HH:mm')}`;
  return date.format('D MMM YYYY');
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const emptyStats: DataStats = {
  historyCount: 0,
  historySizeBytes: 0,
  lastSessionLabel: 'Нет записей',
  lastBackupLabel: 'Не создан',
};

export const DataSettingsPage = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<DataStats>(emptyStats);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStats = useCallback(async () => {
    try {
      const [history, lastBackupRaw] = await Promise.all([
        storageGetHistory<HistoryRecord>('history_fasting'),
        storageGet('last_backup_export_at'),
      ]);

      const sorted = [...history].sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime));
      const historySizeBytes = new Blob([JSON.stringify(history)]).size;

      setStats({
        historyCount: sorted.length,
        historySizeBytes,
        lastSessionLabel: sorted.length ? formatDateLabel(sorted[0].endTime) : 'Нет записей',
        lastBackupLabel: lastBackupRaw ? formatDateLabel(lastBackupRaw) : 'Не создан',
      });
    } catch (error) {
      console.error('Failed to load data stats', error);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const showFeedback = (title: string, message: string) => {
    setToastMessage({ title, message });
    setShowToast(true);
  };

  const handleReset = () => setShowResetConfirm(true);

  const confirmReset = async () => {
    setIsProcessing(true);
    try {
      await storageSaveHistory('history_fasting', []);
      await Promise.all([
        storageRemove('history_fasting'),
        storageRemove('fasting_startTime'),
        storageRemove('fasting_scheme'),
        storageRemove('user_name'),
        storageRemove('has_accepted_terms'),
        storageRemove('legal_acceptance_v1'),
        storageRemove('theme_mode'),
        storageRemove('last_backup_export_at'),
      ]);
      window.location.reload();
    } catch (error) {
      console.error('Reset failed', error);
      showFeedback('Ошибка сброса', 'Не удалось очистить данные. Попробуйте позже.');
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const [history, startTime, scheme, userName, terms, legalAcceptance, themeMode, schemaVersion] = await Promise.all([
        storageGetHistory('history_fasting'),
        storageGet('fasting_startTime'),
        storageGet('fasting_scheme'),
        storageGet('user_name'),
        storageGet('has_accepted_terms'),
        storageGetJSON('legal_acceptance_v1', null),
        storageGet('theme_mode'),
        storageGet('schema_version'),
      ]);

      const exportedAt = new Date().toISOString();

      const backupData = {
        version: 1,
        exportedAt,
        data: {
          history_fasting: history,
          fasting_startTime: startTime,
          fasting_scheme: scheme,
          user_name: userName,
          has_accepted_terms: terms,
          legal_acceptance_v1: legalAcceptance,
          theme_mode: themeMode,
          schema_version: schemaVersion,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `bodytweaker_backup_${dayjs().format('YYYY-MM-DD')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await storageSet('last_backup_export_at', exportedAt);
      await loadStats();
      showFeedback('Бэкап создан', 'Файл успешно сохранён на устройстве.');
    } catch (error) {
      console.error('Export failed', error);
      showFeedback('Ошибка экспорта', 'Не удалось создать резервную копию.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BACKUP_SIZE) {
      showFeedback('Файл слишком большой', 'Выберите резервную копию до 5 MB.');
      event.target.value = '';
      return;
    }

    const isObject = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const isString = (value: unknown): value is string => typeof value === 'string';
    const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

    const isHistoryRecord = (value: unknown): value is HistoryRecord => {
      if (!isObject(value)) return false;
      const type = value.type;
      return (
        isString(value.id) &&
        (type === 'fasting' || type === 'breathing') &&
        isString(value.scheme) &&
        isString(value.startTime) &&
        isString(value.endTime) &&
        isNumber(value.durationSeconds)
      );
    };

    const reader = new FileReader();

    reader.onload = async (loadEvent) => {
      setIsProcessing(true);
      try {
        const content = loadEvent.target?.result;
        if (typeof content !== 'string') throw new Error('Invalid file content');

        const parsed = JSON.parse(content) as unknown;
        if (!isObject(parsed) || !isObject(parsed.data)) {
          throw new Error('Invalid backup shape');
        }

        const version = parsed.version;
        if (version != null && version !== 1) {
          throw new Error('Unsupported backup version');
        }

        const { data } = parsed;
        const operations: Promise<unknown>[] = [];

        if (Array.isArray(data.history_fasting)) {
          const safeHistory = data.history_fasting.filter(isHistoryRecord);
          await storageRemove('history_fasting');
          await storageSaveHistory('history_fasting', safeHistory);
        }

        if (isString(data.fasting_startTime)) operations.push(storageSet('fasting_startTime', data.fasting_startTime));
        if (isString(data.fasting_scheme)) operations.push(storageSet('fasting_scheme', data.fasting_scheme));
        if (isString(data.user_name)) operations.push(storageSet('user_name', data.user_name));
        if (data.has_accepted_terms === true) operations.push(storageSet('has_accepted_terms', 'true'));
        if (isString(data.has_accepted_terms)) operations.push(storageSet('has_accepted_terms', data.has_accepted_terms));
        if (isObject(data.legal_acceptance_v1)) operations.push(storageSetJSON('legal_acceptance_v1', data.legal_acceptance_v1));
        if (isString(data.theme_mode) && ['light', 'dark', 'auto'].includes(data.theme_mode)) {
          operations.push(storageSet('theme_mode', data.theme_mode));
        }
        if (isString(data.schema_version)) operations.push(storageSet('schema_version', data.schema_version));

        await Promise.all(operations);
        showFeedback('Импорт завершён', 'Данные восстановлены. Перезапускаем приложение.');

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Import failed', error);
        showFeedback('Ошибка импорта', 'Файл не подходит или повреждён.');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const triggerImport = () => fileInputRef.current?.click();

  const historySizeLabel = useMemo(() => formatBytes(stats.historySizeBytes), [stats.historySizeBytes]);

  return (
    <>
      <SettingsShell title="Данные" subtitle="Резервные копии и контроль хранения">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-5">
          <SettingsSection title="Сводка">
            <div className="grid grid-cols-2 gap-2">
              <div className="app-panel rounded-[1.4rem] p-4">
                <div className="flex items-center gap-2 mb-2 app-muted text-[10px] font-bold uppercase tracking-widest">
                  <Database className="w-3.5 h-3.5" />
                  История
                </div>
                <p className="text-lg font-black app-header">{stats.historyCount}</p>
                <p className="text-[11px] app-muted mt-1">{stats.lastSessionLabel}</p>
              </div>

              <div className="app-panel rounded-[1.4rem] p-4">
                <div className="flex items-center gap-2 mb-2 app-muted text-[10px] font-bold uppercase tracking-widest">
                  <HardDrive className="w-3.5 h-3.5" />
                  Размер
                </div>
                <p className="text-lg font-black app-header">{historySizeLabel}</p>
                <p className="text-[11px] app-muted mt-1">Бэкап: {stats.lastBackupLabel}</p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Резервная копия">
            <SettingsGroup>
              <SettingsRow
                icon={Download}
                label="Экспорт"
                description="Скачать файл с историей и настройками"
                onClick={handleExport}
                disabled={isProcessing}
                right={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                iconBgClassName="bg-sky-100 dark:bg-sky-500/20"
                iconClassName="text-sky-600 dark:text-sky-400"
              />
              <SettingsRow
                icon={Upload}
                label="Импорт"
                description="Восстановить данные из файла"
                onClick={triggerImport}
                disabled={isProcessing}
                iconBgClassName="bg-emerald-100 dark:bg-emerald-500/20"
                iconClassName="text-emerald-600 dark:text-emerald-400"
              />
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection
            title="Сброс"
            description="Полностью очистит историю, тему и юридические согласия."
          >
            <SettingsGroup>
              <SettingsRow
                icon={Trash2}
                label="Сбросить все данные"
                description="Необратимое удаление"
                onClick={handleReset}
                tone="danger"
                disabled={isProcessing}
              />
            </SettingsGroup>
          </SettingsSection>

          <div className="rounded-[1.6rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)] p-4 text-xs app-muted">
            <div className="flex items-center gap-2 mb-2">
              <Clock3 className="w-4 h-4" />
              Бэкап включает историю, тему и профильные ключи.
            </div>
            Храните последний экспорт в безопасном месте. Рекомендуем делать копию перед крупными изменениями.
          </div>
        </div>
      </SettingsShell>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={confirmReset}
        title="Удаление данных"
        message="Это действие необратимо удалит всю историю и настройки."
        confirmText="Да, удалить"
        variant="danger"
      />

      <ToastNotification
        isVisible={showToast}
        title={toastMessage.title}
        message={toastMessage.message}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};
