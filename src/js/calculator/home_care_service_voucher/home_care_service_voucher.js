import form from './_form';
import translations from './_translations';
import calculatePayment from '../home_care_client_payment/home_care_client_payment';

class HomeCareServiceVoucher {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    const parsedSettings = {
      voucher_limits: {
        min: 7,
        max: 34
      },
      // limits updated from here: https://stm.fi/maksut-kotipalvelu-kotisairaanhoito
      household_size: {
        '1': {
          limit: 598,
          percent: 35,
        },
        '2': {
          limit: 1103,
          percent: 22,
        },
        '3': {
          limit: 1731,
          percent: 18,
        },
        '4': {
          limit: 2140,
          percent: 15,
        },
        '5': {
          limit: 2591,
          percent: 13,
        },
        '6': {
          limit: 2976,
          percent: 11,
        },
        '7': {
          limit: 3332,
          percent: 10,
        },
        '8': {
          limit: 3688,
          percent: 9,
        }
      },
      beyond_cutoff: {
        cutoff: 8,
        limit: {
          multiply_n: 356,
          add: 3688,
        },
        percent: {
          multiply_n: -1,
          add: 9,
        },
      },
      covered_hours_per_month: 40,
      voucher_divisor: 60, // TODO: From where does this value come from?
    };
    // */
    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);

    const update = () => {};

    function getLimits(householdSize, incomeSettings) {
      const foundLimit = incomeSettings.household_size[householdSize];
      if (foundLimit) {
        return foundLimit;
      }
      const { cutoff, limit, percent } = incomeSettings.beyond_cutoff;
      const paymentClassFromUsagePerMonth = incomeSettings.beyond_cutoff.payment_class_from_usage_per_month;
      const n = householdSize - cutoff;
      // Get limits at cutoff point, so that they can be scaled down on n+1 values
      const cutoffLimits = getLimits(cutoff, incomeSettings);
      return {
        limit: limit.multiply_n * n + limit.add,
        percent: percent.multiply_n * n + percent.add,
        payment_class_from_usage_per_month: Object.fromEntries(
          Object.entries(cutoffLimits.payment_class_from_usage_per_month).map(
            ([key, value]) => [
              key,
              Math.max(0, value + paymentClassFromUsagePerMonth.multiply_n * n + paymentClassFromUsagePerMonth.add),
            ]
          )
        ),
      };
    }

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));
      errorMessages.push(...this.calculator.validateBasics('service_provider_price'));

      // Check if any missing input errors were found
      if (errorMessages.length) {
        return {
          error: {
            title: this.t('missing_input'),
            message: errorMessages
          },
        };
      }

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Get fielf values for calculating.
      const householdSize = Number(this.calculator.getFieldValue('household_size'));
      const grossIncomePerMonth = Number(this.calculator.getFieldValue('gross_income_per_month'));
      const grossIncomePerMonthRaw = this.calculator.getFieldValue('gross_income_per_month');
      const monthlyUsage = Number(this.calculator.getFieldValue('monthly_usage'));
      const serviceProviderPrice = Number(this.calculator.getFieldValue('service_provider_price'));

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results
      // 1. Get limits for math from parsedSettings based on household size
      // 2. Calculate payment percentage for income that exeeds limit
      // 3. Calculate voucher value based on income and limits
      // 4. Calculate how much city will pay with vouchers (cap it to covered hours) per month
      // 5. Calculate how much client should pay for hours not covered by vouchers per month
      // 6. Calculate voucher self payment (omavastuu) part (min 0) and add result from previous step


      // 1. Get limits based on household size
      const {
        limit,
        percent,
        // payment_class_from_usage_per_month: paymentClassFromUsagePerMonth
      } = getLimits(householdSize, parsedSettings);

      // // 2. [Excel B15] Calculate payment percentage for income that exeeds lower limit
      // const paymentPercentageForIncomeExeedingLowerLimit = this.calculator.getMinimumRange(monthlyUsage, paymentClassFromUsagePerMonth);

      const deductedIncome = grossIncomePerMonth - limit;

      // 3. [Excel B20] Calculate voucher value and clamp it between min and max, then round it to two decimals (cents) as rounded value is used in further math.
      const voucher = Math.round(
        (
          // If gross income has been given, calculate the value, otherwise use minimum voucher value
          (grossIncomePerMonthRaw !== null) ?
            this.calculator.clamp(
              parsedSettings.voucher_limits.min,
              parsedSettings.voucher_limits.max - (deductedIncome * (percent / 100) / parsedSettings.voucher_divisor),
              parsedSettings.voucher_limits.max
            ) :
            parsedSettings.voucher_limits.min
        ) * 100) / 100;

      // 4. [Excel B22] Calculate how much city will pay with vouchers (cap it to covered hours) per month
      const paymentByCity = Math.min(monthlyUsage, parsedSettings.covered_hours_per_month) * voucher;

      // 5. [Excel B13] Calculate how much client should pay for hours not covered by vouchers per month
      const paymentForHoursNotCoveredByVoucher = Math.max(0, monthlyUsage - parsedSettings.covered_hours_per_month) * serviceProviderPrice;

      // 6. [Excel B23] Calculate voucher self payment (omavastuu) part (min 0) and add result from previous step
      const totalPaymentToProviderByClient = Math.max(0, serviceProviderPrice - voucher) * Math.min(monthlyUsage, parsedSettings.covered_hours_per_month) + paymentForHoursNotCoveredByVoucher;

      // 7. Calculate what the payment would be as service bought from city instead of private company with voucher using home_care_client_payment function
      const cityHomeCarePayment = calculatePayment(
        householdSize,
        grossIncomePerMonth,
        grossIncomePerMonthRaw,
        monthlyUsage,
        this.calculator,
        JSON.parse(drupalSettings.home_care_client_payment),
        true, // Debug
      );

      // console.log(
      //   'Entered:',
      //   '\n householdSize B5', householdSize,
      //   '\n grossIncomePerMonth B6', grossIncomePerMonth,
      //   '\n grossIncomePerMonthRaw B7', grossIncomePerMonthRaw,
      //   '\n monthlyUsage B8', monthlyUsage,
      //   '\n serviceProviderPrice B9', serviceProviderPrice,
      //   '\n\nCalculated:',
      //   '\n limit B11', limit,
      //   '\n percent B12', percent,
      //   '\n paymentForHoursNotCoveredByVoucher B13', paymentForHoursNotCoveredByVoucher,
      //   '\n voucher B20', voucher,
      //   '\n cityHomeCarePayment B21', cityHomeCarePayment,
      //   '\n paymentByCity B22', paymentByCity,
      //   '\n totalPaymentToProviderByClient B23', totalPaymentToProviderByClient,
      // );

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Show results on the receipt

      let totalExplanation = this.t('receipt_family_estimated_payment_explanation');
      const additionalDetails = [
        {
          title: this.t('receipt_additional_details'),
          text: null,
        }
      ];

      if (grossIncomePerMonthRaw === null) {
        totalExplanation = this.t('receipt_family_empty_income') + totalExplanation;
      }

      const subtotals = [];

      subtotals.push(
        {
          title: this.t('receipt_homecare_total'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(monthlyUsage * serviceProviderPrice) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(monthlyUsage * serviceProviderPrice) }),
        },
        {
          title: this.t('receipt_city_pays_to_provider'),
          has_details: true,
          details: [
            this.t('receipt_voucher_value', { voucher: this.calculator.formatFinnishEuroCents(voucher) }),
            this.t('receipt_city_pays_to_provider_max', { covered_hours: parsedSettings.covered_hours_per_month })
          ],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(paymentByCity) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(paymentByCity) }),
        },
        {
          title: this.t('receipt_client_self_payment'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(totalPaymentToProviderByClient) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(totalPaymentToProviderByClient) }),
        },
      );

      if (monthlyUsage > parsedSettings.covered_hours_per_month) {
        additionalDetails.push(
          {
            title: null,
            text: this.t('receipt_monthly_hours_are_over_covered_hours', {
              covered_hours: parsedSettings.covered_hours_per_month,
              overflow_hours: monthlyUsage - parsedSettings.covered_hours_per_month,
              overflow_euros: this.calculator.formatFinnishEuroCents(paymentForHoursNotCoveredByVoucher),
            }),
          }
        );
      }
      additionalDetails.push(
        {
          title: null,
          text: this.t('receipt_included_homecare'),
        }
      );

      const receiptData = {
        id: this.id,
        title: this.t('receipt_estimate_of_payment'),
        total_prefix: this.t('receipt_family_estimated_payment_prefix'),
        total_value: this.calculator.formatFinnishEuroCents(totalPaymentToProviderByClient),
        total_suffix: this.t('receipt_family_estimated_payment_suffix'),
        total_explanation: totalExplanation,
        hr: true,
        breakdown: [
          {
            title: this.t('receipt_estimate_is_based_on'),
            subtotals,
            additional_details: additionalDetails,
          },
          {
            title: this.t('receipt_estimate_if_done_by_city'),
            subtotals: [
              {
                title: this.t('receipt_when_done_by_city'),
                has_details: false,
                details: [],
                sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(cityHomeCarePayment) }),
                sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(cityHomeCarePayment) }),
              },
            ],
            additional_details: null,
          },
        ],
      };

      const receipt = this.calculator.getPartialRender(
        '{{>receipt}}',
        receiptData,
      );

      return {
        receipt,
        ariaLive: this.t('receipt_aria_live', { payment: this.calculator.formatEuroCents(totalPaymentToProviderByClient) }),
      };
    };

    const eventHandlers = {
      submit: (event) => {
        this.calculator.clearResult();
        event.preventDefault();
        const result = validate();
        this.calculator.renderResult(result);
      },
      keydown: () => {
        update();
        // this.calculator.clearResult();
      },
      change: () => {
        update();
        // this.calculator.clearResult();
        // validate();
      },
      reset: () => {
        window.setTimeout(update, 1);
        this.calculator.clearResult();
        this.calculator.showAriaLiveText(this.t('reset_aria_live'));
      },
    };

    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'home_care_service_voucher', translations });

    // Create shortcut for translations
    this.t = (key, value) => this.calculator.translate(key, value);

    // Parse settings to js
    this.settings = this.calculator.parseSettings(settings);

    // Initialize calculator
    this.calculator.init({
      id,
      formData: getFormData(),
      eventHandlers,
    });
  }
}

window.helfi_calculator = window.helfi_calculator || {};
window.helfi_calculator.home_care_service_voucher = (id, settings) => new HomeCareServiceVoucher(id, settings);
