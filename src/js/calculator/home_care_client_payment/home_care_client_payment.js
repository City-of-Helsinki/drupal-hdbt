import form from './_form';
import translations from './_translations';

class HomeCareClientPayment {
  constructor(id, settings) {
    this.id = id;
    const parsedSettings = JSON.parse(settings);

    // Expecting settings to follow this JSON format:
    /*
    const parsedSettings = {
      household_size: {
        '1': {
          gross_income_limit: 598,
          monthly_usage_percentage: {
            '0': 4,
            '5': 8,
            '9': 12,
            '13': 16,
            '17': 20,
            '21': 22,
            '25': 24,
            '29': 26,
            '33': 28,
            '37': 30,
            '41': 35,
          },
        },
        '2': {
          gross_income_limit: 1103,
          monthly_usage_percentage: {
            '0': 4,
            '5': 7,
            '9': 10,
            '13': 12,
            '17': 16,
            '21': 18,
            '25': 20,
            '29': 20,
            '33': 20,
            '37': 20,
            '41': 20,
          },
        },
        '3': {
          gross_income_limit: 1731,
          monthly_usage_percentage: {
            '0': 4,
            '5': 6,
            '9': 9,
            '13': 11,
            '17': 14,
            '21': 16,
            '25': 16,
            '29': 16,
            '33': 16,
            '37': 16,
            '41': 16,
          },
        },
        '4': {
          gross_income_limit: 2140,
          monthly_usage_percentage: {
            '0': 4,
            '5': 6,
            '9': 9,
            '13': 11,
            '17': 12,
            '21': 12,
            '25': 12,
            '29': 12,
            '33': 12,
            '37': 12,
            '41': 12,
          },
        },
        '5': {
          gross_income_limit: 2591,
          monthly_usage_percentage: {
            '0': 4,
            '5': 6,
            '9': 9,
            '13': 10,
            '17': 10,
            '21': 10,
            '25': 10,
            '29': 10,
            '33': 10,
            '37': 10,
            '41': 10,
          },
        },
        '6': {
          gross_income_limit: 2976,
          monthly_usage_percentage: {
            '0': 4,
            '5': 6,
            '9': 8,
            '13': 9,
            '17': 9,
            '21': 9,
            '25': 9,
            '29': 9,
            '33': 9,
            '37': 9,
            '41': 9,
          },
        },
      },
      monthly_usage_max_payment: {
        '0': 119.66,
        '5': 538.47,
        '9': 1017.12,
        '13': 1495.76,
        '17': 1974.40,
        '21': 2453.05,
        '25': 2931.69,
        '29': 3410.33,
        '33': 3888.98,
        '37': 4367.62,
        '41': 4906.10,
      },
      safetyphone_limits: {
        '1': {
          '0': 0,
          '1138.01': 34.55,
          '1707.01': 54,
        },
        '2': {
          '0': 0,
          '1138.01': 34.55,
          '2101.01': 54,
        },
      },
      shopping_service_prices: {
        first_per_week: 9.37,
        others_per_week: 11.35,
      },
      meal_service_prices: {
        lunch: 3.9,
        delivery: 7,
        max_meals_for_single_delivery_per_week: 3,
        menumat: {
          lunch: 6.4,
          device_per_day: 2.36,
        }
      },
    };
    // */
    // Form content
    const getFormData = () => form.getFormData(this.id, this.t, {
      firstPerWeekPrice: parsedSettings.shopping_service_prices.first_per_week,
      othersPerWeekPrice: parsedSettings.shopping_service_prices.others_per_week,
    });

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

    // Finds the smallest matching value >= key from object
    const getMinimumRange = (value, range) => {
      const rangeKeys = Object.keys(range).reverse();
      for (let i = 0; i < rangeKeys.length; i++) {
        const valueLimit = rangeKeys[i];
        if (Number(valueLimit) <= value) {
          return range[valueLimit];
        }
      }
      throw new Error('Minimum range not found for', value, 'from', range);
    };

    const getHouseholdLimitAndPercentage = (householdSize, monthlyUsage, householdSizeData) => {
      // Currently we have values up until 6 person household sizes, this way it's configurable.
      const household = getMinimumRange(householdSize, householdSizeData);

      const grossIncomeLimit = household.gross_income_limit;
      const paymentPercentage = getMinimumRange(monthlyUsage, household.monthly_usage_percentage);

      return { grossIncomeLimit, paymentPercentage };
    };

    function formatEuroCents(num) {
      // Round the number to two decimal places
      num = `${Math.round(num * 100) / 100}`;

      // Pad the number with zeros if necessary
      const decimalPos = num.indexOf('.');
      if (decimalPos === -1) {
        num += '.00';
      } else if (num.length - decimalPos === 2) {
        num += '0';
      }

      return num;
    }

    function formatFinnishEuroCents(num) {
      return formatEuroCents(num).replace('.', ',');
    }

    const validate = () => {
      const errorMessages = [];

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Validate basics from form
      errorMessages.push(...this.calculator.validateBasics('household_size'));
      errorMessages.push(...this.calculator.validateBasics('gross_income_per_month'));
      errorMessages.push(...this.calculator.validateBasics('monthly_usage'));
      errorMessages.push(...this.calculator.validateBasics('safetyphone'));

      errorMessages.push(...this.calculator.validateBasics('shopping_service'));
      const shoppingService = this.calculator.getFieldValue('shopping_service');
      if (shoppingService === '1') {
        errorMessages.push(...this.calculator.validateBasics('shopping_service_per_week'));
      }

      errorMessages.push(...this.calculator.validateBasics('meal_service'));
      const mealService = this.calculator.getFieldValue('meal_service');
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
      const safetyphone = this.calculator.getFieldValue('safetyphone');
      // Shopping service is set earlier
      const shoppingServicePerWeek = Number(this.calculator.getFieldValue('shopping_service_per_week'));
      // Meal service is set earlier
      const mealServicePerWeek = Number(this.calculator.getFieldValue('meal_service_per_week'));


      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // Calculate results
      // 1. Get proper limits based on given values and the parsed settings.
      // 2. Check if user has left gross income empty --> maximum payment
      // 3. Otherwise calculate reference payment
      // 4. Check if reference payment is higher than maximum payment value --> scale to maximum payment
      // 5. Calculate optional safetyphone payment
      // 6. Calculate optional shopping service payment
      // 7. Calculate optional meal service payment
      // 8. Show receipt

      let totalExplanation = this.t('receipt_family_estimated_payment_explanation');

      // 1. Get proper limits based on given values and the parsed settings.
      const maximumPayment = getMinimumRange(monthlyUsage, parsedSettings.monthly_usage_max_payment);
      const { grossIncomeLimit, paymentPercentage } = getHouseholdLimitAndPercentage(householdSize, monthlyUsage, parsedSettings.household_size);

      // 2. If the gross income field is null, lets use the maximumPayment
      let referencePayment = maximumPayment;

      // 3. If the gross income field has a value, calculate refrence payment
      if (grossIncomePerMonthRaw !== null) {
        referencePayment = (grossIncomePerMonth - grossIncomeLimit) * (paymentPercentage / 100);
      } else {
        totalExplanation = this.t('receipt_family_empty_income') + totalExplanation;
      }

      // 4. Payment should never be higher than maximumPayment
      const payment = Math.min(referencePayment, maximumPayment);

      const homecareSubtotal = {
        title: this.t('receipt_homecare_payment'),
        has_details: false,
        details: [],
        sum: this.t('receipt_subtotal_euros_per_month', { value: formatFinnishEuroCents(payment) }),
        sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: formatEuroCents(payment) }),
      };

