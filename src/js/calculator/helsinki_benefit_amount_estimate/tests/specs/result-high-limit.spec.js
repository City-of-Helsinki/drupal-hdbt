import { test, expect } from '@playwright/test';
// eslint-disable-next-line import/no-relative-packages
import translations from '../../_translations';

// eslint-disable-next-line no-template-curly-in-string
const replaceValue = '${value}';
const resultSelector = '.helfi-calculator__receipt-total__value';
const PAY_SUBSIDY_PERCENTAGES = [
  '50', '70'];

const EXPECTED_RESULT = {
  BUSINESS_ACTIVITIES: {
    'NONE': '800,00',
    '50': '264,00',
    '70': '800,00',
  },
  ASSOCIATION: {
    'NONE': '800,00',
    '50': '800,00',
    '70': '800,00',
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3001/src/js/calculator/helsinki_benefit_amount_estimate/helsinki-benefit-test.html');
  await page.getByLabel(translations.label_monthly_pay.fi).fill('2000');
  await page.getByLabel(translations.label_vacation_money.fi).fill('88');
});

test('[Business] Fill in form and check correct calculations as business (high)', async ({ page }) => {
  await page.getByText(translations.label_company_type_business.fi, {exact: true}).click({force: true});

  // With no pay subsidy (assuming state aid is 100%)
  await page.getByText(translations.common_no.fi, {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES.NONE);

  // With pay subsidy at 50% (state aid is 50%)
  await page.getByText(translations.common_yes.fi, {exact: true}).click();
  await page.getByText(translations.label_pay_subsidy_percentage_1.fi.replace(replaceValue, PAY_SUBSIDY_PERCENTAGES[0]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES['50']);

  // With pay subsidy at 70% (state aid is 100%)
  await page.getByText(translations.label_pay_subsidy_percentage_2.fi.replace(replaceValue,  PAY_SUBSIDY_PERCENTAGES[1]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES['70']);
});

test('[Association: business] Fill in form and check correct calculations as association with business activities (high)', async ({ page }) => {
  await page.getByText(translations.label_company_type_association.fi, {exact: true}).click();
  await page.getByText(translations.label_association_has_business_activities.fi, {exact: true}).click();
  
  // With no pay subsidy (assuming state aid is 100%)
  await page.getByText(translations.common_no.fi, {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES.NONE);

  // With pay subsidy at 50% (state aid is 50%)
  await page.getByText(translations.common_yes.fi, {exact: true}).click();
  await page.getByText(translations.label_pay_subsidy_percentage_1.fi.replace(replaceValue,  PAY_SUBSIDY_PERCENTAGES[0]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES['50']);
  
  // With pay subsidy at 70% (state aid is 100%)
  await page.getByText(translations.label_pay_subsidy_percentage_2.fi.replace(replaceValue,  PAY_SUBSIDY_PERCENTAGES[1]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.BUSINESS_ACTIVITIES['70']);
});

test('[Association] Fill in form and check correct calculations as association (high)', async ({ page }) => {
  await page.getByText(translations.label_company_type_association.fi, {exact: true}).click();

  // With no pay subsidy (state aid is 100%)
  await page.getByText(translations.common_no.fi, {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.ASSOCIATION.NONE);
  
  // With pay subsidy at 50% (state aid is 50%)
  await page.getByText(translations.common_yes.fi, {exact: true}).click();
  await page.getByText(translations.label_pay_subsidy_percentage_1.fi.replace(replaceValue,  PAY_SUBSIDY_PERCENTAGES[0]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.ASSOCIATION['50']);
  
  // With pay subsidy at 70% (state aid is 100%)
  await page.getByText(translations.label_pay_subsidy_percentage_2.fi.replace(replaceValue,  PAY_SUBSIDY_PERCENTAGES[1]), {exact: true}).click();
  await page.getByRole('button', { name: 'Laske arvio' }).click({force: true});
  expect(await page.locator(resultSelector).textContent()).toBe(EXPECTED_RESULT.ASSOCIATION['70']);
});