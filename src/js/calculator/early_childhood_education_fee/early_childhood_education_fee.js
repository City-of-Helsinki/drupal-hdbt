import form from './_form';
import translations from './_translations';

class EarlyChildhoodEducationFee {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    {
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
        for_5_year_old: {
          over_7_hours_percentage: 65,
          over_5_and_at_most_7_hours_percentage: 40,
          over_4_and_at_most_5_hours_percentage: 20,
          at_most_4_hours_percentage: 0,
        },
        for_6_year_old: {
          over_7_hours_percentage: 65,
          from_7_to_8_hours_percentage: 60,
          over_5_and_at_most_7_hours_percentage: 40,
          at_most_5_hours_percentage: 20,
        },
        round_the_clock_care: {
          from_161_hours_percentage: 100,
          from_101_to_160_hours_percentage: 80,
          from_61_to_100_hours_percentage: 60,
        },
        round_the_clock_care_with_preschool: {
          from_161_hours_percentage: 65,
          from_101_to_160_hours_percentage: 40,
          from_61_to_100_hours_percentage: 20,
        },
        free_day_percentage: 4,
      },
    }
    */


    // Form content
    const getFormData = () => form.getFormData(this.id, this.t);


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
            roundTheClockCareWithPreschool: this.calculator.getFieldValue(`daycare_type_4_${childNumber}_has_preschool`),
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
          type: 'for_5_year_old',
          careTime: {
            '1': 'over_7_hours_percentage',
            '2': 'over_5_and_at_most_7_hours_percentage',
            '3': 'over_4_and_at_most_5_hours_percentage',
            '4': 'at_most_4_hours_percentage',
          },
        },
        '3': {
          type: 'for_6_year_old',
          careTime: {
            '1': 'over_7_hours_percentage',
            '2': 'from_7_to_8_hours_percentage',
            '3': 'over_5_and_at_most_7_hours_percentage',
            '4': 'at_most_5_hours_percentage',
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
      let daycareTypeKey = daycareTypeMap[child.daycareType].type;
      let hasRoundTheClockCareWithPreschool = false;

      // If the type is round the clock care and the child is in preschool, apply bigger discount
      if (daycareTypeKey === 'round_the_clock_care' && child.daycareTypeData[child.daycareType].roundTheClockCareWithPreschool) {
        daycareTypeKey = 'round_the_clock_care_with_preschool';
        hasRoundTheClockCareWithPreschool = true;
      }

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

      return { carePaymentMultiplier, freeDayMultiplier, totalMultiplier, hasRoundTheClockCareWithPreschool };
    }

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));

      // If there are more than one child, minimum household minimum size grows too.
      const slots = this.calculator.getElement('slots_nth_child');
      if (this.calculator.getFieldValue('household_size') !== null && slots.children.length && slots.children.length + 2 > Number(this.calculator.getFieldValue('household_size'))) {
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

      // Get limits for this household size
      const limits = getIncomeLimits(householdSize, parsedSettings);
      let paymentForYoungest = null;
      let totalExplanation = '';

      // If gross income per month is below payment limit, no payment.
      if (!grossIncomePerMonthRaw && grossIncomePerMonthRaw !== 0) {
        totalExplanation = this.t('receipt_family_empty_income');
        paymentForYoungest = Number(parsedSettings.child_1_max_euro);
      } else if (grossIncomePerMonth < limits.min) {
        paymentForYoungest = 0;
      } else {
        // Calculate the difference between minimum limit and gross income
        const grossDiff = grossIncomePerMonth - limits.min;
        // Get the percentage of the difference as our base payment
        paymentForYoungest = grossDiff * (Number(parsedSettings.payment_percentage) / 100);

        // If the calculated payment would be above maximum payment limit, fix to max.
        if (paymentForYoungest > Number(parsedSettings.child_1_max_euro)) {
          paymentForYoungest = Number(parsedSettings.child_1_max_euro);
        }
      }

      // Get discount for all children
      for (let i = 0; i < children.length; i++) {
        children[i].discounts = getDiscount(children[i], parsedSettings.discounts);
      }

      let sum = 0;
      const subtotals = [];
      const additionalDetails = [];

      // Calculate discounted payments for all children
      for (let i = 0; i < children.length; i++) {
        const siblingDiscount = [];

        // Handle sibling discount if any
        switch (i) {
          case 0: // Youngest child gets no sibling discount
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest;
            break;
          case 1: // Second youngest child gets sibling discount for second youngest
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest * (Number(parsedSettings.child_2_percent) / 100);
            siblingDiscount.push(this.t('second_youngest_child_sibling_discount', { discount: parsedSettings.child_2_percent }));
            break;
          default: // All other children get even bigger discount
            children[i].payment = children[i].discounts.totalMultiplier * paymentForYoungest * (Number(parsedSettings.child_n_percent) / 100);
            siblingDiscount.push(this.t('nth_youngest_child_sibling_discount', { discount: parsedSettings.child_n_percent }));
            break;
        }
        children[i].paymentRounded = Math.round(children[i].payment);

        let paymentWasRoundedDown = false;
        if (children[i].paymentRounded < parsedSettings.minimum_payment_euro) {
          children[i].paymentRounded = 0;
          paymentWasRoundedDown = true;
        }

        const { daycareType } = children[i];
        const { careTime, freeDays } = children[i].daycareTypeData[daycareType];
        const { hasRoundTheClockCareWithPreschool } = children[i].discounts;

        const careTypeAndcareTime = `${this.t(`daycare_type_${daycareType}`)}: ${this.t(`daycare_type_${daycareType}_caretime_${careTime}`)}`;

        const subtotal = {
          title: (i === 0) ? this.t('youngest_child_title') : this.t('nth_child_title'),
          has_details: true,
          details: [careTypeAndcareTime].concat(siblingDiscount),
          sum: this.t('receipt_subtotal_euros_per_month', { value: children[i].paymentRounded }),
          sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: children[i].paymentRounded }),
        };
        if (freeDays && Number(freeDays) > 0) {
          let freeDaysNote = `${this.t('daycare_free_days')}: ${freeDays}`;
          if (Number(freeDays) < 4) {
            freeDaysNote += this.t('daycare_free_days_does_not_affect');
          }
          subtotal.details.push(freeDaysNote);
        }
        if (paymentWasRoundedDown) {
          subtotal.details.push(this.t('receipt_family_estimated_payment_explanation_min', { minimum_payment_euro: parsedSettings.minimum_payment_euro }));
        }
        if (hasRoundTheClockCareWithPreschool) {
          subtotal.details.push(this.t('daycare_has_preschool'));
        }
        subtotals.push(subtotal);

        if (daycareType === '2' || daycareType === '3' || hasRoundTheClockCareWithPreschool) {
          let title = null;
          if (!additionalDetails.length) {
            title = this.t('receipt_additional_details');
          }
          additionalDetails.push({ title, text: this.t(`receipt_daycare_type_${daycareType}_details`) });
        }

        sum += children[i].paymentRounded;
      }

      // If total sum is below minimum payment limit, round it to 0 and tell user about it.
      if (sum < parsedSettings.minimum_payment_euro) {
        sum = 0;
        totalExplanation = this.t('receipt_family_estimated_payment_explanation_min', { minimum_payment_euro: parsedSettings.minimum_payment_euro }) + totalExplanation;
      }
      totalExplanation += this.t('receipt_family_estimated_payment_explanation');

      const receiptData = {
        id: this.id,
        title: this.t('receipt_estimate_of_payment'),
        total_prefix: this.t('receipt_family_estimated_payment_prefix'),
        total_value: sum,
        total_suffix: this.t('receipt_family_estimated_payment_suffix'),
        total_explanation: totalExplanation,
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
        ariaLive: this.t('receipt_aria_live', { payment: sum }),
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

        const slots = this.calculator.getElement('slots_nth_child');
        slots.innerHTML = '';
      },
    };

    const removeChild = (event) => {
      event.preventDefault();

      const childElem = event.target.closest('.helfi-calculator__dynamic-slot');
      if (childElem) {
        const dynamicArea = childElem.closest('.helfi-calculator__dynamic-area');

        event.target.removeEventListener('click', removeChild);
        childElem.parentElement.removeChild(childElem);

        dynamicArea?.querySelector(':scope > .hds-button')?.focus();
        this.calculator.showAriaLiveText(this.t('removed_child'));
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
        dynamic_slot: form.dynamicChildData(nextChildNumber, this.t),
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

      // Focus the first dynamic item in new child for accessibility.
      newChildElem.querySelector('input').focus();

    };

    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'early_childhood_education_fee', translations });

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
window.helfi_calculator.early_childhood_education_fee = (id, settings) => new EarlyChildhoodEducationFee(id, settings);