      if (householdSize >= 2) {
        homecareSubtotal.has_details = true;
        homecareSubtotal.details.push(this.t('receipt_homecare_payment_two_or_more'));
      }

      const subtotals = [homecareSubtotal];
      const additionalDetails = [];

      // 5. If safetyphone is selected, calculate value for it.
      let safetyphonePayment = 0;
      if (safetyphone === '1') {
        // Lets get the proper range (when writing, only 1 or 2 household size is used, but this approach supports larger sizes too)
        const householdSizeRange = getMinimumRange(householdSize, parsedSettings.safetyphone_limits);
        // Get the payment based on income and found range.
        safetyphonePayment = getMinimumRange(grossIncomePerMonth, householdSizeRange);

        // Add details to receipt
        subtotals.push(
          {
            title: this.t('safetyphone_heading'),
            has_details: false,
            details: [],
            sum: this.t('receipt_subtotal_euros_per_month', { value: formatFinnishEuroCents(safetyphonePayment) }),
            sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: formatEuroCents(safetyphonePayment) }),
          }
        );
      }

      // 6. If shopping service is selected, calculate value for it.
      let shoppingPaymentPerWeek = 0;
      let shoppingPaymentPerMonth = 0;
      if (shoppingService === '1') {
        // First shopping service per week has cheaper price
        shoppingPaymentPerWeek = parsedSettings.shopping_service_prices.first_per_week;
        // Others have higher price
        shoppingPaymentPerWeek += (shoppingServicePerWeek - 1) * parsedSettings.shopping_service_prices.others_per_week;
        shoppingPaymentPerMonth = shoppingPaymentPerWeek * 4;

        // Add details to receipt
        subtotals.push(
          {
            title: this.t('shopping_service_heading'),
            has_details: true,
            details: [
              this.t(
                (shoppingServicePerWeek === 1) ? 'receipt_shopping_service_math_single' : 'receipt_shopping_service_math_multiple',
                {
                  delivery_count_per_week: shoppingServicePerWeek,
                  delivery_count_per_month: shoppingServicePerWeek * 4,
                }
              ),
              this.t(
                'receipt_shopping_service_explanation',
                {
                  first_per_week: formatFinnishEuroCents(parsedSettings.shopping_service_prices.first_per_week),
                  others_per_week: formatFinnishEuroCents(parsedSettings.shopping_service_prices.others_per_week),
                },
              ),
              this.t('receipt_shopping_service_algorithm')
            ],
            sum: this.t('receipt_subtotal_euros_per_month', { value: formatFinnishEuroCents(shoppingPaymentPerMonth) }),
            sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: formatEuroCents(shoppingPaymentPerMonth) }),
          }
        );
      }

      // 7. If meal service is selected, calculate value for it.
      let mealPaymentPerWeek = 0;
      let deliveriesPerWeek = 0;
      let mealPaymentPerMonth = 0;
      if (mealService === '1') {
        // Calculate meal price
        mealPaymentPerWeek = mealServicePerWeek * parsedSettings.meal_service_prices.lunch;


        // Delivery price is based on meal amount per week, either 1 or 2 deliveries
        if (mealServicePerWeek <= parsedSettings.meal_service_prices.max_meals_for_single_delivery_per_week) {
          deliveriesPerWeek = 1;
        } else {
          deliveriesPerWeek = 2;
        }

        mealPaymentPerWeek += deliveriesPerWeek * parsedSettings.meal_service_prices.delivery;
        mealPaymentPerMonth = mealPaymentPerWeek * 4;

        // Add details to receipt
        subtotals.push(
          {
            title: this.t('meal_service_heading'),
            has_details: true,
            details: [
              this.t(
                (mealServicePerWeek === 1) ?
                  'receipt_meal_service_count_single' :
                  'receipt_meal_service_count_multiple',
                {
                  meals_per_week: mealServicePerWeek,
                  meals_per_month: mealServicePerWeek * 4,
                }
              ),
              this.t('receipt_meal_service_price', {
                meal_service_price: formatFinnishEuroCents(parsedSettings.meal_service_prices.lunch),
                meal_deliveries_per_week: deliveriesPerWeek,
                meal_deliveries_per_month: deliveriesPerWeek * 4,
              }),
              this.t(`receipt_meal_service_${deliveriesPerWeek}_delivery_price`, {
                meal_service_delivery_price: formatFinnishEuroCents(parsedSettings.meal_service_prices.delivery),
              }),
            ],
            sum: this.t('receipt_subtotal_euros_per_month', { value: formatFinnishEuroCents(mealPaymentPerMonth) }),
            sum_screenreader: this.t('receipt_subtotal_euros_per_month_screenreader', { value: formatEuroCents(mealPaymentPerMonth) }),
          }
        );
        additionalDetails.push(
          {
            title: this.t('receipt_additional_details'),
            text: this.t('receipt_meal_service_menumat_notice',
              {
                menumat_price: formatFinnishEuroCents(parsedSettings.meal_service_prices.menumat.lunch),
                menumat_device_price: formatFinnishEuroCents(parsedSettings.meal_service_prices.menumat.device_per_day),
              }
            )
          }
        );
      }

      console.log(
          'maximumPayment', maximumPayment,
          '\ngrossIncomeLimit', grossIncomeLimit,
          '\ngrossIncomeLimit', grossIncomeLimit,
          '\npaymentPercentage', paymentPercentage,
          '\nreferencePayment', referencePayment,
          '\n',
          '\npayment', payment,
          '\nsafetyphonePayment', safetyphonePayment,
          '\nshoppingPaymentPerMonth', shoppingPaymentPerMonth, `(${shoppingPaymentPerWeek} € * 4 weeks)`,
          '\nmealPaymentPerMonth', mealPaymentPerMonth, `(${mealPaymentPerWeek} € * 4 weeks)`,
        );

      const sum = payment + safetyphonePayment + shoppingPaymentPerMonth + mealPaymentPerMonth;

      const receiptData = {
        id: this.id,
        title: this.t('receipt_estimate_of_payment'),
        total_prefix: this.t('receipt_family_estimated_payment_prefix'),
        total_value: formatFinnishEuroCents(sum),
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
