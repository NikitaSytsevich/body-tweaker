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
