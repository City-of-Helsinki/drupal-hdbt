import form from './_form';
import translations from './_translations';

class FamiliesHomeServicesClientFee {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    const parsedSettings = {
      income_limit: {
        '1': 598,
        '2': 1103,
        '3': 1731,
        '4': 2140,
        '5': 2591,
        '6': 2976,
      },
      monthly_usage: {
        0: {
          max: 119.66,
          percent: 1,
        },
        5: {
          max: 538.47,
          percent: 2,
        },
        9: {
          max: 1017.12,
          percent: 3,
        },
        13: {
          max: 1495.76,
          percent: 4,
        },
        17: {
          max: 1974.4,
          percent: 5,
        },
        21: {
          max: 2453.05,
          percent: 6,
        },
        25: {
          max: 2931.69,
          percent: 7,
        },
        29: {
          max: 3410.33,
          percent: 8,
        },
        33: {
          max: 3888.98,
          percent: 9,
        },
        37: {
          max: 4367.62,
          percent: 10,
        },
        41: {
          max: 4906.1,
          percent: 11,
        },
      },
    };
    // */
    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);

    // const update = () => {};

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));

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
      // Get field values for calculating.
      const householdSize = Number(this.calculator.getFieldValue('household_size'));
      const grossIncomePerMonth = Number(this.calculator.getFieldValue('gross_income_per_month'));
      const grossIncomePerMonthRaw = this.calculator.getFieldValue('gross_income_per_month');
      const monthlyUsage = Number(this.calculator.getFieldValue('monthly_usage'));


      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results
      // 1. Get income limit
      // 2. Get max payment and payment percent
      // 3. Assume that user has not given income details, use max value
      // 4. If user has given income details, calculate based on that
      // 5. Clamp payment between 0 and max payment, round to even eurocents

      // 1. Get income limit
      const incomeLimit = parsedSettings.income_limit[householdSize];

      // 2. Get max payment and payment percent
      const { max, percent } = this.calculator.getMinimumRange(monthlyUsage, parsedSettings.monthly_usage);

      // 3. Assume that user has not given income details, use max value
      let payment = max;

      // 4. If user has given income details, calculate based on that
      if (grossIncomePerMonthRaw !== null) {
        payment = (grossIncomePerMonth - incomeLimit) * (percent / 100);
      }

      // 5. Clamp payment between 0 and max payment, round to even eurocents
      payment = this.calculator.clamp(0, Math.round(payment * 100)/100, max);

      // console.log(
      //   '\n householdSize', householdSize,
      //   '\n grossIncomePerMonth', grossIncomePerMonth,
      //   '\n grossIncomePerMonthRaw', grossIncomePerMonthRaw,
      //   '\n monthlyUsage', monthlyUsage,
      //   '\n',
      //   '\n incomeLimit', incomeLimit,
      //   '\n max', max,
      //   '\n percent', percent,
      //   '\n payment', payment,
      // );

      // Create receipt
      const receiptData = {
        id: this.id,
        title: this.t('receipt_estimate_of_payment'),
        total_prefix: this.t('receipt_estimated_payment_prefix'),
        total_value: this.calculator.formatFinnishEuroCents(payment),
        total_suffix: this.t('receipt_estimated_payment_suffix'),
        total_explanation: this.t('receipt_estimated_payment_explanation'),
        hr: true,
        breakdown: {
          title: null,
          subtotals: null,
          additional_details: {
            title: this.t('receipt_additional_details'),
            text: this.t('receipt_additional_detail'),
          },
        },
      };

      const receipt = this.calculator.getPartialRender(
        '{{>receipt}}',
        receiptData,
      );

      return {
        receipt,
        ariaLive: this.t('receipt_aria_live', { payment }),
      };
    };

    const eventHandlers = {
      submit: (event) => {
        this.calculator.clearResult();
        event.preventDefault();
        const result = validate();
        this.calculator.renderResult(result);
      },
      // keydown: () => {
      //   update();
      // },
      // change: () => {
      //   update();
      // },
      reset: () => {
        // window.setTimeout(update, 1);
        this.calculator.clearResult();
        this.calculator.showAriaLiveText(this.t('reset_aria_live'));
      },
    };

    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'families_home_services_client_fee', translations });

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
window.helfi_calculator.families_home_services_client_fee = (id, settings) => new FamiliesHomeServicesClientFee(id, settings);
