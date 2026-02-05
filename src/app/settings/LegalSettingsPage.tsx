import { useState } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { SettingsShell } from './SettingsShell';
import { SettingsSection, SettingsGroup, SettingsRow } from '../../components/ui/SettingsList';
import { LEGAL_DOCS, getLegalDocById, type LegalDocId } from '../legal/legalDocs';

export const LegalSettingsPage = () => {
  const [selectedDocId, setSelectedDocId] = useState<LegalDocId | null>(null);
  const selectedDoc = selectedDocId ? getLegalDocById(selectedDocId) ?? null : null;

  return (
    <SettingsShell title="Правовые документы" subtitle="Соглашения и политика">
      <div className="space-y-5">
        {!selectedDoc && (
          <>
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
              <div className="rounded-[1.8rem] border border-white/60 dark:border-white/10 bg-white/70 dark:bg-[#1C1C1E]/80 backdrop-blur-xl p-4 text-xs text-slate-400 dark:text-slate-500">
                Рекомендуем ознакомиться с актуальной версией перед использованием. Вы можете вернуться к списку в любой момент.
              </div>
            </SettingsSection>
          </>
        )}

        {selectedDoc && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedDocId(null)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500"
            >
              <ShieldCheck className="w-4 h-4" />
              Назад к списку
            </button>

            <div className="bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                Версия {selectedDoc.version} от {selectedDoc.effectiveDate}
              </div>
              <h3 className="text-xl font-[900] text-slate-800 dark:text-white mb-4">
                {selectedDoc.title}
              </h3>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDoc.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </SettingsShell>
  );
};
