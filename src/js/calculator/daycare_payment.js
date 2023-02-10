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

    const dynamicChildData = (childNumber) => {
      const child = {
        id: `child_${childNumber}`,
        slotNumber: childNumber,
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
                    id: `daycare_type_1_${childNumber}_free_days`,
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
                    id: `daycare_type_2_${childNumber}_free_days`,
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
                    id: `daycare_type_3_${childNumber}_free_days`,
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
              dynamicChildData(1),
            ],
          },
        },
        {
          dynamic_area: {
            id: 'nth_child',
            add_button_label: this.t('add_next_child'),
            dynamic_slots: [
              // dynamicChildData(2),
              // dynamicChildData(3),
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
        fi: 'Seuraava varhaiskasvatuksessa oleva lapsi',
        sv: null,
        en: null,
      },
      daycare_type: {
        fi: 'Varhaiskasvatuksen muoto',
        sv: null,
        en: null,
      },
      daycare_type_1: {
        fi: 'Varhaiskasvatus arkipäivisin',
        sv: null,
        en: null,
      },
      daycare_type_2: {
        fi: '6-vuotiaiden esiopetus ja varhaiskasvatus',
        sv: null,
        en: null,
      },
      daycare_type_3: {
        fi: '5-vuotiaiden varhaiskasvatus',
        sv: null,
        en: null,
      },
      daycare_type_4: {
        fi: 'Vuorohoito (hoitoa myös iltaisin ja viikonloppuisin)',
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
        fi: 'Osa-aikainen, alle 5 tuntia päivässä',
        sv: null,
        en: null,
      },
      daycare_free_days: {
        fi: 'Vapaapäivien määrä',
        sv: null,
        en: null,
      },
      daycare_free_days_explanation: {
        fi: 'Mahdolliset säännöllisesti toistuvat arkipäivät, jolloin lapsi ei osallistu päivähoitoon. Kuukaudessa 4-12 päivää vaikuttaa maksuun.',
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
        fi: '61-100 tuntia kuukaudessa (Esim. noin 3-5 tuntia arkipäivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_2: {
        fi: '101-160 tuntia kuukaudessa (Esim. noin 5-7,5 tuntia arkipäivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_3: {
        fi: 'Yli 160 tuntia kuukaudessa (Esim. yli 7,5 tuntia arkipäivässä)',
        sv: null,
        en: null,
      },
      daycare_type_4_caretime_explanation: {
        fi: 'Lapsella tulisi olla vähintään kaksi vapaapäivää viikossa tai vaihtoehtoisesti kahdeksan vapaapäivää kuukaudessa.',
        sv: null,
        en: null,
      },
      default_info_title: {
        fi: 'Täytä kaikki pakolliset tiedot, ja paina "Laske arvio".',
        sv: null,
        en: null,
      },
      default_info_message: {
        fi: 'Arvio asiakasmaksusta tulee näkyviin tähän. Jos päivität laskurin sisältöä, muista painaa "Laske arvio" uudelleen.',
        sv: null,
        en: null,
      },
    };

    const updateChild = (childNumber) => {
      const daycareTypeForChild = this.calculator.getFieldValue(`daycare_type_for_child_${childNumber}`);

      switch (daycareTypeForChild) {
        case '1':
          this.calculator.showGroup(`daycare_type_1_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_2_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_3_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_4_${childNumber}_group`);
          break;
        case '2':
          this.calculator.hideGroup(`daycare_type_1_${childNumber}_group`);
          this.calculator.showGroup(`daycare_type_2_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_3_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_4_${childNumber}_group`);
          break;
        case '3':
          this.calculator.hideGroup(`daycare_type_1_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_2_${childNumber}_group`);
          this.calculator.showGroup(`daycare_type_3_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_4_${childNumber}_group`);
          break;
        case '4':
          this.calculator.hideGroup(`daycare_type_1_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_2_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_3_${childNumber}_group`);
          this.calculator.showGroup(`daycare_type_4_${childNumber}_group`);
          break;

        default:
          this.calculator.hideGroup(`daycare_type_1_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_2_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_3_${childNumber}_group`);
          this.calculator.hideGroup(`daycare_type_4_${childNumber}_group`);
          break;
      }
    };

    const update = () => {
      updateChild(1);

      const slots = this.calculator.getElement('slots_nth_child');
      for (let i = 0; i < slots.children.length; i++) {
        const child = slots.children[i];
        if (child.dataset && child.dataset.slotNumber) {
          updateChild(child.dataset.slotNumber);
        }
      }
    };

    const validateChildBasics = (childNumber) => {
      const errorMessages = [];
      const daycareField = `daycare_type_for_child_${childNumber}`;
      errorMessages.push(...this.calculator.validateBasics(daycareField));
      const daycareType = this.calculator.getFieldValue(daycareField);

      switch (daycareType) {
        case '1':
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_1_${childNumber}_group_caretime`));
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_1_${childNumber}_free_days`));
          break;
        case '2':
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_2_${childNumber}_group_caretime`));
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_2_${childNumber}_free_days`));
          break;
        case '3':
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_3_${childNumber}_group_caretime`));
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_3_${childNumber}_free_days`));
          break;
        case '4':
          errorMessages.push(...this.calculator.validateBasics(`daycare_type_4_${childNumber}_group_caretime`));
          break;

        default:
          break;
      }
      return errorMessages;
    };

    const validate = () => {
      const defaultInfo = {
        title: this.t('default_info_title'),
        message: this.t('default_info_message'),
      };
      const errorMessages = [];

      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));

      errorMessages.push(...validateChildBasics(1));


      const slots = this.calculator.getElement('slots_nth_child');
      for (let i = 0; i < slots.children.length; i++) {
        const child = slots.children[i];
        if (child.dataset && child.dataset.slotNumber) {
          errorMessages.push(...validateChildBasics(child.dataset.slotNumber));
        }
      }



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

      return {
        alert: {
          title: 'TBD',
          message: 'TBD',
        },
        info: defaultInfo,
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
        validate();
      },
      reset: () => {
        window.setTimeout(update, 1);
        this.calculator.clearResult();
      },
    };

    const addChild = (event) => {
      event.preventDefault();

      const slots = this.calculator.getElement('slots_nth_child');

      // Initialise itemCount with slots child count.
      slots.dataset.itemCount = slots.dataset.itemCount || slots.childElementCount;

      const nextChildNumber = Number(slots.dataset.itemCount) + 2;
      const childData = {
        form_id: this.id,
        dynamic_slot: dynamicChildData(nextChildNumber),
      };

      const html = this.calculator.getPartialRender(
        `
          {{#dynamic_slot}}
            {{>dynamic_slot}}
          {{/dynamic_slot}}
        `,
        childData,
      );

      slots.innerHTML += html;

      slots.dataset.itemCount = nextChildNumber - 1;
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

    // Handle addButton clicks
    const addButton = this.calculator.getElement('add-button_nth_child');
    addButton.addEventListener('click', addChild);
  }
}

window.helfi_calculator = window.helfi_calculator || {};
window.helfi_calculator.daycare_payment = (id, settings) => new DaycarePayment(id, settings);
