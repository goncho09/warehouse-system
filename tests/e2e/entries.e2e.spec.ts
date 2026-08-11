import { expect, test } from '@playwright/test';

test('genera un CNT correctamente', async ({ page }) => {
  await page.goto('/ingresos');

  await page
    .getByRole('button', {
      name: 'Generar CNT',
    })
    .click();

  await expect(page.getByText('CNT generado correctamente')).toBeVisible();

  const cntCode = page.locator('h2');

  await expect(cntCode).toHaveText(/CNT-\d{6}/);

  const locationText = page.getByText(/PUE\d{6}/);

  await expect(locationText).toBeVisible();

  await expect(page.getByText('En puerta')).toBeVisible();
});
