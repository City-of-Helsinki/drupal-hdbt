function getFormData(id, t) {
  return {
    form_id: id,
    has_required_fields: true,
    items: [
      {
        input_integer: {
          id: 'household_size',
          label: t('household_size'),
          unit: t('unit_person'),
          min: 1,
          size: 2,
          required: true,
          helper_text: t('household_size_explanation'),
        },
      },
      {
        input_float: {
          id: 'gross_income_per_month',
          label: t('gross_income_per_month'),
          unit: t('unit_euro'),
          min: 0,
          size: 8,
          required: true,
          strip: '[€eE ]',
          helper_text: t('gross_income_per_month_explanation'),
        },
      },
      {
        input_integer: {
          id: 'monthly_usage',
          label: t('monthly_usage'),
          unit: t('unit_hour'),
          min: 0,
          max: 744, // Mathematical max hours: 31 days * 24 hours = 744 hours per month
          size: 3,
          required: true,
          helper_text: t('monthly_usage_explanation'),
        },
      },
      {
        input_float: {
          id: 'service_provider_price',
          label: t('service_provider_price'),
          unit: t('unit_euro'),
          min: 0,
          size: 6,
          required: true,
          strip: '[€eE ]',
          helper_text: t('service_provider_price_explanation'),
        },
      },
    ]
  };
}

export default { getFormData };
