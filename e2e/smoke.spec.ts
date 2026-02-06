import { test, expect, type Page } from '@playwright/test';
import { promises as fs } from 'node:fs';

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join('T');
};

const buildHistoryRecord = (overrides: Partial<{
  id: string;
  scheme: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
}> = {}) => {
  const endTime = overrides.endTime ?? new Date().toISOString();
  const startTime = overrides.startTime ?? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  return {
    id: overrides.id ?? 'e2e-record',
    type: 'fasting',
    scheme: overrides.scheme ?? '24ч: База аутофагии',
    startTime,
    endTime,
    durationSeconds: overrides.durationSeconds ?? 7200,
  };
};

const seedLegalAcceptance = async (page: Page) => {
  await page.addInitScript(() => {
    try {
      localStorage.setItem(
        'bt_app_legal_acceptance_v1',
        JSON.stringify({
          version: 1,
          acceptedAt: new Date().toISOString(),
          ageConfirmed: true,
          docs: [],
        })
      );
      localStorage.setItem('bt_app_has_accepted_terms', 'true');
    } catch {
      // ignore
    }
  });
};

const completeWelcome = async (page: Page) => {
  const startButton = page.getByRole('button', { name: 'Начать' });
  if (await startButton.isVisible({ timeout: 1500 }).catch(() => false)) {
    await startButton.click();
  }

  const acceptButton = page.getByRole('button', { name: 'Принять и продолжить' });
  if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    const checkbox = page.getByRole('checkbox');
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.check();
    await expect(acceptButton).toBeEnabled({ timeout: 5000 });
    await acceptButton.click();
  }
};

test.beforeEach(async ({ page }) => {
  await seedLegalAcceptance(page);
});

test('home renders and shows navigation', async ({ page }) => {
  await page.goto('/');
  await completeWelcome(page);
  await expect(page.getByText('Знания')).toBeVisible();
  await expect(page.getByText('Таймер')).toBeVisible();
  await expect(page.getByText('Дыхание')).toBeVisible();
  await expect(page.getByText('Биоритмы')).toBeVisible();
  await expect(page.getByText('История')).toBeVisible();
});

test('timer page loads', async ({ page }) => {
  await page.goto('/timer');
  await completeWelcome(page);
  await expect(page.getByText('Знания')).toBeVisible();
  await expect(page.getByText(/Голодание|Ожидание/)).toBeVisible();
});

test('breathing page loads', async ({ page }) => {
  await page.goto('/breathing');
  await completeWelcome(page);
  await expect(page.getByText('Знания')).toBeVisible();
  await expect(page.getByText('Пранаяма')).toBeVisible();
});

test('fasting protocol can start and stop', async ({ page }) => {
  await page.goto('/timer');
  await completeWelcome(page);
  await expect(page.getByText(/Ожидание|Голодание/)).toBeVisible();

  const chooseProtocolButton = page.getByRole('button', { name: 'Выбрать протокол' });
  await chooseProtocolButton.click();

  await page.getByText('База аутофагии').click();
  await page.getByRole('button', { name: 'Начать голодание' }).click();

  const stayHereButton = page.getByRole('button', { name: 'Остаться здесь' });
  if (await stayHereButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await stayHereButton.click();
  }

  await expect(page.getByText('Голодание')).toBeVisible();
  const stopButton = page.getByRole('button', { name: 'Завершить цикл' });
  await stopButton.click();
  await expect(page.getByText('Ожидание')).toBeVisible();
});

test('history shows empty state without records', async ({ page }) => {
  await page.goto('/history');
  await completeWelcome(page);
  await expect(page.getByText('Прогресс')).toBeVisible();
  await expect(page.getByText('Нет активности')).toBeVisible();
});

test('biorhythm page updates birth date', async ({ page }) => {
  await page.goto('/biorhythm');
  await completeWelcome(page);
  await expect(page.getByText('Энергетические волны')).toBeVisible();

  const birthDateInput = page.locator('input[type="date"]');
  await birthDateInput.fill('1990-01-01');
  await expect(birthDateInput).toHaveValue('1990-01-01');
});

test('profile settings navigation opens data screen', async ({ page }) => {
  await page.goto('/');
  await completeWelcome(page);
  await page.getByRole('button', { name: 'Открыть профиль' }).click();
  await expect(page.getByText('Настройки')).toBeVisible();
  await page.getByText('Резервные копии').click();
  await expect(page.getByText('Резервная копия')).toBeVisible();
});

test('history shows record after fasting session', async ({ page }) => {
  await page.goto('/timer');
  await completeWelcome(page);

  await page.getByRole('button', { name: 'Выбрать протокол' }).click();
  await page.getByText('База аутофагии').click();
  await page.getByRole('button', { name: 'Начать голодание' }).click();

  const stayHereButton = page.getByRole('button', { name: 'Остаться здесь' });
  if (await stayHereButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await stayHereButton.click();
  }

  const pastLocal = formatLocalDateTime(new Date(Date.now() - 2 * 60 * 60 * 1000));
  const startInput = page.locator('input[type="datetime-local"]').first();
  await startInput.fill(pastLocal);
  await page.waitForTimeout(200);

  await page.getByRole('button', { name: 'Завершить цикл' }).click();
  await expect(page.getByText('Ожидание')).toBeVisible();

  await page.goto('/history');
  await completeWelcome(page);
  await expect(page.getByText('Прогресс')).toBeVisible();
  await expect(page.getByText('База аутофагии')).toBeVisible();
});

test('backup import restores history record', async ({ page }, testInfo) => {
  const record = buildHistoryRecord({ id: 'e2e-import' });
  const backup = {
    version: 1,
    date: new Date().toISOString(),
    data: {
      history_fasting: [record],
      has_accepted_terms: 'true',
      legal_acceptance_v1: {
        version: 1,
        acceptedAt: new Date().toISOString(),
        ageConfirmed: true,
        docs: [],
      },
    },
  };

  const filePath = testInfo.outputPath('backup-import.json');
  await fs.writeFile(filePath, JSON.stringify(backup, null, 2), 'utf-8');

  await page.goto('/profile/settings/data');
  await completeWelcome(page);
  const fileInput = page.locator('input[type="file"]');
  const navigation = page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => null);
  await fileInput.setInputFiles(filePath);
  await navigation;

  await page.goto('/history');
  await completeWelcome(page);
  await expect(page.getByText('Прогресс')).toBeVisible();
  await expect(page.getByText('База аутофагии')).toBeVisible();
});

test('backup export downloads json', async ({ page }) => {
  const record = buildHistoryRecord({ id: 'e2e-export' });

  await page.goto('/profile/settings/data');
  await completeWelcome(page);

  await page.evaluate((payload) => {
    const meta = {
      chunks: 1,
      total: 1,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('bt_app_history_fasting__meta', JSON.stringify(meta));
    localStorage.setItem('bt_app_history_fasting_0', JSON.stringify([payload]));
  }, record);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Экспорт' }).click(),
  ]);

  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  const content = await fs.readFile(downloadedPath!, 'utf-8');
  const parsed = JSON.parse(content);
  expect(parsed?.data?.history_fasting?.[0]?.id).toBe('e2e-export');
});
