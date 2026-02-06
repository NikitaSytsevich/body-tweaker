import { test, expect } from '@playwright/test';

test('home renders and shows navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Метаболизм')).toBeVisible();
  await expect(page.getByText('Таймер')).toBeVisible();
  await expect(page.getByText('Дыхание')).toBeVisible();
  await expect(page.getByText('История')).toBeVisible();
});

test('timer page loads', async ({ page }) => {
  await page.goto('/timer');
  await expect(page.getByText(/Голодание|Ожидание/)).toBeVisible();
});

test('breathing page loads', async ({ page }) => {
  await page.goto('/breathing');
  await expect(page.getByText('Пранаяма')).toBeVisible();
});
