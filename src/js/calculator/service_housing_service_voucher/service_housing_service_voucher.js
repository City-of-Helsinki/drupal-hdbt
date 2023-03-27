import form from './_form';
import translations from './_translations';

class ServiceHousingServiceVoucher {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    const parsedSettings = {
      voucher_from_net_income: {
        '0': 3300,
        '900.01': 3200,
        '1000.01': 3100,
        '1100.01': 3000,
        '1200.01': 2900,
        '1300.01': 2800,
        '1400.01': 2700,
        '1500.01': 2600,
        '1600.01': 2500,
        '1700.01': 2400,
        '1800.01': 2300,
        '1900.01': 2200,
        '2000.01': 2100,
        '2100.01': 2000,
        '2200.01': 1900,
        '2300.01': 1800,
        '2400.01': 1700,
        '2500.01': 1600,
        '2600.01': 1500,
        '2700.01': 1400,
        '2800.01': 1300,
        '2900.01': 1200,
        '3000.01': 1100,
        '3100.01': 1000,
        '3200.01': 900,
        '3300.01': 800,
        '3400.01': 700,
        '3500.01': 600,
      },
    };
    // */
    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);

    const update = () => {
    };

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('net_income_per_month'));
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
      const netIncomePerMonth = Number(this.calculator.getFieldValue('net_income_per_month'));
      // const netIncomePerMonthRaw = this.calculator.getFieldValue('gross_income_per_month');
      const serviceProviderPrice = Number(this.calculator.getFieldValue('service_provider_price'));


      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results

      console.log('p', parsedSettings);

      const voucherValue = this.calculator.getMinimumRange(netIncomePerMonth, parsedSettings.voucher_from_net_income);
      const selfPayment = Math.max(0, serviceProviderPrice - voucherValue);

      console.log(
        '\n netIncomePerMonth', netIncomePerMonth,
        '\n serviceProviderPrice', serviceProviderPrice,
        '\n',
        '\n voucherValue', voucherValue,
        '\n selfPayment', selfPayment,
      );

      const subtotals = [];

      subtotals.push(
        {
          title: this.t('receipt_subtotal_full_price'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(serviceProviderPrice) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(serviceProviderPrice) }),
        },
        {
          title: this.t('receipt_subtotal_city_price'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(voucherValue) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(voucherValue) }),
        },
        {
          title: this.t('receipt_subtotal_self_price'),
          has_details: false,
          details: [],
          sum: this.t('receipt_subtotal_euros_per_month', { value: this.calculator.formatFinnishEuroCents(selfPayment) }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: this.calculator.formatEuroCents(selfPayment) }),
        },
      );

      const additionalDetails = null;

      const receiptData = {
        id: this.id,
        title: this.t('receipt_estimate_of_payment'),
        total_prefix: this.t('receipt_estimated_payment_prefix'),
        total_value: this.calculator.formatFinnishEuroCents(selfPayment),
        total_suffix: this.t('receipt_estimated_payment_suffix'),
        total_explanation: this.t('receipt_estimated_payment_explanation'),
        hr: true,
        breakdown: {
          title: this.t('receipt_estimate_is_based_on'),
          subtotals,
          additional_details: additionalDetails,
        },
      };

      const receipt = this.calculator.getPartialRender(
        '{{>receipt}}',
        receiptData,
      );

      return {
        receipt,
        ariaLive: this.t('receipt_aria_live', { payment: selfPayment }),
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
    this.calculator = window.HelfiCalculator({ name: 'home_care_client_payment', translations });

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
window.helfi_calculator.service_housing_service_voucher = (id, settings) => new ServiceHousingServiceVoucher(id, settings);
