import { test } from '@playwright/test';
import {
  selectPaySubsidyPercentageOption1,
  selectPaySubsidyPercentageOption2,
  checkAssociationHasBusinessActivities,
  selectCompanyTypeBusiness,
  selectCompanyTypeAssociation,
  selectPaySubsidyGranted,
  selectPaySubsidyNotGranted,
  clickResultsButton,
  fillVacationMoney,
  fillMonthlyPay,
  expectResult,
} from '../fixtures/input';

const TEST_CASES = [
  {
    NAME: 'Low',
    MONTLY_PAY: '400',
    VACATION_MONEY: '16',
    BUSINESS_ACTIVITIES: {
      NONE: '252,00',
      50: '52,00',
      70: '224,00',
    },
    ASSOCIATION: {
      NONE: '504,00',
      50: '304,00',
      70: '224,00',
    },
  },
  {
    NAME: 'Medium',
    MONTLY_PAY: '1000',
    VACATION_MONEY: '42',
    BUSINESS_ACTIVITIES: {
      NONE: '631,00',
      50: '131,00',
      70: '562,00',
    },
    ASSOCIATION: {
      NONE: '800,00',
      50: '762,00',
      70: '562,00',
    },
  },
  {
    NAME: 'High',
    MONTLY_PAY: '2000',
    VACATION_MONEY: '88',
    BUSINESS_ACTIVITIES: {
      NONE: '800,00',
      50: '264,00',
      70: '800,00',
    },
    ASSOCIATION: {
      NONE: '800,00',
      50: '800,00',
      70: '800,00',
    },
  },
];

test.slow();
test.describe.configure({ mode: 'parallel' });
test.beforeEach(async ({ page }) => {
  await page.goto(
    'http://localhost:3001/src/js/calculator/helsinki_benefit_amount_estimate/helsinki-benefit-test.html',
  );
});


TEST_CASES.forEach((testCase) => {
  test.describe(testCase.NAME, () => {
    test.describe('Business', () => {
      test('Fill in form and check results (none)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeBusiness(page);
        await selectPaySubsidyNotGranted(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES.NONE);
      });

      test('Fill in form and check results (50)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeBusiness(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption1(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES['50']);
      });

      test('Fill in form and check results (70)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeBusiness(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption2(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES['70']);
      });
    });

    test.describe('Association: business', () => {
      test('Fill in form and check results (none)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await checkAssociationHasBusinessActivities(page);
        await selectPaySubsidyNotGranted(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES.NONE);
      });

      test('Fill in form and check results (50)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await checkAssociationHasBusinessActivities(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption1(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES['50']);
      });

      test('Fill in form and check results (70)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await checkAssociationHasBusinessActivities(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption2(page);
        await clickResultsButton(page);
        expectResult(page, testCase.BUSINESS_ACTIVITIES['70']);
      });
    });

    test.describe('Association', () => {
      test('Fill in form and check results (none)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await selectPaySubsidyNotGranted(page);
        await clickResultsButton(page);
        expectResult(page, testCase.ASSOCIATION.NONE);
      });

      test('[Association] Fill in form and check results (50)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption1(page);
        await clickResultsButton(page);
        expectResult(page, testCase.ASSOCIATION['50']);
      });

      test('[Association] Fill in form and check results (70)', async ({ page }) => {
        await fillMonthlyPay(page, testCase.MONTLY_PAY);
        await fillVacationMoney(page, testCase.VACATION_MONEY);
        await selectCompanyTypeAssociation(page);
        await selectPaySubsidyGranted(page);
        await selectPaySubsidyPercentageOption2(page);
        await clickResultsButton(page);
        expectResult(page, testCase.ASSOCIATION['70']);
      });
    });
  });
});
