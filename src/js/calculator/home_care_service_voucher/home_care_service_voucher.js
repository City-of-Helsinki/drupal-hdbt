import form from './_form';
import translations from './_translations';
import calculateClientFee from '../home_care_client_fee/home_care_client_fee';

class HomeCareServiceVoucher {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);
    const homeCareClientFeeSettings = JSON.parse(drupalSettings.home_care_client_fee);

    // Expecting settings to follow this JSON format:
    /*
    const parsedSettings = {
      increase_percentage: 20,
      voucher_limits: {
        min: 8.4,
        old_max: 34,
        max: 40.8,
      },
      household_size: {
        '1': {
          percent: 35,
        },
        '2': {
          percent: 22,
        },
        '3': {
          percent: 18,
        },
        '4': {
          percent: 15,
        },
        '5': {
          percent: 13,
        },
        '6': {
          percent: 11,
        },
      },
      household_size_beyond_defined_multiplier_percent: -1,
      voucher_divisor: 60,
    };
    // */
    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);

    const update = () => {};

    function getLimits(householdSize, voucherSettings, feeSettings, calculator) {

      // gross income limit is calculated using home_care_client_fee settings
      // Currently we have values up until 6 person household sizes, this way it's configurable.
      const feeHousehold = calculator.getMinimumRange(householdSize, feeSettings.household_size);

      // Calculate limit for households bigger than in reference tables
      let feeMultipliedLimit = 0; // By default the extra limit is 0
      const feeMaxDefinedLimitNum = Number(Object.keys(feeSettings.household_size).at(-1));
      const feeDiff = householdSize - feeMaxDefinedLimitNum;
      if (feeDiff > 0) {
        feeMultipliedLimit = feeDiff * feeSettings.household_size_beyond_defined_multiplier_euro;
      }


      // percent limit is calculated using voucher settings
      // Currently we have values up until 6 person household sizes, this way it's configurable.
      const voucherHousehold = calculator.getMinimumRange(householdSize, voucherSettings.household_size);

      // Calculate limit for households bigger than in reference tables
      let voucherMultipliedLimit = 0; // By default the extra limit is 0
      const voucherMaxDefinedLimitNum = Number(Object.keys(voucherSettings.household_size).at(-1));
      const voucherDiff = householdSize - voucherMaxDefinedLimitNum;
      if (voucherDiff > 0) {
        voucherMultipliedLimit = voucherDiff * voucherSettings.household_size_beyond_defined_multiplier_percent;
      }

      return {
        limit: feeHousehold.gross_income_limit + feeMultipliedLimit,
        percent: voucherHousehold.percent + voucherMultipliedLimit,
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
      // 4. Calculate how much city will pay with vouchers per month
      // 5. Calculate voucher self payment (omavastuu) part (min 0)
      // 6. Get maximum payment value from table if bought without voucher
      // 7. Calculate what the payment would be as service bought from city instead of private company with voucher

      // 1. Get limits based on household size
      const {
        limit,
        percent,
      } = getLimits(householdSize, parsedSettings, homeCareClientFeeSettings, this.calculator);

      const deductedIncome = grossIncomePerMonth - limit;

      // 3. [Excel B20] Calculate voucher value and clamp it between min and max, then round it to two decimals (cents) as rounded value is used in further math.
      const voucher = Math.round(
        (
          // If gross income has been given, calculate the value, otherwise use minimum voucher value
          (grossIncomePerMonthRaw !== null) ?
            this.calculator.clamp(
              parsedSettings.voucher_limits.min,
              (parsedSettings.voucher_limits.old_max - (deductedIncome * (percent / 100) / parsedSettings.voucher_divisor)) * ((100 + parsedSettings.increase_percentage) / 100),
              parsedSettings.voucher_limits.max
            ) :
            parsedSettings.voucher_limits.min
        ) * 100) / 100;

      // 4. [Excel B22] Calculate how much city will pay with vouchers per month
      const paymentByCity = monthlyUsage * voucher;

      // 5. [Excel B23] Calculate voucher self payment (omavastuu) part (min 0)
      const totalPaymentToProviderByClient = Math.max(0, serviceProviderPrice - voucher) * monthlyUsage;

      // Steps 6 and 7 are handled by city home care payment calculator
      const cityHomeCarePayment = calculateClientFee(
        householdSize,
        grossIncomePerMonth,
        grossIncomePerMonthRaw,
        monthlyUsage,
        this.calculator,
        homeCareClientFeeSettings,
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
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(paymentByCity) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(paymentByCity) }),
        },
        {
          title: this.t('receipt_voucher_value'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_hour', { value: this.calculator.formatFinnishEuroCents(voucher) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_hour_screenreader', { value: this.calculator.formatEuroCents(voucher) }),
        },
      );

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
