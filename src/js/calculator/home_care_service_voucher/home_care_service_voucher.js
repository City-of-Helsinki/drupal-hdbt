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
      household_percent_hour_slots: [ 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38 ],
      household_size: {
        1: {
          limit: 598,
          percent: [ 8, 10, 12, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5, 33, 33.5, 34, 34.5, 35 ],
        },
        2: {
          limit: 1103,
          percent: [ 7, 8.75, 10.5, 12.25, 14, 14.75, 15.5, 16.25, 17, 17.75, 18.5, 19.25, 20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ],
        },
        3: {
          limit: 1731,
          percent: [ 6, 7.5, 9, 10.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19 ],
        },
        4: {
          limit: 2140,
          percent: [ 6, 7.5, 9, 10.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16 ],
        },
        5: {
          limit: 2591,
          percent: [ 6, 7.5, 9, 10.5, 12, 12.5, 13, 13.5, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14 ],
        },
        6: {
          limit: 2976,
          percent: [ 6, 7.5, 9, 10.5, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12 ],
        }
      },
      beyond_cutoff: {
        cutoff: 6,
        limit: {
          multiply_n: 356,
          add: 2976,
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
      const { cutoff, limit } = incomeSettings.beyond_cutoff;
      const n = householdSize - cutoff;
      // Get limits at cutoff point, so that they can be scaled down on n+1 values
      const cutoffLimits = getLimits(cutoff, incomeSettings);
      return {
        limit: limit.multiply_n * n + limit.add,
        percent: cutoffLimits.percent,
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
      // 2. Calculate voucher value based on income and limits
      // 3. Calculate how much city will pay with vouchers (cap it to covered hours) per month
      // 4. Calculate how much client should pay for hours not covered by vouchers per month
      // 5. Calculate voucher self payment (omavastuu) part (min 0) and add result from previous step

      // 1. Get limits based on household size
      const {
        limit,
        percent: percentArray,
      } = getLimits(householdSize, parsedSettings);

      // Convert percentArray range to object that monthlyUsage limit and corresponding percent
      const percentRange = {};
      parsedSettings.household_percent_hour_slots.forEach((slotName, i) => {
        percentRange[slotName] = percentArray[i];
      });
      // Get percent for given family size and monthly usage
      const percent = this.calculator.getMinimumRange(monthlyUsage, percentRange);

      // 2. [Excel B20] Calculate voucher value and clamp it between min and max, then round it to two decimals (cents) as rounded value is used in further math.
      const voucher = Math.round(
        (
          // If gross income has been given, calculate the value, otherwise use minimum voucher value
          (grossIncomePerMonthRaw !== null) ?
            this.calculator.clamp(
              parsedSettings.voucher_limits.min,
              parsedSettings.voucher_limits.max - ((grossIncomePerMonth - limit) * (percent / 100) / parsedSettings.voucher_divisor),
              parsedSettings.voucher_limits.max
            ) :
            parsedSettings.voucher_limits.min
        ) * 100) / 100;

      // 3. [Excel B22] Calculate how much city will pay with vouchers (cap it to covered hours) per month
      const paymentByCity = Math.min(monthlyUsage, parsedSettings.covered_hours_per_month) * voucher;

      // 4. [Excel B13] Calculate how much client should pay for hours not covered by vouchers per month
      const paymentForHoursNotCoveredByVoucher = Math.max(0, monthlyUsage - parsedSettings.covered_hours_per_month) * serviceProviderPrice;

      // 5. [Excel B23] Calculate voucher self payment (omavastuu) part (min 0) and add result from previous step
      const totalPaymentToProviderByClient = Math.max(0, serviceProviderPrice - voucher) * Math.min(monthlyUsage, parsedSettings.covered_hours_per_month) + paymentForHoursNotCoveredByVoucher;

      // 6. Calculate what the payment would be as service bought from city instead of private company with voucher using home_care_client_payment function
      const cityHomeCarePayment = calculatePayment(
        householdSize,
        grossIncomePerMonth,
        grossIncomePerMonthRaw,
        monthlyUsage,
        this.calculator,
        JSON.parse(drupalSettings.home_care_client_payment),
        false, // Debug
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
