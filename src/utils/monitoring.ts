let initPromise: Promise<void> | null = null;

export const initMonitoring = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  if (initPromise) return;

  initPromise = import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn,
    });
  }).catch((error) => {
    console.warn('[Monitoring] Failed to initialize', error);
  });
};

export const captureError = (error: unknown, context?: Record<string, unknown>) => {
  if (!initPromise) return;
  void initPromise.then(() =>
    import('@sentry/react').then((Sentry) => {
      Sentry.captureException(error, {
        extra: context,
      });
    })
  );
};
