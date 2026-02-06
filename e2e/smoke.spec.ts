import { test, expect, type Page } from '@playwright/test';

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
