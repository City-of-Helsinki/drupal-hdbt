import form from './_form';
import translations from './_translations';

class HelsinkiBenefitAmountEstimate {
  constructor(id, settings) {
    this.id = id;
    const config = JSON.parse(settings);
    
    const checkConfiguration =  () => {
      const NEEDED_CONFIG_KEYS = [
        'HELSINKI_BENEFIT_MAX_AMOUNT_WITH_PAY_SUBSIDY',
        'HELSINKI_BENEFIT_MAX_AMOUNT_WITHOUT_PAY_SUBSIDY',
        'PAY_SUBSIDY_PERCENTAGES',
        'PAY_SUBSIDY_AMOUNT_MAX_LIMIT',
        'STATE_AID_PERCENTAGES',
        'SALARY_OTHER_EXPENSES_PERCENTAGE'
      ];
      if(!NEEDED_CONFIG_KEYS.every((setting) => 
          Object.keys(config).includes(setting)
      )) {
        // eslint-disable-next-line no-console
        console.error('Missing Drupal settings. Calculator won´t work!');
      }
      
      if(config.PAY_SUBSIDY_PERCENTAGES[0] !== 0) {
        // eslint-disable-next-line no-console
        console.error('First index of setting PAY_SUBSIDY_PERCENTAGES must be 0!');
      }
      
      if(config.PAY_SUBSIDY_AMOUNT_MAX_LIMIT[0] !== 999999) {
        // eslint-disable-next-line no-console
        console.error('First index of setting PAY_SUBSIDY_AMOUNT_MAX_LIMIT must be 999999!');
      }
    };
    
    checkConfiguration();
    
    const getFormData = () => form.getFormData(this.id, this.t, config);
    
    const isEmployeeAssociation = () => 
      this.calculator.getFieldValue('company_type') === 'association';
    
    const isEmployeeBusiness = () => 
      this.calculator.getFieldValue('company_type') === 'business';
    
    const hasBusinessActivities = () => 
      isEmployeeAssociation() && this.calculator.getFieldValue('association_has_business_activities');
    
    const getMonthlyPay = () => 
      parseInt(this.calculator.getFieldValue('monthly_pay'), 10);
    
    const getVacationMoney = () => {
      const vacationMoney = parseInt(this.calculator.getFieldValue('vacation_money'), 10);
      return Number.isNaN(vacationMoney) ? 0 : vacationMoney;
    };
    
    const setVacationMoneyMax = () => {
      this.calculator.getElement('vacation_money').dataset.max = Math.floor(getMonthlyPay() / 2 / 11);
    };
    
    const getOtherExpenses = () => 
      config.SALARY_OTHER_EXPENSES_PERCENTAGE * getMonthlyPay();

    const getSalaryWithExpenses = () => 
      [
        getMonthlyPay(),
        getVacationMoney(),
      ].reduce(
        (acc, value) => parseInt(acc, 10) + parseInt(value, 10),
        getOtherExpenses()
      );
    
    const isPaySubsidyGranted = () =>
      this.calculator.getFieldValue('pay_subsidy_granted') === 'pay_subsidy_granted_true';
    
    const getPaySubsidyPercentageOption = () => 
      this.calculator.getFieldValue('pay_subsidy_percentage') || 0;
    
    const getPaySubsidyPercentage = () => {
      const valuePaySubsidyPercentage = getPaySubsidyPercentageOption();
      return isPaySubsidyGranted() ? config.PAY_SUBSIDY_PERCENTAGES[valuePaySubsidyPercentage] : config.PAY_SUBSIDY_PERCENTAGES[0];
    };
    
    const getPaySubsidyAmount = () => {
      const getLimitedPaySubsidyAmount = (paySubsidyPercentage, paySubsidyAmount) => {
        const index = getPaySubsidyPercentageOption();
        if (paySubsidyPercentage === config.PAY_SUBSIDY_PERCENTAGES[index])
          return Math.min(paySubsidyAmount, config.PAY_SUBSIDY_AMOUNT_MAX_LIMIT[index]);
        return paySubsidyAmount;
      };
      const paySubsidyAmount = isPaySubsidyGranted() ? getPaySubsidyPercentage() * getMonthlyPay() : 0;
      return isPaySubsidyGranted() ? getLimitedPaySubsidyAmount(getPaySubsidyPercentage(), paySubsidyAmount) : 0;
    };
    
    const getStateAidPercentage = () => {
      const paySubsidyPercentage = getPaySubsidyPercentage();
      // Associations with business activities are treated like businesses
      if(isEmployeeBusiness() || hasBusinessActivities()) {
        // No pay subsidy, get lower state aid percentage
        if(!isPaySubsidyGranted()) {
          return config.STATE_AID_PERCENTAGES[1];
        }
        if(paySubsidyPercentage === config.PAY_SUBSIDY_PERCENTAGES[1]){
          return config.STATE_AID_PERCENTAGES[1];
        }
        if(paySubsidyPercentage === config.PAY_SUBSIDY_PERCENTAGES[2]){
          return config.STATE_AID_PERCENTAGES[2];
        };
      }
      // Associations always get the highest state aid percentage
      return config.STATE_AID_PERCENTAGES[0];
    };
    
    const getStateAidAmount = () => 
      getStateAidPercentage() * getSalaryWithExpenses();
    
    const getHelsinkiBenefitAmount = () => 
      getStateAidAmount() - getPaySubsidyAmount();
    
    const togglePaySubsidyPercentageGroup = (showPercentageGroup = false) => {
      if (showPercentageGroup) {
        this.calculator.showGroup('pay_subsidy_granted_group');
        // Pre-select the first radio button for percentage option if pay subsidy is selected
        if (!this.calculator.getElement('pay_subsidy_percentage').querySelectorAll('input[type="radio"]:checked').length) {
          this.calculator.getElement('pay_subsidy_percentage_1').checked = true;
        }
      } else {
        this.calculator.hideGroup('pay_subsidy_granted_group');
        this.calculator.getElement('pay_subsidy_percentage_1').checked = false;
        this.calculator.getElement('pay_subsidy_percentage_2').checked = false;
      }
    };

    const formatCurrency = (number) => 
      this.calculator.formatFinnishEuroCents(number);

    const debugUpdate = () => {
      if (process.env.NODE_ENV === 'development') {
        const data = {
          isEmployeeAssociation: isEmployeeAssociation(),
          isEmployeeBusiness: isEmployeeBusiness(),
          hasBusinessActivities: hasBusinessActivities(),
          monthlyPay: getMonthlyPay(),
          vacationMoney: getVacationMoney(),
          otherExpenses: getOtherExpenses(),
          allExpenses: getSalaryWithExpenses(),
          isPaySubsidyGranted: isPaySubsidyGranted(),
          paySubsidyAmount: getPaySubsidyAmount(),
          paySubsidyPercentage: getPaySubsidyPercentage(),
          stateAidPercentage: getStateAidPercentage(),
          stateAidAmount: getStateAidAmount(),
          helsinkiBenefitAmount: getHelsinkiBenefitAmount()
        };
        // eslint-disable-next-line no-console
        console.log('\n\n###################');
        Object.keys(data).forEach(key => {
          const value = data[key];
          // eslint-disable-next-line no-console
          console.log(key, value);
        });
      }
    };
    
    const update = () => {
      if (isEmployeeAssociation()) {
        this.calculator.showGroup('association_has_business_activities_true_group');
      } else {
        this.calculator.hideGroup('association_has_business_activities_true_group');
      }
      
      if (getMonthlyPay() > 0) {
        setVacationMoneyMax();
      }
      
      togglePaySubsidyPercentageGroup(isPaySubsidyGranted());
      
      debugUpdate();
    };
    
    const validate = () => {
      const errorMessages = [];
      
      errorMessages.push(...this.calculator.validateBasics('company_type'));
      errorMessages.push(...this.calculator.validateBasics('monthly_pay'));
      errorMessages.push(...this.calculator.validateBasics('vacation_money'));
      errorMessages.push(...this.calculator.validateBasics('pay_subsidy_granted'));
      
      // Pay subsidy percentage is only required when pay subsidy is granted
      if(isPaySubsidyGranted()) {
        errorMessages.push(...this.calculator.validateBasics('pay_subsidy_percentage'));
      }
      
      if (errorMessages.length) {
        return {
          error: {
            title: this.t('missing_input'),
            message: errorMessages
          },
        };
      }
      const helsinkiBenefitResult = getHelsinkiBenefitAmount();

      if (Number.isNaN(helsinkiBenefitResult)) {
        return {
          error: {
            title: this.t('error_calculation_title'),
            message: this.t('error_calculation_message')
          }
        };
      }
      
      const subtotals = {
        title: this.t('subtotal_title'),
        has_details: true,
        details: [
          this.t('subtotal_details_1', {value: formatCurrency(getMonthlyPay())}),
          this.t('subtotal_details_2', {value: formatCurrency(getVacationMoney())}),
          this.t('subtotal_details_3', {value: formatCurrency(getOtherExpenses()), percentage: config.SALARY_OTHER_EXPENSES_PERCENTAGE * 100}),
        ],
      };
      
      if(isPaySubsidyGranted()) {
        subtotals.details.push(this.t('subtotal_details_4', {value: getPaySubsidyPercentage() * 100}));
      }
      
      
      const receiptData = {
        id: this.id,
        title: this.t('total_title'),
        total_prefix: this.t('total_prefix'),
        // Total value is always at least zero but no more than HELSINKI_BENEFIT_MAX_AMOUNT_W...
        total_value: formatCurrency(
          Math.max(0,
            Math.min(
              helsinkiBenefitResult,
              isPaySubsidyGranted() ? 
                config.HELSINKI_BENEFIT_MAX_AMOUNT_WITH_PAY_SUBSIDY : config.HELSINKI_BENEFIT_MAX_AMOUNT_WITHOUT_PAY_SUBSIDY)
          )
        ),
        total_suffix: this.t('total_suffix'),
        total_explanation: this.t('total_explanation'),
        hr: true,
        breakdown: [
          {
            title: this.t('breakdown_title'),
            subtotals,
          },
          {
            title: null,
            subtotals: {
              title: this.t('additional_details_title'),
              has_details: true,
              details: [
                this.t('additional_details_text_1'),
                this.t('additional_details_text_2'),
              ]
            }
          }
        ],
      };
      
      const receipt = this.calculator.getPartialRender(
        '{{>receipt}}',
        receiptData,
      );
      
      return {
        receipt,
        ariaLive: this.t('receipt_aria_live', { payment: 1234 }),
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
      },
      change: () => {
        update();
      },
      reset: () => {
        window.setTimeout(update, 1);
        this.calculator.clearResult();
        this.calculator.showAriaLiveText(this.t('reset_aria_live'));
      },
    };
    
    // Prepare calculator for translations
    this.calculator = window.HelfiCalculator({ name: 'helsinki_benefit_amount_estimate', translations });
    
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
window.helfi_calculator.helsinki_benefit_amount_estimate = (id, settings) => new HelsinkiBenefitAmountEstimate(id, settings);
