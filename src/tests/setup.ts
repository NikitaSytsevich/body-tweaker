import { vi } from 'vitest';

vi.mock('@twa-dev/sdk', () => {
  const cloudStore = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  return {
    default: {
      CloudStorage: cloudStore,
      isVersionAtLeast: vi.fn(() => true),
    },
  };
});

const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
  clear: () => {
    store.clear();
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});
