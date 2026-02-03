import { useState } from 'react';
import { OPERATOR_EMAIL, OPERATOR_NAME } from '../../app/legal/legalDocs';

interface OperatorContactCardProps {
  variant?: 'light' | 'onboarding';
  className?: string;
}

export const OperatorContactCard = ({ variant = 'light', className = '' }: OperatorContactCardProps) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'ok' | 'fail'>('idle');

  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(OPERATOR_EMAIL);
      } else {
        const input = document.createElement('textarea');
        input.value = OPERATOR_EMAIL;
        input.setAttribute('readonly', 'true');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopyStatus('ok');
      window.setTimeout(() => setCopyStatus('idle'), 1600);
    } catch {
      setCopyStatus('fail');
      window.setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const isOnboarding = variant === 'onboarding';

  return (
    <div
      className={`${
        isOnboarding
          ? 'pt-4 border-t border-slate-100/60 dark:border-white/10'
          : 'bg-white dark:bg-[#2C2C2E] p-5 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5'
      } ${className}`}
    >
      <p className={`text-xs font-bold uppercase tracking-widest ${
        isOnboarding ? 'mb-3 text-slate-400 dark:text-slate-500' : 'mb-2 text-slate-400 dark:text-slate-500'
      }`}>
        Контакты оператора
      </p>
      {!isOnboarding && (
        <>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{OPERATOR_NAME}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{OPERATOR_EMAIL}</p>
        </>
      )}
      <div className={`grid grid-cols-2 gap-3 ${isOnboarding ? '' : 'mt-4'}`}>
        <button
          onClick={handleCopyEmail}
          className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform ${
            isOnboarding
              ? 'bg-slate-900 text-white shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:shadow-white/10'
              : 'bg-slate-900 text-white shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:shadow-white/10'
          }`}
        >
          {copyStatus === 'ok' ? 'Email скопирован' : copyStatus === 'fail' ? 'Не удалось' : 'Скопировать email'}
        </button>
        <a
          href={`mailto:${OPERATOR_EMAIL}`}
          className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center border shadow-sm active:scale-95 transition-transform ${
            isOnboarding
              ? 'bg-white text-slate-700 border-slate-100 dark:bg-[#2C2C2E] dark:text-slate-200 dark:border-white/10'
              : 'bg-white text-slate-700 border-slate-100 dark:bg-[#2C2C2E] dark:text-slate-200 dark:border-white/10'
          }`}
        >
          Написать оператору
        </a>
      </div>
    </div>
  );
};
