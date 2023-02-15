import translations from './_translations';

class HouseCleaningServiceVoucher {
  constructor(id, settings) {
    this.id = id;

    // Expecting settings to follow this JSON format:
    /*
    {
      "household_size_1": {
        "first_level": {
          "value": 24,
          "max_allowed_income": 1138
        },
        "second_level": {
          "value": 21,
          "max_allowed_income": 1422
        }
      },
      "household_size_2": {
        "first_level": {
          "value": 24,
          "max_allowed_income": 1575
        },
        "second_level": {
          "value": 21,
          "max_allowed_income": 2107
        }
      }
    }
    */

    // Form content
    const getFormData = () => ({
        form_id: this.id,
        items: [
          {
            input_float: {
              id: 'gross_income_per_month',
              label: this.t('gross_income_per_month'),
              unit: this.t('unit_euro'),
              size: 8,
              // maxlength: 999,
              required: true,
            },
          },
          {
            radio: {
              id: 'household_size',
              label: this.t('household_size'),
              required: true,
              radio_items: [
                {
                  name: 'radio-item-koko',
                  item_id: 'radio-item-one',
                  label: this.t('one_person_household'),
                  value: 1,
                },
                {
                  name: 'radio-item-koko',
                  item_id: 'radio-item-two',
                  label: this.t('two_person_household'),
                  value: 2,
                },
              ],
            },
          },
        ]
      });

    const validate = () => {
      const defaultInfo = {
        title: 'Arvio kotihoidon asiakasmaksun avusta',
        message: 'Täytä kaikki pakolliset tiedot, ja paina "Laske arvio". Arvio mahdollisesta tuestasi tulee näkyviin tähän. Jos päivität laskurin sisältöä muista painaa "Laske arvio" uudelleen.',
      };
      const errorMessages = [];

      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('household_size'));

      // Check if any missing input errors were found
      if (errorMessages.length) {
        return {
          error: {
            title: this.t('missing_input'),
            message: errorMessages
          },
          info: defaultInfo,
        };
      }

      const householdSize = this.calculator.getFieldValue('household_size');
      const grossIncomePerMonth = this.calculator.getFieldValue('gross_income_per_month');

      // Get correct data values based on family size
      const familyData = this.settings[`household_size_${  householdSize}`];
      if (!familyData) {
        throw new Error(`household_size_${  householdSize  } missing from settings`);
      }

      // Check if first level is applicable
      if (grossIncomePerMonth <= familyData.first_level.max_allowed_income) {
        return {
          info: {
            title: this.t('result'),
            message: this.t('info_voucher_value', { voucher_value: familyData.first_level.value }),
          },
        };

        // Check if second level is applicable
      }
      if (grossIncomePerMonth <= familyData.second_level.max_allowed_income) {
        return {
          info: {
            title: this.t('result'),
            message: this.t('info_voucher_value', { voucher_value: familyData.second_level.value }),
          },
        };
      }

      // Otherwise not applicable for voucher
      return {
        alert: {
          title: this.t('result'),
          message: this.t('alert_voucher_not_applicable'),
        },
        info: defaultInfo,
      };
    };

    const eventHandlers = {
      submit:  (event) => {
        event.preventDefault();
        const result = validate(this.id);
        this.calculator.renderResult(result);
      },
      keydown: () => {
        this.calculator.clearResult();
      },
      change: () => {
        this.calculator.clearResult();
      },
      reset: () => {
        this.calculator.clearResult();
      },
    };

    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'house_cleaning_service_voucher', translations });

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
window.helfi_calculator.house_cleaning_service_voucher = (id, settings) => new HouseCleaningServiceVoucher(id, settings);
