/* eslint-disable no-template-curly-in-string */
class DaycarePayment {
  constructor(id, settings) {
    this.id = id;

    // Expecting settings to follow this JSON format:
    /*
    {
    }
    */


    // The following getFormData uses dynamic children, so we need to define them first.

    const dynamicChild = (childNumber) => {
      const child = {
        id: `child_${childNumber}`,
        items: [
          {
            heading: {
              text: (childNumber === 1) ? this.t('youngest_child_title') : this.t('nth_child_title', { childNumber }),
              level: 4,
            }
          },
          {
            radio: {
              id: `daycare_type_for_child_${childNumber}`,
              label: this.t('daycare_type'),
              required: true,
              radio_items: [
                {
                  name: `daycare_type_for_child_${childNumber}`,
                  item_id: `daycare_type_for_child_${childNumber}_1`,
                  label: this.t('daycare_type_1'),
                  value: 1,
                },
                {
                  name: `daycare_type_for_child_${childNumber}`,
                  item_id: `daycare_type_for_child_${childNumber}_2`,
                  label: this.t('daycare_type_2'),
                  value: 2,
                },
                {
                  name: `daycare_type_for_child_${childNumber}`,
                  item_id: `daycare_type_for_child_${childNumber}_3`,
                  label: this.t('daycare_type_3'),
                  value: 3,
                },
                {
                  name: `daycare_type_for_child_${childNumber}`,
                  item_id: `daycare_type_for_child_${childNumber}_4`,
                  label: this.t('daycare_type_4'),
                  value: 4,
                },
              ],
            },
          },
          {
            group: {
              id: `daycare_type_1_${childNumber}_group`,
              hide_group: true,
              items: [
                {
                  radio: {
                    id: `daycare_type_1_${childNumber}_group_caretime`,
                    label: this.t('daycare_type_1_caretime'),
                    required: true,
                    radio_items: [
                      {
                        name: `daycare_type_1_${childNumber}_group_caretime`,
                        item_id: `daycare_type_1_${childNumber}_group_caretime_1`,
                        label: this.t('daycare_type_1_caretime_1'),
                        value: 1,
                      },
                      {
                        name: `daycare_type_1_${childNumber}_group_caretime`,
                        item_id: `daycare_type_1_${childNumber}_group_caretime_2`,
                        label: this.t('daycare_type_1_caretime_2'),
                        value: 2,
                      },
                      {
                        name: `daycare_type_1_${childNumber}_group_caretime`,
                        item_id: `daycare_type_1_${childNumber}_group_caretime_3`,
                        label: this.t('daycare_type_1_caretime_3'),
                        value: 3,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'daycare_type_1_free_days',
                    label: this.t('daycare_free_days'),
                    unit: this.t('unit_day'),
                    min: 0,
                    max: 12,
                    size: 2,
                    required: false,
                    helper_text: this.t('daycare_free_days_explanation'),
                  },
                },
              ],
            },
          },
          {
            group: {
              id: `daycare_type_2_${childNumber}_group`,
              hide_group: true,
              items: [
                {
                  radio: {
                    id: `daycare_type_2_${childNumber}_group_caretime`,
                    label: this.t('daycare_type_2_caretime'),
                    required: true,
                    radio_items: [
                      {
                        name: `daycare_type_2_${childNumber}_group_caretime`,
                        item_id: `daycare_type_2_${childNumber}_group_caretime_1`,
                        label: this.t('daycare_type_2_caretime_1'),
                        value: 1,
                      },
                      {
                        name: `daycare_type_2_${childNumber}_group_caretime`,
                        item_id: `daycare_type_2_${childNumber}_group_caretime_2`,
                        label: this.t('daycare_type_2_caretime_2'),
                        value: 2,
                      },
                      {
                        name: `daycare_type_2_${childNumber}_group_caretime`,
                        item_id: `daycare_type_2_${childNumber}_group_caretime_3`,
                        label: this.t('daycare_type_2_caretime_3'),
                        value: 3,
                      },
                      {
                        name: `daycare_type_2_${childNumber}_group_caretime`,
                        item_id: `daycare_type_2_${childNumber}_group_caretime_4`,
                        label: this.t('daycare_type_2_caretime_4'),
                        value: 4,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'daycare_type_2_free_days',
                    label: this.t('daycare_free_days'),
                    unit: this.t('unit_day'),
                    min: 0,
                    max: 12,
                    size: 2,
                    required: false,
                    helper_text: this.t('daycare_free_days_explanation'),
                  },
                },
              ],
            },
          },
          {
            group: {
              id: `daycare_type_3_${childNumber}_group`,
              hide_group: true,
              items: [
                {
                  radio: {
                    id: `daycare_type_3_${childNumber}_group_caretime`,
                    label: this.t('daycare_type_3_caretime'),
                    required: true,
                    radio_items: [
                      {
                        name: `daycare_type_3_${childNumber}_group_caretime`,
                        item_id: `daycare_type_3_${childNumber}_group_caretime_1`,
                        label: this.t('daycare_type_3_caretime_1'),
                        value: 1,
                      },
                      {
                        name: `daycare_type_3_${childNumber}_group_caretime`,
                        item_id: `daycare_type_3_${childNumber}_group_caretime_2`,
                        label: this.t('daycare_type_3_caretime_2'),
                        value: 2,
                      },
                      {
                        name: `daycare_type_3_${childNumber}_group_caretime`,
                        item_id: `daycare_type_3_${childNumber}_group_caretime_3`,
                        label: this.t('daycare_type_3_caretime_3'),
                        value: 3,
                      },
                      {
                        name: `daycare_type_3_${childNumber}_group_caretime`,
                        item_id: `daycare_type_3_${childNumber}_group_caretime_4`,
                        label: this.t('daycare_type_3_caretime_4'),
                        value: 4,
                      },
                    ],
                  },
                },
                {
                  input_integer: {
                    id: 'daycare_type_3_free_days',
                    label: this.t('daycare_free_days'),
                    unit: this.t('unit_day'),
                    min: 0,
                    max: 12,
                    size: 2,
                    required: false,
                    helper_text: this.t('daycare_free_days_explanation'),
                  },
                },
              ],
            },
          },
          {
            group: {
              id: `daycare_type_4_${childNumber}_group`,
              hide_group: true,
              items: [
                {
                  radio: {
                    id: `daycare_type_4_${childNumber}_group_caretime`,
                    label: this.t('daycare_type_4_caretime'),
                    required: true,
                    radio_items: [
                      {
                        name: `daycare_type_4_${childNumber}_group_caretime`,
                        item_id: `daycare_type_4_${childNumber}_group_caretime_1`,
                        label: this.t('daycare_type_4_caretime_1'),
                        value: 1,
                      },
                      {
                        name: `daycare_type_4_${childNumber}_group_caretime`,
                        item_id: `daycare_type_4_${childNumber}_group_caretime_2`,
                        label: this.t('daycare_type_4_caretime_2'),
                        value: 2,
                      },
                      {
                        name: `daycare_type_4_${childNumber}_group_caretime`,
                        item_id: `daycare_type_4_${childNumber}_group_caretime_3`,
                        label: this.t('daycare_type_4_caretime_3'),
                        value: 3,
                      },
                    ],
                    helper_text: this.t('daycare_type_4_caretime_explanation'),
                  },
                },
              ],
            },
          },
        ],
      };
      if (childNumber !== 1) {
        child.remove_label = this.t('remove_child');
      }
      return child;
    };

    // Form content
    const getFormData = () => ({
      form_id: this.id,
      has_required_fields: true,
      items: [
        {
          heading: {
            text: this.t('family_info'),
            level: 3,
          }
        },
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
            id: 'gross_income_per_month',
            label: this.t('gross_income_per_month'),
            unit: this.t('unit_euro'),
            size: 8,
            // maxlength: 999,
            required: true,
            helper_text: this.t('gross_income_per_month_explanation'),
          },
        },
        {
          heading: {
            text: this.t('child_info'),
            level: 3,
          }
        },
        {
          paragraph: {
            text: this.t('child_info_paragraph'),
          }
        },
        {
          dynamic_area: {
            id: 'first_child',
            dynamic_slots: [
              dynamicChild(1),
            ],
          },
        },
        {
          dynamic_area: {
            id: 'nth_child',
            add_button_label: this.t('add_next_child'),
            dynamic_slots: [
              // dynamicChild(2),
              // dynamicChild(3),
            ],
          },
        },
        {
          hr: {},
        },
      ]
    });

    // Translations
    const translations = {
      family_info: {
        fi: 'Perheen tiedot',
        sv: null,
        en: null,
      },
      household_size: {
        fi: 'Perheen koko',
        sv: null,
        en: null,
      },
      household_size_explanation: {
        fi: 'Samassa osoitteessa asuvien aikuisten ja alaikäisten lasten määrä.',
        sv: null,
        en: null,
      },
      gross_income_per_month: {
        fi: 'Perheen tulot kuukaudessa',
        sv: null,
        en: null,
      },
      gross_income_per_month_explanation: {
        fi: 'Koko perheen yhteenlasketut ansio- ja pääomatulot sekä etuudet ennen verojen vähentämistä.',
        sv: null,
        en: null,
      },
      child_info: {
        fi: 'Lasten tiedot',
        sv: null,
        en: null,
      },
      child_info_paragraph: {
        fi: 'Täytä tiedot koko perheen varhaiskasvatuksessa olevista tai sinne tulevista lapsista. Jos lapsia on useampi, maksu määräytyy nuorimmasta alkaen.',
        sv: null,
        en: null,
      },
      add_next_child: {
        fi: 'Lisää seuraavan lapsen tiedot',
        sv: null,
        en: null,
      },
      remove_child: {
        fi: 'Poista lapsen tiedot',
        sv: null,
        en: null,
      },
      youngest_child_title: {
        fi: 'Nuorin tai ainoa varhaiskasvatuksessa oleva lapsi',
        sv: null,
        en: null,
      },
      nth_child_title: {
        fi: '${childNumber}. varhaiskasvatuksessa oleva lapsi',
        sv: null,
        en: null,
      },
      daycare_type: {
        fi: 'Varhaiskasvatuksen muoto',
        sv: null,
        en: null,
      },
      daycare_type_1: {
        fi: 'Päiväkotihoito',
        sv: null,
        en: null,
      },
      daycare_type_2: {
        fi: 'Esiopetus ja varhaiskasvatus',
        sv: null,
        en: null,
      },
      daycare_type_3: {
        fi: '5-vuotiaiden varhaiskasvatus',
        sv: null,
        en: null,
      },
      daycare_type_4: {
        fi: 'Vuorohoito',
        sv: null,
        en: null,
      },
      daycare_type_1_caretime: {
        fi: 'Hoitoaika',
        sv: null,
        en: null,
      },
      daycare_type_1_caretime_1: {
        fi: 'Kokopäiväinen, yli 7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_1_caretime_2: {
        fi: 'Kokopäiväinen, 5-7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_1_caretime_3: {
        fi: 'Osa-aikainen, enintään 5 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_free_days: {
        fi: 'Vapaapäivien määrä',
        sv: null,
        en: null,
      },
      daycare_free_days_explanation: {
        fi: 'Arkipäivät, jolloin lapsi ei osallistu päivähoitoon (4-12 päivää kuukaudessa)',
        sv: null,
        en: null,
      },
      daycare_type_2_caretime: {
        fi: 'Esiopetuksen ja päivähoiton hoitoaika yhteensä',
        sv: null,
        en: null,
      },
      daycare_type_2_caretime_1: {
        fi: 'Yli 7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_2_caretime_2: {
        fi: '7-8 tuntia päivässä (6 –vuotiaiden esiopetusikäisten ja 5 -vuotiaiden esiopetuskokeilu)',
        sv: null,
        en: null,
      },
      daycare_type_2_caretime_3: {
        fi: 'Yli 5 ja alle 7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_2_caretime_4: {
        fi: 'Enintään 5 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_3_caretime: {
        fi: 'Hoitoaika',
        sv: null,
        en: null,
      },
      daycare_type_3_caretime_1: {
        fi: '4 tuntia päivässä (maksuton)',
        sv: null,
        en: null,
      },
      daycare_type_3_caretime_2: {
        fi: '4-5 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_3_caretime_3: {
        fi: '5-7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_3_caretime_4: {
        fi: 'Yli 7 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime: {
        fi: 'Hoitoaika',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_1: {
        fi: '61-100 tuntia kuukaudessa (noin 3-5 tuntia päivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_2: {
        fi: '101-160 tuntia kuukaudessa (noin 5-7,5 tuntia päivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_3: {
        fi: 'Yli 160 tuntia kuukaudessa (yli 7,5 tuntia päivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_explanation: {
        fi: 'Lapsella tulisi olla vähintään kaksi vapaapäivää viikossa tai vaihtoehtoisesti kahdeksan vapaapäivää kuukaudessa.',
        sv: null,
        en: null,
      },
    };

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


    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'daycare_payment', translations });

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
window.helfi_calculator.daycare_payment = (id, settings) => new DaycarePayment(id, settings);
