import { useState, useEffect, useCallback, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { FASTING_SCHEMES } from '../data/schemes';
import { cn } from '../../../utils/cn';
import './protocol-selector-redesign.css';

interface Props {
  onSelect: (id: string) => void;
  onClose: () => void;
  currentSchemeId?: string;
}

type ProtocolType = '24h' | '36h' | '48h' | '72h' | '96h' | '120h' | '168h';

const protocolTypeByHours = (hours: number): ProtocolType => {
  switch (hours) {
    case 36:
      return '36h';
    case 48:
      return '48h';
    case 72:
      return '72h';
    case 96:
      return '96h';
    case 120:
      return '120h';
    case 168:
      return '168h';
    case 24:
    default:
      return '24h';
  }
};

const ProtocolIcon = ({ type, active }: { type: ProtocolType; active: boolean }) => {
  const uid = useId().replace(/:/g, '');
  const stateClass = active ? 'icon--active' : 'icon--active icon--calm';
  const colorOpacity = active ? 1 : 0.72;

  if (type === '168h') {
    const grad1 = `grad168-1-${uid}`;
    const grad2 = `grad168-2-${uid}`;
    const glow = `glow168-${uid}`;

    return (
      <svg className={cn('ps-icon ps-icon-168h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={grad1} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8A2387" />
            <stop offset="50%" stopColor="#E94057" />
            <stop offset="100%" stopColor="#F27121" />
          </linearGradient>
          <linearGradient id={grad2} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F27121" />
            <stop offset="100%" stopColor="#8A2387" />
          </linearGradient>
          <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g className="ps-star-group" filter={`url(#${glow})`}>
          <rect className="ps-star-base" x="8" y="8" width="16" height="16" rx="3" fill="currentColor" />
          <rect
            className="ps-star-base"
            x="8"
            y="8"
            width="16"
            height="16"
            rx="3"
            fill="currentColor"
            transform="rotate(45 16 16)"
          />

          <rect
            className="ps-star-color-1"
            x="8"
            y="8"
            width="16"
            height="16"
            rx="3"
            fill={`url(#${grad1})`}
            style={{ opacity: colorOpacity, transition: 'opacity 0.5s ease' }}
          />
          <rect
            className="ps-star-color-2"
            x="8"
            y="8"
            width="16"
            height="16"
            rx="3"
            fill={`url(#${grad2})`}
            transform="rotate(45 16 16)"
            style={{ opacity: colorOpacity, transition: 'opacity 0.5s ease' }}
          />
          <rect
            className="ps-star-color-3"
            x="10"
            y="10"
            width="12"
            height="12"
            rx="2"
            fill="#fff"
            transform="rotate(22.5 16 16)"
            style={{ opacity: colorOpacity * 0.4 }}
          />

          <circle cx="16" cy="16" r="4" fill="#fff" className="ps-star-core" style={{ opacity: colorOpacity }} />
          <circle cx="16" cy="16" r="1.5" fill="#E94057" className="ps-star-core-inner" style={{ opacity: colorOpacity }} />
        </g>

        <g className="ps-star-particles" fill="#F27121" style={{ opacity: colorOpacity }}>
          <circle cx="16" cy="2" r="1.5" className="ps-particle p1" />
          <circle cx="30" cy="16" r="1.5" className="ps-particle p2" />
          <circle cx="16" cy="30" r="1.5" className="ps-particle p3" />
          <circle cx="2" cy="16" r="1.5" className="ps-particle p4" />
        </g>
      </svg>
    );
  }

  if (type === '120h') {
    const gradCore = `grad120-core-${uid}`;
    const gradGlow = `grad120-glow-${uid}`;

    return (
      <svg className={cn('ps-icon ps-icon-120h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={gradCore} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00F2FE" />
            <stop offset="100%" stopColor="#4FACFE" />
          </linearGradient>
          <radialGradient id={gradGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4FACFE" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="ps-sparks-base" fill="currentColor">
          <circle cx="16" cy="16" r="5" />
          <circle cx="24" cy="8" r="3" />
          <circle cx="8" cy="24" r="3" />
        </g>

        <g className="ps-sparks-color" style={{ opacity: colorOpacity, transition: 'opacity 0.5s' }}>
          <circle cx="16" cy="16" r="12" fill={`url(#${gradGlow})`} className="ps-spark-aura" />
          <circle className="ps-spark-core" cx="16" cy="16" r="5" fill={`url(#${gradCore})`} />

          <g className="ps-spark-orbit-1">
            <circle className="ps-spark-p" cx="24" cy="8" r="3" fill="#FFF" />
          </g>
          <g className="ps-spark-orbit-2">
            <circle className="ps-spark-p" cx="8" cy="24" r="3" fill="#00F2FE" />
          </g>
          <g className="ps-spark-orbit-3">
            <circle className="ps-spark-p" cx="26" cy="22" r="2" fill="#4FACFE" />
          </g>
          <g className="ps-spark-orbit-4">
            <circle className="ps-spark-p" cx="6" cy="10" r="2" fill="#FFF" />
          </g>
        </g>
      </svg>
    );
  }

  if (type === '96h') {
    const grad1 = `grad96-1-${uid}`;
    const grad2 = `grad96-2-${uid}`;

    return (
      <svg
        className={cn('ps-icon ps-icon-96h', stateClass)}
        viewBox="0 0 32 32"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={grad1} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#43E97B" />
            <stop offset="50%" stopColor="#38F9D7" />
            <stop offset="100%" stopColor="#43E97B" />
          </linearGradient>
          <linearGradient id={grad2} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#38F9D7" />
            <stop offset="100%" stopColor="#43E97B" />
          </linearGradient>
        </defs>

        <path className="ps-sine-base" d="M3 16c4-7 6-7 10 0s6 7 10 0 6-7 10 0" stroke="currentColor" strokeWidth="2" />

        <g style={{ opacity: colorOpacity, transition: 'opacity 0.5s' }}>
          <path className="ps-sine-color ps-sine-front" d="M-5 16c4-7 6-7 10 0s6 7 10 0 6-7 10 0 6 7 10 0" stroke={`url(#${grad1})`} />
          <path className="ps-sine-color ps-sine-back" d="M-5 16c4 7 6 7 10 0s6-7 10 0 6 7 10 0 6-7 10 0" stroke={`url(#${grad2})`} opacity="0.6" />

          <circle cx="16" cy="16" r="2" fill="#FFF" className="ps-neuro-node n1" />
          <circle cx="8" cy="16" r="1.5" fill="#38F9D7" className="ps-neuro-node n2" />
          <circle cx="24" cy="16" r="1.5" fill="#43E97B" className="ps-neuro-node n3" />
        </g>
      </svg>
    );
  }

  if (type === '72h') {
    const grad = `grad72-${uid}`;
    const glow = `glow72-${uid}`;

    return (
      <svg className={cn('ps-icon ps-icon-72h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF200" />
            <stop offset="50%" stopColor="#FDEB71" />
            <stop offset="100%" stopColor="#F8D800" />
          </linearGradient>
          <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="ps-lightning-base" d="M18 3L4 18h10l-2 11 14-16H16l2-10z" fill="currentColor" />

        <g style={{ opacity: colorOpacity, transition: 'opacity 0.4s' }}>
          <path className="ps-lightning-color" d="M18 3L4 18h10l-2 11 14-16H16l2-10z" fill={`url(#${grad})`} filter={`url(#${glow})`} />
          <path className="ps-lightning-spark s1" d="M8 12l-3 4" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path className="ps-lightning-spark s2" d="M26 18l3-4" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
          <path className="ps-lightning-spark s3" d="M14 26l2 4" stroke="#F8D800" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === '48h') {
    const gradBg = `grad48-bg-${uid}`;
    const gradGlare = `grad48-glare-${uid}`;

    return (
      <svg className={cn('ps-icon ps-icon-48h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={gradBg} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B224EF" />
            <stop offset="100%" stopColor="#7579FF" />
          </linearGradient>
          <linearGradient id={gradGlare} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        <path className="ps-shield-base" d="M16 3L5 7v8c0 7.3 5 14.2 11 16 6-1.8 11-8.7 11-16V7l-11-4z" fill="currentColor" />

        <g className="ps-shield-color-group" style={{ opacity: colorOpacity, transition: 'opacity 0.4s' }}>
          <path d="M16 3L5 7v8c0 7.3 5 14.2 11 16 6-1.8 11-8.7 11-16V7l-11-4z" fill={`url(#${gradBg})`} className="ps-shield-body" />
          <path d="M16 3L5 7v8c0 7.3 5 14.2 11 16 V3z" fill={`url(#${gradGlare})`} opacity="0.3" className="ps-shield-glare" />
          <path className="ps-shield-inner-v" d="M16 9v12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <path className="ps-shield-inner-h" d="M11 15h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="15" r="3" fill="#FFF" className="ps-shield-core" />
        </g>
      </svg>
    );
  }

  if (type === '36h') {
    const gradOuter = `grad36-outer-${uid}`;

    return (
      <svg className={cn('ps-icon ps-icon-36h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id={gradOuter} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF416C" />
            <stop offset="100%" stopColor="#FF4B2B" />
          </linearGradient>
        </defs>

        <path className="ps-flame-base" d="M16 3c0 0-7 8-7 14s4.5 11 7 11 7-4.5 7-11-7-14-7-14z" fill="currentColor" />

        <g className="ps-flame-color" style={{ opacity: colorOpacity, transition: 'opacity 0.4s' }}>
          <path d="M16 3c0 0-8 8.5-8 14.5s5 11.5 8 11.5 8-5.5 8-11.5S16 3 16 3z" fill={`url(#${gradOuter})`} className="ps-flame-outer" />
          <path className="ps-flame-inner" d="M16 13c0 0-3 3.5-3 6.5s2 4.5 3 4.5 3-1.5 3-4.5-3-6.5-3-6.5z" fill="#FFE100" />
          <circle cx="12" cy="10" r="1.5" fill="#FF416C" className="ps-ember e1" />
          <circle cx="20" cy="14" r="1" fill="#FFE100" className="ps-ember e2" />
          <circle cx="16" cy="6" r="1.5" fill="#FF4B2B" className="ps-ember e3" />
        </g>
      </svg>
    );
  }

  const gradFront = `grad24-front-${uid}`;
  const gradBack = `grad24-back-${uid}`;

  return (
    <svg className={cn('ps-icon ps-icon-24h', stateClass)} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id={gradFront} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#48C6EF" />
          <stop offset="100%" stopColor="#6F86D6" />
        </linearGradient>
        <linearGradient id={gradBack} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#4FACFE" />
        </linearGradient>
      </defs>

      <path className="ps-wave-base" d="M16 28c-6 0-11-5-11-11 0-6 11-15 11-15s11 9 11 15c0 6-5 11-11 11z" fill="currentColor" />

      <g className="ps-wave-color-group" style={{ opacity: colorOpacity, transition: 'opacity 0.4s' }}>
        <path d="M16 28c-6 0-11-5-11-11 0-6 11-15 11-15s11 9 11 15c0 6-5 11-11 11z" fill={`url(#${gradBack})`} className="ps-wave-bg" />
        <path d="M16 29c-5.5 0-10-4.5-10-10 0-5 8-13 10-13s10 8 10 13c0 5.5-4.5 10-10 10z" fill={`url(#${gradFront})`} className="ps-wave-fg" />
        <path className="ps-wave-inner" d="M16 24c-3.5 0-6.5-3-6.5-6.5 0-3.5 6.5-10.5 6.5-10.5s6.5 7 6.5 10.5c0 3.5-3 6.5-6.5 6.5z" fill="#fff" opacity="0.25" />
        <circle cx="13" cy="22" r="1.5" fill="#FFF" className="ps-bubble b1" />
        <circle cx="18" cy="18" r="1" fill="#FFF" className="ps-bubble b2" />
        <circle cx="15" cy="14" r="2" fill="#FFF" className="ps-bubble b3" />
      </g>
    </svg>
  );
};

export const ProtocolSelector = ({ onSelect, onClose, currentSchemeId }: Props) => {
  const [selectedId, setSelectedId] = useState(currentSchemeId ?? FASTING_SCHEMES[0]?.id ?? '24h');
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const selectedScheme = useMemo(
    () => FASTING_SCHEMES.find((scheme) => scheme.id === selectedId) ?? FASTING_SCHEMES[0],
    [selectedId]
  );

  useEffect(() => {
    setMounted(true);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelect(selectedId);
    handleClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn('ps-backdrop', isClosing && 'ps-closing')}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ps-dialog-title"
    >
      <div className="ps-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="ps-header">
          <h3 id="ps-dialog-title">Выбрать протокол</h3>
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
            const type = protocolTypeByHours(scheme.hours);

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
                <div className="ps-card-icon">
                  <ProtocolIcon type={type} active={isActive} />
                </div>

                <div className="ps-card-content">
                  <div className="ps-card-title">{scheme.title}</div>
                  <div className="ps-card-desc">{scheme.description}</div>
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
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-[color:var(--tg-border)] bg-[color:var(--tg-glass)] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[color:var(--tg-accent)]" aria-hidden="true" />
            <p className="truncate text-[12px] app-muted">
              Выбрано: <span className="font-semibold text-[color:var(--tg-text)]">{selectedScheme?.title}</span>
            </p>
          </div>

          <button className="ps-cta" onClick={handleConfirm} disabled={!selectedId} aria-disabled={!selectedId}>
            {selectedId ? 'Активировать протокол' : 'Выберите протокол'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
