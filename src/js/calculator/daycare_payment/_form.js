
// The following getFormData uses dynamic children, so we need to define them first.
const dynamicChildData = (childNumber, t) => {
  const child = {
    id: `child_${childNumber}`,
    slotNumber: childNumber,
    items: [
      {
        heading: {
          text: (childNumber === 1) ? t('youngest_child_title') : t('nth_child_title', { childNumber }),
          level: 4,
        }
      },
      {
        radio: {
          id: `daycare_type_for_child_${childNumber}`,
          label: t('daycare_type'),
          required: true,
          radio_items: [
            {
              name: `daycare_type_for_child_${childNumber}`,
              item_id: `daycare_type_for_child_${childNumber}_1`,
              label: t('daycare_type_1'),
              value: 1,
            },
            {
              name: `daycare_type_for_child_${childNumber}`,
              item_id: `daycare_type_for_child_${childNumber}_2`,
              label: t('daycare_type_2'),
              value: 2,
            },
            {
              name: `daycare_type_for_child_${childNumber}`,
              item_id: `daycare_type_for_child_${childNumber}_3`,
              label: t('daycare_type_3'),
              value: 3,
            },
            {
              name: `daycare_type_for_child_${childNumber}`,
              item_id: `daycare_type_for_child_${childNumber}_4`,
              label: t('daycare_type_4'),
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
              paragraph: {
                text: t('daycare_type_1_explanation'),
              }
            },
            {
              radio: {
                id: `daycare_type_1_${childNumber}_group_caretime`,
                label: t('daycare_type_1_caretime'),
                required: true,
                radio_items: [
                  {
                    name: `daycare_type_1_${childNumber}_group_caretime`,
                    item_id: `daycare_type_1_${childNumber}_group_caretime_1`,
                    label: t('daycare_type_1_caretime_1'),
                    value: 1,
                  },
                  {
                    name: `daycare_type_1_${childNumber}_group_caretime`,
                    item_id: `daycare_type_1_${childNumber}_group_caretime_2`,
                    label: t('daycare_type_1_caretime_2'),
                    value: 2,
                  },
                  {
                    name: `daycare_type_1_${childNumber}_group_caretime`,
                    item_id: `daycare_type_1_${childNumber}_group_caretime_3`,
                    label: t('daycare_type_1_caretime_3'),
                    value: 3,
                  },
                ],
              },
            },
            {
              input_integer: {
                id: `daycare_type_1_${childNumber}_free_days`,
                label: t('daycare_free_days'),
                unit: t('unit_day'),
                min: 0,
                max: 12,
                size: 2,
                required: false,
                helper_text: t('daycare_free_days_explanation'),
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
              paragraph: {
                text: t('daycare_type_2_explanation'),
              }
            },
            {
              radio: {
                id: `daycare_type_2_${childNumber}_group_caretime`,
                label: t('daycare_type_2_caretime'),
                required: true,
                radio_items: [
                  {
                    name: `daycare_type_2_${childNumber}_group_caretime`,
                    item_id: `daycare_type_2_${childNumber}_group_caretime_1`,
                    label: t('daycare_type_2_caretime_1'),
                    value: 1,
                  },
                  {
                    name: `daycare_type_2_${childNumber}_group_caretime`,
                    item_id: `daycare_type_2_${childNumber}_group_caretime_2`,
                    label: t('daycare_type_2_caretime_2'),
                    value: 2,
                  },
                  {
                    name: `daycare_type_2_${childNumber}_group_caretime`,
                    item_id: `daycare_type_2_${childNumber}_group_caretime_3`,
                    label: t('daycare_type_2_caretime_3'),
                    value: 3,
                  },
                  {
                    name: `daycare_type_2_${childNumber}_group_caretime`,
                    item_id: `daycare_type_2_${childNumber}_group_caretime_4`,
                    label: t('daycare_type_2_caretime_4'),
                    value: 4,
                  },
                ],
              },
            },
            {
              input_integer: {
                id: `daycare_type_2_${childNumber}_free_days`,
                label: t('daycare_free_days'),
                unit: t('unit_day'),
                min: 0,
                max: 12,
                size: 2,
                required: false,
                helper_text: t('daycare_free_days_explanation'),
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
              paragraph: {
                text: t('daycare_type_3_explanation'),
              }
            },
            {
              radio: {
                id: `daycare_type_3_${childNumber}_group_caretime`,
                label: t('daycare_type_3_caretime'),
                required: true,
                radio_items: [
                  {
                    name: `daycare_type_3_${childNumber}_group_caretime`,
                    item_id: `daycare_type_3_${childNumber}_group_caretime_1`,
                    label: t('daycare_type_3_caretime_1'),
                    value: 1,
                  },
                  {
                    name: `daycare_type_3_${childNumber}_group_caretime`,
                    item_id: `daycare_type_3_${childNumber}_group_caretime_2`,
                    label: t('daycare_type_3_caretime_2'),
                    value: 2,
                  },
                  {
                    name: `daycare_type_3_${childNumber}_group_caretime`,
                    item_id: `daycare_type_3_${childNumber}_group_caretime_3`,
                    label: t('daycare_type_3_caretime_3'),
                    value: 3,
                  },
                  {
                    name: `daycare_type_3_${childNumber}_group_caretime`,
                    item_id: `daycare_type_3_${childNumber}_group_caretime_4`,
                    label: t('daycare_type_3_caretime_4'),
                    value: 4,
                  },
                ],
              },
            },
            {
              input_integer: {
                id: `daycare_type_3_${childNumber}_free_days`,
                label: t('daycare_free_days'),
                unit: t('unit_day'),
                min: 0,
                max: 12,
                size: 2,
                required: false,
                helper_text: t('daycare_free_days_explanation'),
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
              paragraph: {
                text: t('daycare_type_4_explanation'),
              }
            },
            {
              radio: {
                id: `daycare_type_4_${childNumber}_group_caretime`,
                label: t('daycare_type_4_caretime'),
                required: true,
                radio_items: [
                  {
                    name: `daycare_type_4_${childNumber}_group_caretime`,
                    item_id: `daycare_type_4_${childNumber}_group_caretime_1`,
                    label: t('daycare_type_4_caretime_1'),
                    value: 1,
                  },
                  {
                    name: `daycare_type_4_${childNumber}_group_caretime`,
                    item_id: `daycare_type_4_${childNumber}_group_caretime_2`,
                    label: t('daycare_type_4_caretime_2'),
                    value: 2,
                  },
                  {
                    name: `daycare_type_4_${childNumber}_group_caretime`,
                    item_id: `daycare_type_4_${childNumber}_group_caretime_3`,
                    label: t('daycare_type_4_caretime_3'),
                    value: 3,
                  },
                ],
              },
            },
            {
              checkbox: {
                id: `daycare_type_4_${childNumber}_has_preschool`,
                label: t('daycare_has_preschool'),
              }
            },
          ],
        },
      },
    ],
  };
  if (childNumber !== 1) {
    child.remove_label = t('remove_child');
  }
  return child;
};

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
          required: false,
          strip: '[€eE ]',
          helper_text: t('gross_income_per_month_explanation'),
        },
      },
      {
        heading: {
          text: t('child_info'),
          level: 3,
        }
      },
      {
        paragraph: {
          text: t('child_info_paragraph'),
        }
      },
      {
        dynamic_area: {
          id: 'first_child',
          dynamic_slots: [
            dynamicChildData(1, t),
          ],
        },
      },
      {
        dynamic_area: {
          id: 'nth_child',
          add_button_label: t('add_next_child'),
          dynamic_slots: [
            // dynamicChildData(2, t),
            // dynamicChildData(3, t),
          ],
        },
      },
      {
        hr: {},
      },
    ]
  };
}

export default { getFormData, dynamicChildData };
