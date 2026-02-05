import { beforeEach, describe, expect, it, vi } from 'vitest';
import WebApp from '@twa-dev/sdk';
import { storageGet, storageGetHistory, storageSaveHistory, storageSet, storageUpdateHistory } from './storage';
import type { HistoryRecord } from './types';

const cloud = (WebApp as unknown as { CloudStorage: any }).CloudStorage;

const makeRecord = (id: string): HistoryRecord => ({
  id,
  type: 'fasting',
  scheme: '24h',
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  durationSeconds: 120,
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  cloud.getItem.mockImplementation((key: string, cb: (err: Error | null, value?: string | null) => void) => cb(null, null));
  cloud.setItem.mockImplementation((key: string, value: string, cb: (err: Error | null, stored?: boolean) => void) => cb(null, true));
  cloud.removeItem.mockImplementation((key: string, cb: (err: Error | null, deleted?: boolean) => void) => cb(null, true));
});

it('falls back to local storage when cloud read fails', async () => {
  cloud.setItem.mockImplementation((key: string, value: string, cb: (err: Error | null, stored?: boolean) => void) => cb(new Error('fail'), false));
  await storageSet('fallback_key', 'value');

  cloud.getItem.mockImplementation((key: string, cb: (err: Error | null, value?: string | null) => void) => cb(new Error('fail'), null));
  const value = await storageGet('fallback_key');
  expect(value).toBe('value');
});

it('keeps all records on concurrent history updates', async () => {
  const rec1 = makeRecord('1');
  const rec2 = makeRecord('2');

  await Promise.all([
    storageUpdateHistory('history_fasting', rec1),
    storageUpdateHistory('history_fasting', rec2),
  ]);

  const list = await storageGetHistory<HistoryRecord>('history_fasting');
  const ids = list.map((r) => r.id);
  expect(ids).toEqual(expect.arrayContaining(['1', '2']));
});

it('filters invalid history records on save', async () => {
  const rec = makeRecord('valid');
  // @ts-expect-error testing invalid payload
  await storageSaveHistory('history_fasting', [{ foo: 'bar' }, rec]);
  const list = await storageGetHistory<HistoryRecord>('history_fasting');
  expect(list).toHaveLength(1);
  expect(list[0].id).toBe('valid');
});
