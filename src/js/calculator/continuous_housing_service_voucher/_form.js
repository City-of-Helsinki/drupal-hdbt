function getFormData(id, t) {
  return {
    form_id: id,
    has_required_fields: true,
    items: [
      {
        input_float: {
          id: 'net_income_per_month',
          label: t('net_income_per_month'),
          unit: t('unit_euro'),
          min: 0,
          size: 8,
          required: true,
          strip: '[€eE ]',
          helper_text: t('net_income_per_month_explanation'),
        },
      },
      {
        input_float: {
          id: 'service_provider_price',
          label: t('service_provider_price'),
          unit: t('unit_euro'),
          min: 0,
          size: 8,
          required: true,
          strip: '[€eE ]',
          helper_text: t('service_provider_price_explanation'),
        },
      },
    ]
  };
}

export default { getFormData };
