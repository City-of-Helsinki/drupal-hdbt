import form from './_form';
import translations from './_translations';

class HomeCareClientPayment {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    {
    }
    */

    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);

    const update = () => {
      const shoppingService = this.calculator.getFieldValue('shopping_service');

      if (shoppingService === '1') {
        this.calculator.showGroup('shopping_service_group');
      } else {
        this.calculator.hideGroup('shopping_service_group');
      }

      const mealService = this.calculator.getFieldValue('meal_service');

      if (mealService === '1') {
        this.calculator.showGroup('meal_service_group');
      } else {
        this.calculator.hideGroup('meal_service_group');
      }
    };

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));
      errorMessages.push(...this.calculator.validateBasics('safetyphone'));

      errorMessages.push(...this.calculator.validateBasics('shopping_service'));
      const shoppingService = this.calculator.getFieldValue('gross_income_per_month');
      if (shoppingService === '1') {
        errorMessages.push(...this.calculator.validateBasics('shopping_service_per_week'));
      }

      errorMessages.push(...this.calculator.validateBasics('meal_service'));
      const mealService = this.calculator.getFieldValue('gross_income_per_month');
      if (mealService === '1') {
        errorMessages.push(...this.calculator.validateBasics('meal_service_per_week'));
      }

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
      const safetyphone = Number(this.calculator.getFieldValue('safetyphone'));
      // Shopping service is set earlier
      const shoppingServicePerWeek = Number(this.calculator.getFieldValue('shopping_service_per_week'));
      // Meal service is set earlier
      const mealServicePerWeek = Number(this.calculator.getFieldValue('meal_service_per_week'));


      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results

      // const receiptData = {
      //   id: this.id,
      //   title: this.t('receipt_estimate_of_payment'),
      //   total_prefix: this.t('receipt_family_estimated_payment_prefix'),
      //   total_value: sum,
      //   total_suffix: this.t('receipt_family_estimated_payment_suffix'),
      //   total_explanation: totalExplanation,
      //   hr: true,
      //   breakdown: {
      //     title: this.t('receipt_estimate_is_based_on'),
      //     subtotals,
      //     additional_details: additionalDetails,
      //   },
      // };

      // const receipt = this.calculator.getPartialRender(
      //   '{{>receipt}}',
      //   receiptData,
      // );

      // return {
      //   receipt,
      //   ariaLive: this.t('receipt_aria_live', { payment: sum }),
      // };
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
window.helfi_calculator.home_care_client_payment = (id, settings) => new HomeCareClientPayment(id, settings);
