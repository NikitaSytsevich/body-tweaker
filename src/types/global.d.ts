export {};

declare global {
  interface Window {
    __btUpdateSW?: (reload?: boolean) => Promise<void> | void;
  }
}
