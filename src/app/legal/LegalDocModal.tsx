import { Modal } from '../../components/ui/Modal';
import type { LegalDoc } from './legalDocs';

interface LegalDocModalProps {
  doc: LegalDoc | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalDocModal = ({ doc, isOpen, onClose }: LegalDocModalProps) => {
  if (!doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doc.shortTitle}>
      <div className="space-y-4">
        <div className="text-xs text-slate-400 dark:text-slate-500">
          Версия {doc.version} от {doc.effectiveDate}
        </div>
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {doc.content}
        </div>
      </div>
    </Modal>
  );
};
