import { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { FASTING_PHASES } from '../data/stages';
import { cn } from '../../../utils/cn';
import './protocol-selector-redesign.css';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
  currentSchemeId?: string;
}

const EXIT_WINDOW_MIN_SECONDS = 45 * 60;
const EXIT_WINDOW_MAX_SECONDS = 4 * 60 * 60;

type ProtocolTier = 'base' | 'balanced' | 'advanced' | 'deep';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getProtocolTier = (hours: number): { key: ProtocolTier; label: string } => {
  if (hours <= 24) return { key: 'base', label: 'База' };
  if (hours <= 48) return { key: 'balanced', label: 'Баланс' };
  if (hours <= 96) return { key: 'advanced', label: 'Продвинутый' };
  return { key: 'deep', label: 'Глубокий' };
};

const getPhaseDepth = (hours: number) => Math.max(1, FASTING_PHASES.filter((phase) => phase.hoursStart < hours).length);

const getExitWindowSeconds = (hours: number) => {
  const goalSeconds = hours * 3600;
  const dynamic = Math.floor(goalSeconds * 0.12);
  return clamp(dynamic, EXIT_WINDOW_MIN_SECONDS, EXIT_WINDOW_MAX_SECONDS);
};

const formatCompactDuration = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  if (h > 0) return `${h}ч ${m}м`;
  return `${m}м`;
};

export const ProtocolSelector = ({ onSelect, onClose, currentSchemeId }: Props) => {
  const [selectedId, setSelectedId] = useState(currentSchemeId ?? FASTING_SCHEMES[0]?.id ?? '24h');
  const [isClosing, setIsClosing] = useState(false);

  const selectedScheme = useMemo(
    () => FASTING_SCHEMES.find((scheme) => scheme.id === selectedId) ?? FASTING_SCHEMES[0],
    [selectedId]
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing((prev) => (prev ? prev : true));
  }, []);

  useEffect(() => {
    if (!isClosing) return;
    const timer = window.setTimeout(() => onClose(), 350);
    return () => window.clearTimeout(timer);
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelect(selectedId);
    handleClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={cn('ps-backdrop', isClosing && 'ps-closing')}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ps-dialog-title"
    >
      <div className="ps-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="ps-header">
          <h3 id="ps-dialog-title">Выбор протокола</h3>
          <button
            className="ps-close-btn"
            onClick={handleClose}
            aria-label="Закрыть окно выбора протокола"
            title="Закрыть"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div className="ps-list" role="listbox" aria-label="Список протоколов голодания">
          {FASTING_SCHEMES.map((scheme) => {
            const isActive = selectedId === scheme.id;
            const tier = getProtocolTier(scheme.hours);
            const phaseDepth = getPhaseDepth(scheme.hours);
            const exitWindow = formatCompactDuration(getExitWindowSeconds(scheme.hours));

            return (
              <button
                key={scheme.id}
                type="button"
                className={cn('ps-card', isActive && 'ps-card--selected')}
                onClick={() => setSelectedId(scheme.id)}
                role="option"
                aria-selected={isActive}
                aria-label={`Протокол ${scheme.title}`}
              >
                <div className="ps-card-main">
                  <div className="ps-card-top">
                    <span className={cn('ps-chip ps-chip--hours', isActive && 'ps-chip--active')}>
                      {scheme.hours}ч
                    </span>
                    <span className={cn('ps-chip ps-chip--tier', `ps-chip--${tier.key}`)}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="ps-card-title">{scheme.title}</div>
                  <div className="ps-card-desc">{scheme.description}</div>

                  <div className="ps-card-meta">
                    <div className="ps-meta-item">
                      <span className="ps-meta-label">Фаз до цели</span>
                      <span className="ps-meta-value">{phaseDepth}</span>
                    </div>
                    <div className="ps-meta-item">
                      <span className="ps-meta-label">Окно выхода</span>
                      <span className="ps-meta-value">{exitWindow}</span>
                    </div>
                  </div>
                </div>

                <div className="ps-card-action" aria-hidden="true">
                  <div className={cn('ps-checkbox', isActive && 'ps-checkbox--selected')}>
                    <div className="ps-checkbox-glow" />
                    <div className="ps-checkbox-ring" />
                    <svg className="ps-checkbox-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="ps-footer">
          <div className="ps-selected">
            <span className="ps-selected-dot" aria-hidden="true" />
            <p className="truncate text-[12px] app-muted">
              Выбрано: <span className="font-semibold text-[color:var(--tg-text)]">{selectedScheme?.title}</span>
            </p>
          </div>

          <button className="ps-cta" onClick={handleConfirm} disabled={!selectedId} aria-disabled={!selectedId}>
            {selectedId ? 'Начать голодание' : 'Выберите протокол'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
