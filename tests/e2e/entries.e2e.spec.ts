import { expect, test } from '@playwright/test';

test('genera un CNT correctamente', async ({ page }) => {
  await page.goto('/ingresos');

  await page
    .getByRole('button', {
      name: 'Generar CNT',
    })
    .click();

  await expect(page.getByText('CNT generado correctamente')).toBeVisible();

  await expect(page.locator('h2')).toHaveText(/CNT-\d{6}/);

  await expect(page.getByText(/PUE\d{6}/)).toBeVisible();

  // Cerramos el modal antes de terminar el test
  await page
    .getByRole('button', {
      name: 'Cerrar',
    })
    .click();

  await expect(page.getByText('CNT generado correctamente')).not.toBeVisible();
});
