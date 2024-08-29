function getFormData(id, t, config) {
  return {
    form_id: id,
    has_required_fields: true,
    items: [
      {
        heading: {
          text: t('heading_employer'),
          level: 3,
        }
      },
      {
        radio: {
          id: 'company_type',
          label: t('label_company_type'),
          required: true,
          radio_items: [
            {
              name: 'company_type',
              item_id: 'company_type_business',
              label: t('label_company_type_business'),
              value: 'business',
            },
            {
              name: 'company_type',
              item_id: 'company_type_association',
              label: t('label_company_type_association'),
              value: 'association',
            },
          ],
        },
      },

      {
        group: {
          id: 'association_has_business_activities_true_group',
          hide_group: true,
          items: [
            {
              paragraph: {
                text: ''
              }
            },
            {
              checkbox: {
                id: 'association_has_business_activities',
                label: t('label_association_has_business_activities'),
                helper_text: t('association_has_business_activities_text'),

              },
            },
          ],
        },
      },
      {
        heading: {
          text: t('heading_employee'),
          level: 3,
        }
      },
      {
        input_integer: {
          id: 'monthly_pay',
          label: t('label_monthly_pay'),
          unit: t('unit_euro'),
          min: 0,
          max: 10000,
          size: 12,
          required: true,
          strip: '[€eE ]',
          helper_text: t('monthly_pay_helper_text'),
          // value: 2000, // TODO: remove after debug
        },
      },
      {
        input_integer: {
          id: 'vacation_money',
          label: t('label_vacation_money'),
          unit: t('unit_euro'),
          min: 0,
          max: 454, // Vacation money per month is half monthly_pay divided with 11 months; also adjusted in code when monthly_pay changes
          size: 12,
          required: false,
          strip: '[€eE ]',
          helper_text: t('vacation_money_helper_text'),
          // value: 40, // TODO: remove after debug
        },
      },
      // {
      //   input_integer: {
      //     id: 'other_expenses',
      //     label: t('label_other_expenses'),
      //     unit: t('unit_euro'),
      //     min: 0,
      //     size: 12,
      //     required: true,
      //     strip: '[€eE ]',
      //     helper_text: t('other_expenses_helper_text'),
      //   },
      // },
      {
        heading: {
          text: t('heading_pay_subsidy_information'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('text_pay_subsidy_information')
        }
      },
      {
        radio: {
          id: 'pay_subsidy_granted',
          label: t('label_pay_subsidy_granted'),
          required: true,
          radio_items: [
            {
              name: 'pay_subsidy_granted',
              item_id: 'pay_subsidy_granted_false',
              label: t('label_pay_subsidy_false'),
              value: 'pay_subsidy_granted_false',
            },
            {
              name: 'pay_subsidy_granted',
              item_id: 'pay_subsidy_granted_true',
              label: t('label_pay_subsidy_true'),
              value: 'pay_subsidy_granted_true',
            },
          ]
        }
      },
      {
        group: {
          id: 'pay_subsidy_granted_group',
          hide_group: true,
          items: [
            {
              radio: {
                id: 'pay_subsidy_percentage',
                label: t('label_pay_subsidy_percentage'),
                required: true,
                helper_text: t('helper_text_pay_subsidy_percentage'),
                radio_items: [
                  {
                    name: 'pay_subsidy_percentage',
                    item_id: 'pay_subsidy_percentage_1',
                    label: t('label_pay_subsidy_percentage_1', {value: config.PAY_SUBSIDY_PERCENTAGES[1] * 100}),
                    value: 1,
                  },
                  {
                    name: 'pay_subsidy_percentage',
                    item_id: 'pay_subsidy_percentage_2',
                    label: t('label_pay_subsidy_percentage_2', {value: config.PAY_SUBSIDY_PERCENTAGES[2] * 100}),
                    value: 2,
                  },
                ],
              },
            },
          ],
        },
      },
    ]
  };
}

export default { getFormData };
