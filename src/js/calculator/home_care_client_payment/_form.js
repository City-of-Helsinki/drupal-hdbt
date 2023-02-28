function getFormData(id, t) {
  return {
    form_id: id,
    has_required_fields: true,
    items: [
      {
        heading: {
          text: t('family_info'),
          level: 3,
        }
      },
      {
        input_integer: {
          id: 'household_size',
          label: t('household_size'),
          unit: t('unit_person'),
          min: 2,
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
          size: 8,
          // maxlength: 999,
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
          // min: 2,
          size: 2,
          required: true,
          helper_text: t('monthly_usage_explanation'),
        },
      },
      {
        heading: {
          text: t('living_at_home_heading'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('living_at_home_paragraph'),
        }
      },
      {
        heading: {
          text: t('safetyphone_heading'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('safetyphone_paragraph'),
        }
      },
      {
        radio: {
          id: 'safetyphone',
          label: t('safetyphone'),
          required: true,
          radio_items: [
            {
              name: 'safetyphone',
              item_id: 'safetyphone_1',
              label: t('yes_calculate'),
              value: 1,
            },
            {
              name: 'safetyphone',
              item_id: 'safetyphone_2',
              label: t('no'),
              value: 2,
            },
          ],
        },
      },
      {
        heading: {
          text: t('shopping_service_heading'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('shopping_service_paragraph'),
        }
      },
      {
        radio: {
          id: 'shopping_service',
          label: t('shopping_service'),
          required: true,
          radio_items: [
            {
              name: 'shopping_service',
              item_id: 'shopping_service_1',
              label: t('yes_calculate'),
              value: 1,
            },
            {
              name: 'shopping_service',
              item_id: 'shopping_service_2',
              label: t('no'),
              value: 2,
            },
          ],
        },
      },
      {
        group: {
          id: 'shopping_service_group',
          hide_group: true,
          items: [
            {
              input_integer: {
                id: 'shopping_service_per_week',
                label: t('shopping_service_per_week'),
                unit: t('unit_amount'),
                min: 1,
                // max: 12,
                size: 2,
                required: true,
                helper_text: t('shopping_service_per_week_explanation'),
              },
            },
          ],
        },
      },
      {
        heading: {
          text: t('meal_service_heading'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('meal_service_paragraph'),
        }
      },
      {
        radio: {
          id: 'meal_service',
          label: t('meal_service'),
          required: true,
          radio_items: [
            {
              name: 'meal_service',
              item_id: 'meal_service_1',
              label: t('yes_calculate'),
              value: 1,
            },
            {
              name: 'meal_service',
              item_id: 'meal_service_2',
              label: t('no'),
              value: 2,
            },
          ],
        },
      },
      {
        group: {
          id: 'meal_service_group',
          hide_group: true,
          items: [
            {
              input_integer: {
                id: 'meal_service_per_week',
                label: t('meal_service_per_week'),
                unit: t('unit_amount'),
                min: 1,
                // max: 12,
                size: 2,
                required: true,
                helper_text: t('meal_service_per_week_explanation'),
              },
            },
          ],
        },
      },
    ]
  };
}

export default { getFormData };
