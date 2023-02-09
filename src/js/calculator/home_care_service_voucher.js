class HomeCareServiceVoucher {
  constructor(id, settings) {
    this.id = id;

    // Expecting settings to follow this JSON format:
    /*
    {
      // TODO: Add settings here
    }
    */

    // Form content
    const get_form_data = () => {
      return {
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
              helper_text: this.t('household_size_explanation'),
            },
          },
          {
            input_float: {
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
              required: true,
              helper_text: this.t('gross_income_per_month_explanation'),
            },
          },
          {
            input_float: {
              id: 'service_providers_hourly_price',
              label: this.t('service_providers_hourly_price'),
              unit: this.t('unit_euro'),
              min: '0',
              size: 6,
              required: true,
              helper_text: this.t('service_providers_hourly_price_explanation'),
            },
          },
        ]
      };
    };

    // Translations
    const translations = {
      household_size: {
        fi: 'Talouden koko',
        sv: null,
        en: null,
      },
      household_size_explanation: {
        fi: 'Taloudella tarkoitetaan samassa osoitteessa yhteistaloudessa eläviä aikuisia sekä heidän alaikäisiä lapsiaan',
        sv: null,
        en: null,
      },
      monthly_usage: {
        fi: 'Kuukausittainen käyttö',
        sv: null,
        en: null,
      },
      monthly_usage_explanation: {
        fi: 'Palvelusuunnitelmassa teille määritelty kotihoidon tuntimäärä kuukaudessa.',
        sv: null,
        en: null,
      },
      gross_income_per_month: {
        fi: 'Bruttotulot kuukaudessa',
        sv: null,
        en: null,
      },
      gross_income_per_month_explanation: {
        fi: 'Kuukausituloina huomioidaan veronalaiset ansiotulot ja veronalaiset pääomatulot, joita ovat metsätulot sekä korko-, osinko- ja vuokratulot.',
        sv: null,
        en: null,
      },
      service_providers_hourly_price: {
        fi: 'Palveluntuottajan tuntihinta',
        sv: null,
        en: null,
      },
      service_providers_hourly_price_explanation: {
        fi: 'Valitsemanne palveluntuottajan perimä kotihoitotunnin hinta',
        sv: null,
        en: null,
      },
      info_voucher_value: {
        fi: 'Palvelusetelin arvo ${voucher_value} € / kk.',
        sv: null,
        en: null,
      },
      alert_voucher_not_applicable: {
        fi: 'Ei oikeutta palveluseteliin.',
        sv: null,
        en: null,
      },
    };

    const eventHandlers = {
      submit: (event) => {
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

    const validate =(id) => {
      const errorMessages = [];

      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('service_providers_hourly_price'));

      // Check if any missing input errors were found
      if (errorMessages.length) {
        return { error: true, title: this.t('missing_input'), message: errorMessages };
      }
      const size = this.calculator.getFieldValue('household_size');
      const usage = this.calculator.getFieldValue('monthly_usage');
      const income = this.calculator.getFieldValue('gross_income_per_month');
      const price = this.calculator.getFieldValue('service_providers_hourly_price');

      // TODO: Add the algorithm

      // // Otherwise not applicable for voucher
      // return { alert: true, title: this.t('result'), message: this.t('alert_voucher_not_applicable') };
      return { alert: true, title: this.t('result'), message: 'Algorithm is missing!' };
    };

    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'home_care_service_voucher', translations });

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
window.helfi_calculator.home_care_service_voucher = (id, settings) => new HomeCareServiceVoucher(id, settings);

