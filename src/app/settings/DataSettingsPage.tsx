import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Loader2 } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ToastNotification } from '../../components/ui/ToastNotification';
import { storageGet, storageRemove, storageGetJSON, storageSetJSON, storageSet, storageGetHistory, storageSaveHistory } from '../../utils/storage';

export const DataSettingsPage = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_BACKUP_SIZE = 5 * 1024 * 1024; // 5MB safety limit

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
      ]);
      window.location.reload();
    } catch (e) {
      console.error('Reset failed', e);
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

      const backupData = {
        version: 1,
        date: new Date().toISOString(),
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
      link.download = `bodytweaker_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastMessage({ title: 'Бэкап создан', message: 'Файл сохранен' });
      setShowExportToast(true);
    } catch (e) {
      console.error('Export failed', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_BACKUP_SIZE) {
      alert('Файл слишком большой. Пожалуйста, выберите другой бэкап.');
      event.target.value = '';
      return;
    }

    const isObject = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const isString = (value: unknown): value is string => typeof value === 'string';
    const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
    const isHistoryRecord = (value: unknown) => {
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
    reader.onload = async (e) => {
      setIsProcessing(true);
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (!isObject(parsed) || (parsed.version != null && parsed.version !== 1) || !isObject(parsed.data)) {
          throw new Error('Invalid backup');
        }
        const { data } = parsed;

        const promises = [];
        if (Array.isArray(data.history_fasting)) {
          const safeHistory = data.history_fasting.filter(isHistoryRecord);
          await storageRemove('history_fasting');
          await storageSaveHistory('history_fasting', safeHistory);
        }
        if (isString(data.fasting_startTime)) promises.push(storageSet('fasting_startTime', data.fasting_startTime));
        if (isString(data.fasting_scheme)) promises.push(storageSet('fasting_scheme', data.fasting_scheme));
        if (isString(data.user_name)) promises.push(storageSet('user_name', data.user_name));
        if (data.has_accepted_terms === true) promises.push(storageSet('has_accepted_terms', 'true'));
        if (isString(data.has_accepted_terms)) promises.push(storageSet('has_accepted_terms', data.has_accepted_terms));
        if (isObject(data.legal_acceptance_v1)) promises.push(storageSetJSON('legal_acceptance_v1', data.legal_acceptance_v1));
        if (isString(data.theme_mode) && ['light', 'dark', 'auto'].includes(data.theme_mode)) {
          promises.push(storageSet('theme_mode', data.theme_mode));
        }
        if (isString(data.schema_version)) promises.push(storageSet('schema_version', data.schema_version));

        await Promise.all(promises);
        window.location.reload();
      } catch (error) {
        alert('Ошибка формата файла');
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const triggerImport = () => fileInputRef.current?.click();

  return (
    <>
      <SettingsShell title="Данные" subtitle="Резервные копии и сброс">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="space-y-5">
          <SettingsSection title="Резервная копия">
            <SettingsGroup>
              <SettingsRow
                icon={Download}
                label="Экспорт"
                description="Скачать файл данных"
                onClick={handleExport}
                disabled={isProcessing}
                right={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                iconBgClassName="bg-sky-100 dark:bg-sky-500/20"
                iconClassName="text-sky-600 dark:text-sky-400"
              />
              <SettingsRow
                icon={Upload}
                label="Импорт"
                description="Загрузить файл бэкапа"
                onClick={triggerImport}
                disabled={isProcessing}
                right={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                iconBgClassName="bg-emerald-100 dark:bg-emerald-500/20"
                iconClassName="text-emerald-600 dark:text-emerald-400"
              />
            </SettingsGroup>
          </SettingsSection>

          <SettingsSection title="Сброс">
            <SettingsGroup>
              <SettingsRow
                icon={Trash2}
                label="Сбросить все данные"
                description="Удалить историю и настройки"
                onClick={handleReset}
                tone="danger"
                disabled={isProcessing}
              />
            </SettingsGroup>
          </SettingsSection>
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
        isVisible={showExportToast}
        title={toastMessage.title}
        message={toastMessage.message}
        onClose={() => setShowExportToast(false)}
      />
    </>
  );
};
