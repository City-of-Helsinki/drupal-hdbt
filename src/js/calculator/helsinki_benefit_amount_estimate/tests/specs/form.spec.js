import { test, expect } from '@playwright/test';
// eslint-disable-next-line import/no-relative-packages
import translations from '../../_translations';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/src/js/calculator/helsinki_benefit_amount_estimate/helsinki-benefit-test.html');
});

test('On submit, unfilled fields give an error', async ({ page }) => {
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  
  expect(await page.getByLabel('Virheilmoitus').isVisible());
  expect(await page.getByRole('link', { name: translations.label_monthly_pay.fi }).isVisible());
  expect(await page.getByRole('link', { name: translations.label_company_type.fi }).isVisible());
  expect(await page.getByRole('link', { name: translations.label_pay_subsidy_granted.fi }).isVisible());
});

test('Monthly pay input must be positive and in range', async ({ page }) => {
  await page.getByLabel(translations.label_monthly_pay.fi).fill('10001');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 10000: ${translations.label_monthly_pay.fi}.`).isVisible()).toBeTruthy();
  
  await page.getByLabel(translations.label_monthly_pay.fi).fill('-1');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 10000: ${translations.label_monthly_pay.fi}.`).isVisible()).toBeTruthy();
  
  await page.getByLabel(translations.label_monthly_pay.fi).fill('10000');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 10000: ${translations.label_monthly_pay.fi}.`).isVisible()).toBeFalsy();;
});

test('Vacation money input must be positive and in range, or empty', async ({ page }) => {
  await page.getByLabel(translations.label_monthly_pay.fi).fill('2000');
  
  await page.getByLabel(translations.label_vacation_money.fi).fill('91');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 90: ${translations.label_vacation_money.fi}.`).isVisible()).toBeTruthy();
  
  await page.getByLabel(translations.label_vacation_money.fi).fill('-1');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 90: ${translations.label_vacation_money.fi}.`).isVisible()).toBeTruthy();
  
  await page.getByLabel(translations.label_vacation_money.fi).fill('90');
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 90: ${translations.label_vacation_money.fi}.`).isVisible()).toBeFalsy();
  
  await page.getByLabel(translations.label_vacation_money.fi).clear();
  await page.getByRole('button', { name: 'Laske arvio' }).click();
  expect (await page.getByText(`Arvon pitää olla väliltä 0 ja 90: ${translations.label_vacation_money.fi}.`).isVisible()).toBeFalsy();
});