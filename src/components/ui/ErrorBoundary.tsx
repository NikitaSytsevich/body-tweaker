import React from 'react';
import { captureError } from '../../utils/monitoring';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Unhandled error', error, info);
    captureError(error, { componentStack: info.componentStack });
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="app-surface min-h-screen w-full flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#2C2C2E] rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-white/10 text-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Что-то пошло не так</h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Приложение столкнулось с ошибкой и не может продолжить работу.
          </p>
          {this.state.message && (
            <div className="mt-4 text-xs font-mono text-slate-400 dark:text-slate-500 break-all">
              {this.state.message}
            </div>
          )}
          <button
            onClick={this.handleReload}
            className="mt-6 w-full py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
          >
            Перезапустить приложение
          </button>
        </div>
      </div>
    );
  }
}
