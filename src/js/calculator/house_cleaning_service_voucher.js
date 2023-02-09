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
    const get_form_data = () => {
      return {
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
      };
    };

    // Translations
    const translations = {
      gross_income_per_month: {
        fi: 'Bruttotulot kuukaudessa',
        sv: 'Bruttoinkomst per månad',
        en: 'Gross income per month',
      },
      household_size: {
        fi: 'Talouden koko',
        sv: 'Storleken på hushållet',
        en: 'Household size',
      },
      one_person_household: {
        fi: 'Yhden hengen talous',
        sv: 'Enmanshushåll',
        en: 'One person household',
      },
      two_person_household: {
        fi: 'Kahden hengen talous',
        sv: 'Två personers hushåll',
        en: 'Two person household',
      },
      info_voucher_value: {
        fi: 'Palvelusetelin arvo ${voucher_value} € / kk.',
        sv: 'Värde på servicekupong ${voucher_value} € / månad',
        en: 'Service voucher value ${voucher_value} € / month',
      },
      alert_voucher_not_applicable: {
        fi: 'Ei oikeutta palveluseteliin',
        sv: 'Ingen rätt till servicekupong',
        en: 'No right to a service voucher',
      },
      error_gross_income_per_month: {
        fi: 'Tarkista "Bruttotulot kuukaudessa"',
        sv: 'Kolla upp "Bruttoinkomst per månad"',
        en: 'Please check "Gross income per month"',
      },
      error_household_size: {
        fi: 'Tarkista "Talouden koko"',
        sv: 'Kolla upp "Storleken på hushållet"',
        en: 'Please check "Household size"',
      },
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

    const validate = (id) => {
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

      const household_size = this.calculator.getFieldValue('household_size');
      const gross_income_per_month = this.calculator.getFieldValue('gross_income_per_month');

      // Get correct data values based on family size
      const family_data = this.settings['household_size_' + household_size];
      if (!family_data) {
        throw 'household_size_' + household_size + ' missing from settings';
      }

      // Check if first level is applicable
      if (gross_income_per_month <= family_data.first_level.max_allowed_income) {
        return {
          info: {
            title: this.t('result'),
            message: this.t('info_voucher_value', { voucher_value: family_data.first_level.value }),
          },
        };

        // Check if second level is applicable
      } else if (gross_income_per_month <= family_data.second_level.max_allowed_income) {
        return {
          info: {
            title: this.t('result'),
            message: this.t('info_voucher_value', { voucher_value: family_data.second_level.value }),
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


    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'house_cleaning_service_voucher', translations });

    // Create shortcut for translations
    this.t = (key, value) => this.calculator.translate(key, value);

    // Parse settings to js
    this.settings = this.calculator.parseSettings(settings);

    // Initialize calculator
    this.calculator.init({
      id: id,
      form_data: get_form_data(),
      eventHandlers,
    });
  }
}

window.helfi_calculator = window.helfi_calculator || {};
window.helfi_calculator.house_cleaning_service_voucher = (id, settings) => new HouseCleaningServiceVoucher(id, settings);
