import { test, expect } from '@playwright/test';
// eslint-disable-next-line import/no-relative-packages
import translations from '../../_translations';

// eslint-disable-next-line no-template-curly-in-string
const replaceValue = '${value}';
const PAY_SUBSIDY_PERCENTAGES = ['50', '70'];

const fillVacationMoney = (page, value) =>
  test.step('Fill vacation money', async () => {
    await page.getByLabel(translations.label_vacation_money.fi).fill(String(value));
  });

const fillMonthlyPay = (page, value) =>
  test.step('Fill monthly pay', async () => {
    await page.getByLabel(translations.label_monthly_pay.fi).fill(String(value));
  });

const selectPaySubsidyGranted = (page) =>
  test.step('Select pay subsidy granted', async () => {
    await page.getByText(translations.label_pay_subsidy_true.fi, { exact: true }).click();
  });

const selectPaySubsidyNotGranted = (page) =>
  test.step('Select pay subsidy not granted', async () => {
    await page.getByText(translations.label_pay_subsidy_false.fi, { exact: true }).click();
  });

const selectPaySubsidyPercentageOption1 = (page) =>
  test.step('Select pay subsidy percentage #1', async () => {
    await page
      .getByText(
        translations.label_pay_subsidy_percentage_1.fi.replace(replaceValue, PAY_SUBSIDY_PERCENTAGES.at(0), {
          exact: true,
        }),
      )
      .click();
  });

const selectPaySubsidyPercentageOption2 = (page) =>
  test.step('Select pay subsidy percentage #2', async () => {
    await page
      .getByText(
        translations.label_pay_subsidy_percentage_2.fi.replace(replaceValue, PAY_SUBSIDY_PERCENTAGES.at(1), {
          exact: true,
        }),
      )
      .click();
  });

const selectCompanyTypeBusiness = (page) =>
  test.step('Select business', async () => {
    await page.getByText(translations.label_company_type_business.fi, { exact: true }).click({ force: true });
  });

const selectCompanyTypeAssociation = (page) =>
  test.step('Select association', async () => {
    await page.getByText(translations.label_company_type_association.fi, { exact: true }).click({ force: true });
  });

const checkAssociationHasBusinessActivities = (page) =>
  test.step('Check association has business activities', async () => {
    await page.getByText(translations.label_association_has_business_activities.fi).isVisible();
    await page.getByText(translations.label_association_has_business_activities.fi, { exact: true }).click();
  });

const clickResultsButton = (page) =>
  test.step('Click results button', async () => {
    await page.getByRole('button', { name: 'Laske arvio' }).click({ force: true });
  });

const resultSelector = '.helfi-calculator__receipt-total__value';
const expectResult = (page, result) =>
  test.step('Click results button', async () => {
    expect(await page.locator(resultSelector).textContent()).toBe(result);
  });

export {
  selectPaySubsidyPercentageOption1,
  selectPaySubsidyPercentageOption2,
  fillVacationMoney,
  fillMonthlyPay,
  selectCompanyTypeBusiness,
  selectCompanyTypeAssociation,
  checkAssociationHasBusinessActivities,
  selectPaySubsidyGranted,
  selectPaySubsidyNotGranted,
  clickResultsButton,
  expectResult,
};
