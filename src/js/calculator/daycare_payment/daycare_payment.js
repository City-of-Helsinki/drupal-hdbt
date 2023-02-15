import translations from './_translations';

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
            min: 2,
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
            required: false,
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

    const getChildData = (childNumber) => {
      const childData = {
        daycareType: this.calculator.getFieldValue(`daycare_type_for_child_${childNumber}`),
        daycareTypeData: {
          '1': {
            careTime: this.calculator.getFieldValue(`daycare_type_1_${childNumber}_group_caretime`),
            freeDays: this.calculator.getFieldValue(`daycare_type_1_${childNumber}_free_days`),
          },
          '2': {
            careTime: this.calculator.getFieldValue(`daycare_type_2_${childNumber}_group_caretime`),
            freeDays: this.calculator.getFieldValue(`daycare_type_2_${childNumber}_free_days`),
          },
          '3': {
            careTime: this.calculator.getFieldValue(`daycare_type_3_${childNumber}_group_caretime`),
            freeDays: this.calculator.getFieldValue(`daycare_type_3_${childNumber}_free_days`),
          },
          '4': {
            careTime: this.calculator.getFieldValue(`daycare_type_4_${childNumber}_group_caretime`),
          },
        }
      };
      return childData;
    };

    function getIncomeLimits(householdSize, incomeSettings) {
      const limits = incomeSettings.family_size_income_limits[`${householdSize}`];
      if (limits) {
        return {
          min: Number(limits.min),
          max: Number(limits.max),
        };
      }
      const maxDefinedLimitNum = Number(Object.keys(incomeSettings.family_size_income_limits).at(-1));
      const diff = householdSize - maxDefinedLimitNum;
      if (diff > 0) {
        return {
          min: diff * incomeSettings.family_size_beyond_defined_multiplier_euro + incomeSettings.family_size_income_limits[`${maxDefinedLimitNum}`].min,
          max: diff * incomeSettings.family_size_beyond_defined_multiplier_euro + incomeSettings.family_size_income_limits[`${maxDefinedLimitNum}`].max,
        };
      }
      throw new Error(`Income limits error for householdSize ${householdSize}`);
    }

    function getDiscount(child, discounts) {
      const { careTime, freeDays } = child.daycareTypeData[child.daycareType];

      // As the form has only numbers in its type and discounts come from verbose json settings, lets map them together
      const daycareTypeMap = {
        '1': {
          type: 'early_education_on_weekdays',
          careTime: {
            '1': 'over_7_hours_percentage',
            '2': 'over_5_and_at_most_7_hours_percentage',
            '3': 'at_most_5_hours_percentage',
          },
        },
        '2': {
          type: 'for_6_year_old',
          careTime: {
            '1': 'over_7_hours_percentage',
            '2': 'from_7_to_8_hours_percentage',
            '3': 'over_5_and_at_most_7_hours_percentage',
            '4': 'at_most_5_hours_percentage',
          },
        },
        '3': {
          type: 'for_5_year_old',
          careTime: {
             '1': 'over_7_hours_percentage',
             '2': 'over_5_and_at_most_7_hours_percentage',
             '3': 'over_4_and_at_most_5_hours_percentage',
             '4': 'at_most_4_hours_percentage',
          },
        },
        '4': {
          type: 'round_the_clock_care',
          careTime: {
             '1': 'from_161_hours_percentage',
             '2': 'from_101_to_160_hours_percentage',
             '3': 'from_61_to_100_hours_percentage',
          },
        },
      };
      const daycareTypeKey = daycareTypeMap[child.daycareType].type;
      const careTimeKey = daycareTypeMap[child.daycareType].careTime[careTime];

      // Lets get the discount and convert it from 0-100 percentage a to a multiplier 0-1
      const carePaymentMultiplier = Number(discounts[daycareTypeKey][careTimeKey]) / 100;

      // By default there is no free day discount
      let freeDayMultiplier = 1;
      const freeDaysNum = Number(freeDays);

      // If the free days are within 4-12 days, there's a discount based on day count.
      if (freeDaysNum >= 4 && freeDaysNum <= 12) {
        freeDayMultiplier = (100 - (Number(discounts.free_day_percentage) * Number(freeDays))) / 100;
      }

      const totalMultiplier = carePaymentMultiplier * freeDayMultiplier;

      return { carePaymentMultiplier, freeDayMultiplier, totalMultiplier };
    }

    const validate = () => {
      const defaultInfo = {
        title: this.t('default_info_title'),
        message: this.t('default_info_message'),
      };
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));

      // If there are more than one child, minimum household minimum size grows too.
      const slots = this.calculator.getElement('slots_nth_child');
      if (slots.children.length && slots.children.length + 2 > Number(this.calculator.getFieldValue('household_size'))) {
        errorMessages.push(...this.calculator.getError('household_size', 'household_size_is_too_small_for_child_count', { minValue: slots.children.length + 2, childCount: slots.children.length + 1 }));
      }

      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));

      // Check first child
      errorMessages.push(...validateChildBasics(1));

      // Check other children
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

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Get fielf values for calculating.
      const householdSize = Number(this.calculator.getFieldValue('household_size'));
      const grossIncomePerMonthRaw = this.calculator.getFieldValue('gross_income_per_month');
      const grossIncomePerMonth = Number(grossIncomePerMonthRaw);
      const children = [];

      // Get first child separately as it's hardcoded.
      children.push(getChildData(1));

      // Get values for other children
      for (let i = 0; i < slots.children.length; i++) {
        const child = slots.children[i];
        if (child.dataset && child.dataset.slotNumber) {
          const childNumber = child.dataset.slotNumber;
          children.push(getChildData(childNumber));
        }
      }

      // console.log(householdSize, grossIncomePerMonth, children);

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results
      // 1. Get basic payment for youngest child in daycare based on family size and gross income
      // 2. Make sure that it is below max bound
      // 3. Calculate other childrens payments based on their sibling discount percentages and youngest childs basic payment
      // 4. Get discount multipliers based on daycare type, care time and free days per month for all children
      // 5. Calculate discounted payments for all children, check that they're not below minimum payment treshold
      // 6. Round to full euros, then sum it all up and show results

      const tempSettings = {
        family_size_income_limits: {
          '2': {
            min: 3874,
            max: 6626
          },
          '3': {
            min: 4998,
            max: 7750
          },
          '4': {
            min: 5675,
            max: 8427
          },
          '5': {
            min: 6353,
            max: 9105
          },
          '6': {
            min: 7028,
            max: 9780
          },
        },
        family_size_beyond_defined_multiplier_euro: 262,
        minimum_payment_euro: 28,
        payment_percentage: 10.7,
        child_1_max_euro: 295,
        child_2_percent: 40,
        child_n_percent: 20,
        discounts: {
          early_education_on_weekdays: {
            over_7_hours_percentage: 100,
            over_5_and_at_most_7_hours_percentage: 80,
            at_most_5_hours_percentage: 60,
          },
          for_6_year_old: {
            over_7_hours_percentage: 65,
            from_7_to_8_hours_percentage: 60,
            over_5_and_at_most_7_hours_percentage: 40,
            at_most_5_hours_percentage: 20,
          },
          for_5_year_old: {
            over_7_hours_percentage: 65,
            over_5_and_at_most_7_hours_percentage: 40,
            over_4_and_at_most_5_hours_percentage: 20,
            at_most_4_hours_percentage: 0,
          },
          round_the_clock_care: {
            from_161_hours_percentage: 100,
            from_101_to_160_hours_percentage: 80,
            from_61_to_100_hours_percentage: 60,
          },
          free_day_percentage: 4,
        },
      };

      // Get limits for this household size
      const limits = getIncomeLimits(householdSize, tempSettings);
      let paymentForYoungest = null;

      // If gross income per month is below payment limit, no payment.
      if (!grossIncomePerMonthRaw && grossIncomePerMonthRaw !== 0) {
        paymentForYoungest = Number(tempSettings.child_1_max_euro);
      } else if (grossIncomePerMonth < limits.min) {
        paymentForYoungest = 0;
      } else {
        // Calculate the difference between minimum limit and gross income
        const grossDiff = grossIncomePerMonth - limits.min;
        // Get the percentage of the difference as our base payment
        paymentForYoungest = grossDiff * (Number(tempSettings.payment_percentage) / 100);

        // If the calculated payment would be above maximum payment limit, fix to max.
        if (paymentForYoungest > Number(tempSettings.child_1_max_euro)) {
          paymentForYoungest = Number(tempSettings.child_1_max_euro);
        }
      }

      // Get discount for all children
      for (let i = 0; i < children.length; i++) {
        children[i].discounts = getDiscount(children[i], tempSettings.discounts);
      }

      let sum = 0;

      // Calculate discounted payments for all children
      for (let i = 0; i < children.length; i++) {
        // Handle sibling discount if any
        switch (i) {
          case 0: // Youngest child gets no sibling discount
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest;
            break;
          case 1: // Second youngest child gets sibling discount for second youngest
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest * (Number(tempSettings.child_2_percent) / 100);
            break;
          default: // All other children get even bigger discount
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest * (Number(tempSettings.child_n_percent) / 100);
            break;
        }
        children[i].paymentRounded = Math.round(children[i].payment);
        sum += children[i].paymentRounded;
      }

      console.log('Children:', children, 'sum', sum );

      return {
        alert: {
          title: 'TBD',
          message: `Maksu: ${sum} euroa`,
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
        // validate();
      },
      reset: () => {
        window.setTimeout(update, 1);
        this.calculator.clearResult();
      },
    };

    const removeChild = (event) => {
      event.preventDefault();

      const childElem = event.target.closest('.helfi-calculator__dynamic-slot');
      if (childElem) {
        event.target.removeEventListener('click', removeChild);
        childElem.parentElement.removeChild(childElem);
      }
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

      slots.insertAdjacentHTML('beforeend', html);

      // Handle "remove child"-button clicks
      const newChildElem = this.calculator.getElement(`child_${nextChildNumber}`);
      const removeChildButton = newChildElem.querySelector('.helfi-calculator__dynamic-remove');
      removeChildButton.addEventListener('click', removeChild);

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
