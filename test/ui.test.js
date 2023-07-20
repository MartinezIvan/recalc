import { test, expect } from '@playwright/test';
import { seed } from '../src/seed.js';
import { Operation, History } from '../src/models.js'

test.describe('test', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async () => {
    await seed();
  })

  test('Deberia tener como titulo de pagina recalc', async ({ page }) => {
    await page.goto('./');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/recalc/i);
  });

  test('Deberia poder realizar una resta', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: '9' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/sub/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(70);

    await expect(page.getByTestId('display')).toHaveValue(/70/)

    const operation = await Operation.findOne({
      where: {
        name: "SUB"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(79)
    expect(historyEntry.secondArg).toEqual(9)
    expect(historyEntry.result).toEqual(70)
  });

  test('Deberia poder realizar una multiplicacion', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '1' }).click()
    await page.getByRole('button', { name: '9' }).click()
    await page.getByRole('button', { name: '*' }).click()
    await page.getByRole('button', { name: '2' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(38);

    await expect(page.getByTestId('display')).toHaveValue(/38/)

    const operation = await Operation.findOne({
      where: {
        name: "MUL"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(19)
    expect(historyEntry.secondArg).toEqual(2)
    expect(historyEntry.result).toEqual(38)
  });

  test('Deberia poder realizar una multiplicacion, si el primer valor es negativo y ambos distintos de 0 deberia devolver un resultado negativo', async ({ page }) => {
    await page.goto('./');

    let primerNumero = (Math.floor(Math.random() * 9) + 1).toString()
    let segundoNumero = (Math.floor(Math.random() * 9) + 1).toString()

    await page.getByRole('button', { name: '-' }).click()
    await page.getByRole('button', { name: primerNumero }).click()
    await page.getByRole('button', { name: '*' }).click()
    await page.getByRole('button', { name: segundoNumero }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/mul/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBeLessThan(0);

    await expect(page.getByTestId('display')).toHaveValue(/-[0-9]/)

    const operation = await Operation.findOne({
      where: {
        name: "MUL"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    var valorDePrimerNumero = -parseInt(primerNumero) 
    var valorDeSegundoNumero = parseInt(segundoNumero)

    expect(historyEntry.firstArg).toEqual(valorDePrimerNumero)
    expect(historyEntry.secondArg).toEqual(valorDeSegundoNumero)
    expect(historyEntry.result).toBeLessThan(0);
  });

  test('Deberia poder realizar una division', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '4' }).click()
    await page.getByRole('button', { name: '/' }).click()
    await page.getByRole('button', { name: '2' }).click()

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/v1/div/')),
      page.getByRole('button', { name: '=' }).click()
    ]);

    const { result } = await response.json();
    expect(result).toBe(2);

    await expect(page.getByTestId('display')).toHaveValue(/2/)

    const operation = await Operation.findOne({
      where: {
        name: "DIV"
      }
    });

    const historyEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(historyEntry.firstArg).toEqual(4)
    expect(historyEntry.secondArg).toEqual(2)
    expect(historyEntry.result).toEqual(2)
  });

  test('Debe mostrar un mensaje de error en la calculadora', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: '7' }).click()
    await page.getByRole('button', { name: '/' }).click()
    await page.getByRole('button', { name: '0' }).click()
    await page.getByRole('button', { name: '=' }).click()

    await page.waitForTimeout(500);
    const displayValue = await page.$eval('.display', (element) => element.value);
    expect(displayValue).toBe('Error');

    const operation = await Operation.findOne({
      where: {
        name: "DIV"
      }
    });

    const errorHistoryEntry = await History.findOne({
      where: { OperationId: operation.id }
    })

    expect(errorHistoryEntry.error).toEqual("No se puede dividir entre 0!")

  });

})