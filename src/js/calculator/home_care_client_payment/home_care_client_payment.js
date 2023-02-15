import translations from './_translations';

class HomeCareClientPayment {
  constructor(id, settings) {
    this.id = id;

    // Expecting settings to follow this JSON format:
    /*
    {
      // TODO: Add settings here
    }
    */

    // Form content
    const getFormData = () => ({
        form_id: this.id,
        items: [
          {
            input_integer: {
              id: 'household_size',
              label: this.t('household_size'),
              unit: this.t('unit_person'),
              min: 1,
              size: 2,
              required: true,
              // helper_text: this.t('household_size_explanation'),
            },
          },
          {
            input_integer: {
              id: 'monthly_usage',
              label: this.t('monthly_usage'),
              unit: this.t('unit_hour'),
              min: '0',
              size: 8,
              required: true,
              helper_text: this.t('monthly_usage_explanation'),
            },
          },
          {
            input_float: {
              id: 'gross_income_per_month',
              label: this.t('gross_income_per_month'),
              unit: this.t('unit_euro'),
              min: '0',
              size: 8,
              // required: true, WHY IS THIS NOT REQUIRED BASED ON EXPLANATION?
              helper_text: this.t('gross_income_per_month_explanation'),
            },
          },
          {
            radio: {
              id: 'phone',
              label: this.t('phone'),
              required: true,
              radio_items: [
                {
                  name: 'radio-item-phone',
                  item_id: 'phone_no',
                  label: this.t('phone_no'),
                  value: '0',
                },
                {
                  name: 'radio-item-phone',
                  item_id: 'phone_yes',
                  label: this.t('phone_yes'),
                  value: '1',
                },
              ],
            },
          },
          {
            heading: {
              text: this.t('support_service_payments'),
              level: 3,
            }
          },
          {
            paragraph: {
              text: this.t('support_service_payments_not_income_based'),
            }
          },
          {
            input_integer: {
              id: 'sauna_no_travel',
              label: this.t('sauna_no_travel'),
              unit: this.t('unit_times_per_month'),
              min: '0',
              size: 3,
              required: true,
              helper_text: this.t('per_item_variable', { amount: this.t('per_item_unit_euro', { amount: this.settings.prices.sauna_no_travel }) }),
            },
          },
          {
            input_integer: {
              id: 'sauna_with_travel',
              label: this.t('sauna_with_travel'),
              unit: this.t('unit_times_per_month'),
              min: '0',
              size: 3,
              required: true,
              helper_text: this.t('per_item_variable', { amount: this.t('per_item_unit_euro', { amount: this.settings.prices.sauna_with_travel }) }),
            },
          },
          {
            input_integer: {
              id: 'shopping',
              label: this.t('shopping'),
              unit: this.t('unit_times_per_month'),
              min: '0',
              size: 3,
              required: true,
              helper_text: this.t('per_item_variable', { amount: this.t('per_item_unit_euro', { amount: this.settings.prices.shopping }) }),
            },
          },
          {
            radio: {
              id: 'foodservice',
              label: this.t('foodservice'),
              radio_items: [
                {
                  name: 'radio-item-foodservice',
                  item_id: 'foodservice_1',
                  label: this.t('foodservice_1'),
                  value: 1,
                },
                {
                  name: 'radio-item-foodservice',
                  item_id: 'foodservice_2',
                  label: this.t('foodservice_2'),
                  value: 2,
                },
                {
                  name: 'radio-item-foodservice',
                  item_id: 'foodservice_3',
                  label: this.t('foodservice_3'),
                  value: 3,
                },
                {
                  name: 'radio-item-foodservice',
                  item_id: 'foodservice_4',
                  label: this.t('foodservice_4'),
                  value: 4,
                },
              ],
            },
          },
          {
            group: {
              id: 'foodservice_group_1',
              hide_group: true,
              items: [
                {
                  radio: {
                    id: 'foodservice_group_1_delivery_fee',
                    label: this.t('foodservice_group_1_delivery_fee'),
                    required: true,
                    radio_items: [
                      {
                        name: 'foodservice_group_1_delivery_fee',
                        item_id: 'foodservice_group_1_delivery_fee_1',
                        label: 'Kylmien aterioiden kuljetus 4 krt / kk, á 7,21',
                        value: 1,
                      },
                      {
                        name: 'foodservice_group_1_delivery_fee',
                        item_id: 'foodservice_group_1_delivery_fee_2',
                        label: 'Kylmien aterioiden kuljetus 8 krt / kk, á 7,21',
                        value: 2,
                      },
                    ],
                  },
                },
                {
                  radio: {
                    id: 'foodservice_group_1_meal_price',
                    label: this.t('meal_price'),
                    required: true,
                    radio_items: [
                      {
                        name: 'foodservice_group_1_meal_price',
                        item_id: 'foodservice_group_1_meal_price_1',
                        label: this.t('per_item_unit_euro', { amount: this.settings.prices.foodservice_group_1_meal_price_1 }),
                        value: 1,
                      },
                      {
                        name: 'foodservice_group_1_meal_price',
                        item_id: 'foodservice_group_1_meal_price_2',
                        label: this.t('per_item_unit_euro', { amount: this.settings.prices.foodservice_group_1_meal_price_2 }),
                        value: 2,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'foodservice_group_1_meals',
                    label: this.t('meals'),
                    unit: this.t('unit_amount_per_month'),
                    required: true,
                    min: '0',
                    max: 60, // Max comes from specs
                    // helper_text: '',
                  },
                },
              ],
            },
          },
          {
            group: {
              id: 'foodservice_group_2',
              label: this.t('foodservice_group_2'),
              hide_group: true,
              items: [
                {
                  radio: {
                    id: 'foodservice_group_2_delivery_fee',
                    label: this.t('foodservice_group_2_delivery_fee'),
                    required: true,
                    radio_items: [
                      {
                        name: 'foodservice_group_2_delivery_fee',
                        item_id: 'foodservice_group_2_delivery_fee_1',
                        label: 'Kylmien aterioiden kuljetus 4 krt / kk, á 7,21',
                        value: 1,
                      },
                      {
                        name: 'foodservice_group_2_delivery_fee',
                        item_id: 'foodservice_group_2_delivery_fee_2',
                        label: 'Kylmien aterioiden kuljetus 8 krt / kk, á 7,21',
                        value: 2,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'foodservice_group_2_meals',
                    label: this.t('meals'),
                    unit: this.t('unit_amount_per_month'),
                    required: true,
                    min: '0',
                    max: 60, // Max comes from specs
                    helper_text: 'á 5,49 €',
                  },
                },
              ],
            },
          },
          {
            group: {
              id: 'foodservice_group_3',
              label: this.t('foodservice_group_3'),
              hide_group: true,
              items: [
                {
                  radio: {
                    id: 'foodservice_group_3_meal_price',
                    label: this.t('meal_price'),
                    required: true,
                    radio_items: [
                      {
                        name: 'foodservice_group_3_meal_price',
                        item_id: 'foodservice_group_3_meal_price_1',
                        label: 'Lounas 4,99 €',
                        value: 1,
                      },
                      {
                        name: 'foodservice_group_3_meal_price',
                        item_id: 'foodservice_group_3_meal_price_2',
                        label: 'Lounas 4,99 € + jälkiruoka 1,12 €',
                        value: 2,
                      },
                      {
                        name: 'foodservice_group_3_meal_price',
                        item_id: 'foodservice_group_3_meal_price_3',
                        label: 'Lounas 5,57 €',
                        value: 3,
                      },
                      {
                        name: 'foodservice_group_3_meal_price',
                        item_id: 'foodservice_group_3_meal_price_4',
                        label: 'Lounas 5,57 € + jälkiruoka 1,12 €',
                        value: 4,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'foodservice_group_3_usage',
                    label: this.t('foodservice_group_3_usage'),
                    min: '0',
                    max: 60, // Max comes from specs
                    required: true,
                    helper_text: 'á 2,35 €',
                  },
                },
                {
                  input_integer: {
                    id: 'foodservice_group_3_meals',
                    label: this.t('foodservice_group_3_meals'),
                    min: '0',
                    max: 60, // Max comes from specs
                    required: true,
                    // helper_text: '',
                  },
                },
              ],
            },
          },

        ]
      });

    const update = () => {
      const foodservice = this.calculator.getFieldValue('foodservice');

      switch (foodservice) {
      case '1':
        this.calculator.showGroup('foodservice_group_1');
        this.calculator.hideGroup('foodservice_group_2');
        this.calculator.hideGroup('foodservice_group_3');
        break;
      case '2':
        this.calculator.hideGroup('foodservice_group_1');
        this.calculator.showGroup('foodservice_group_2');
        this.calculator.hideGroup('foodservice_group_3');
        break;
      case '3':
        this.calculator.hideGroup('foodservice_group_1');
        this.calculator.hideGroup('foodservice_group_2');
        this.calculator.showGroup('foodservice_group_3');
        break;

      default:
        this.calculator.hideGroup('foodservice_group_1');
        this.calculator.hideGroup('foodservice_group_2');
        this.calculator.hideGroup('foodservice_group_3');
        break;
      }
    };

    const validate = () => {
      const errorMessages = [];

      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('phone'));
      errorMessages.push(...this.calculator.validateBasics('sauna_no_travel'));
      errorMessages.push(...this.calculator.validateBasics('sauna_with_travel'));
      errorMessages.push(...this.calculator.validateBasics('shopping'));
      errorMessages.push(...this.calculator.validateBasics('foodservice'));

      const foodservice = this.calculator.getFieldValue('foodservice');

      switch (foodservice) {
      case '1':
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_1_delivery_fee'));
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_1_meal_price'));
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_1_meals'));
        break;
      case '2':
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_2_delivery_fee'));
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_2_meals'));
        break;
      case '3':
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_3_meal_price'));
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_3_usage'));
        errorMessages.push(...this.calculator.validateBasics('foodservice_group_3_meals'));
        break;

      default:
        break;
      }

      // Check if any missing input errors were found
      if (errorMessages.length) {
        return { error: true, title: this.t('missing_input'), message: errorMessages };
      }
      const householdSize = this.calculator.getFieldValue('household_size');
      const monthlyUsage = this.calculator.getFieldValue('monthly_usage');
      const grossIncomePerMonth = this.calculator.getFieldValue('gross_income_per_month');
      const phone = this.calculator.getFieldValue('phone');
      const saunaNoTravel = this.calculator.getFieldValue('sauna_no_travel');
      const saunaWithTravel = this.calculator.getFieldValue('sauna_with_travel');
      const shopping = this.calculator.getFieldValue('shopping');

      const foodserviceGroup1 = {};
      const foodserviceGroup2 = {};
      const foodserviceGroup3 = {};

      // TODO: Add the algorithm
      switch (foodservice) {
      case '1':
        foodserviceGroup1.delivery_fee = this.calculator.getFieldValue('foodservice_group_1_delivery_fee');
        foodserviceGroup1.meal_price = this.calculator.getFieldValue('foodservice_group_1_meal_price');
        foodserviceGroup1.meals = this.calculator.getFieldValue('foodservice_group_1_meals');
        break;
      case '2':
        foodserviceGroup2.delivery_fee = this.calculator.getFieldValue('foodservice_group_2_delivery_fee');
        foodserviceGroup2.meals = this.calculator.getFieldValue('foodservice_group_2_meals');
        break;
      case '3':
        foodserviceGroup3.meal_price = this.calculator.getFieldValue('foodservice_group_3_meal_price');
        foodserviceGroup3.usage = this.calculator.getFieldValue('foodservice_group_3_usage');
        foodserviceGroup3.meals = this.calculator.getFieldValue('foodservice_group_3_meals');
        break;

      default:
        break;
      }

      // // Otherwise not applicable for voucher
      // return { alert: true, title: this.t('result'), message: this.t('alert_voucher_not_applicable') };
      return { alert: true, title: this.t('result'), message: 'Algorithm is missing!' };
    };

    const eventHandlers = {
      submit: (event) => {
        event.preventDefault();
        const result = validate(this.id);
        this.calculator.renderResult(result);
      },
      keydown: () => {
        update();
        this.calculator.clearResult();
      },
      change: () => {
        update();
        this.calculator.clearResult();
      },
      reset: () => {
        update();
        this.calculator.clearResult();
      },
    };

    this.calculator = window.HelfiCalculator({ name: 'home_care_client_payment', translations });

    // Create shortcut for translations
    this.t = (key, value) => this.calculator.translate(key, value);

    // Parse settings to js
    this.settings = this.calculator.parseSettings(settings);

    this.settings = {
      prices: {
        sauna_no_travel: '7,30',
        sauna_with_travel: '13,30',
        shopping: '3,02',
        foodservice_group_1_meal_price_1: '4,98',
        foodservice_group_1_meal_price_2: '5,49',
      }
    };

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
