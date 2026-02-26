import { useEffect, useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { LEGAL_DOCS, getLegalDocById, type LegalDocId } from '../legal/legalDocs';
import { storageGet } from '../../utils/storage';

export const LegalSettingsPage = () => {
  const [selectedDocId, setSelectedDocId] = useState<LegalDocId | null>(null);
  const [accepted, setAccepted] = useState(false);

  const selectedDoc = selectedDocId ? getLegalDocById(selectedDocId) ?? null : null;

  useEffect(() => {
    let mounted = true;
    void storageGet('has_accepted_terms').then((value) => {
      if (!mounted) return;
      setAccepted(value === 'true');
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SettingsShell title="Правовые документы" subtitle="Соглашения, политика и актуальные версии">
      <div className="space-y-5">
        {!selectedDoc && (
          <>
            <div className="app-panel rounded-[1.8rem] p-4">
              <div className="flex items-center gap-3">
                {accepted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-bold app-header">
                    {accepted ? 'Согласие сохранено' : 'Рекомендуется проверка документов'}
                  </p>
                  <p className="text-xs app-muted">
                    Последние версии: {LEGAL_DOCS.length} документов
                  </p>
                </div>
              </div>
            </div>

            <SettingsSection title="Документы">
              <SettingsGroup>
                {LEGAL_DOCS.map((doc) => (
                  <SettingsRow
                    key={doc.id}
                    icon={FileText}
                    label={doc.shortTitle}
                    description={doc.summary}
                    onClick={() => setSelectedDocId(doc.id)}
                    iconBgClassName="bg-slate-100 dark:bg-slate-500/20"
                    iconClassName="text-slate-700 dark:text-slate-300"
                  />
                ))}
              </SettingsGroup>
            </SettingsSection>

            <SettingsSection
              title="Важно"
              description="Документы регулируют использование приложения и обработку данных."
            >
              <div className="rounded-[1.8rem] border border-[color:var(--tg-border)] bg-[color:var(--tg-surface)]/92 backdrop-blur-xl p-4 text-xs app-muted">
                Рекомендуем ознакомиться с актуальной версией перед использованием. Вы можете вернуться к списку в любой момент.
              </div>
            </SettingsSection>
          </>
        )}

        {selectedDoc && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDocId(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest app-muted"
            >
              <ShieldCheck className="w-4 h-4" />
              Назад к списку
            </button>

            <div className="app-panel p-5 rounded-[2rem]">
              <div className="text-xs app-muted mb-3">
                Версия {selectedDoc.version} от {selectedDoc.effectiveDate}
              </div>
              <h3 className="text-xl font-[900] app-header mb-4">
                {selectedDoc.title}
              </h3>
              <div className="space-y-4 text-sm app-muted leading-relaxed">
                {selectedDoc.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsShell>
  );
};
