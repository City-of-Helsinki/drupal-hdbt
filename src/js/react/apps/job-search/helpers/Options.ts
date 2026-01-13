import type OptionType from '../types/OptionType';

export const sortOptions = (a: OptionType, b: OptionType) => {
  const aCount = a?.count || 0;
  const bCount = b?.count || 0;

  if (aCount < bCount) {
    return 1;
  }

  if (aCount > bCount) {
    return -1;
  }

  return 0;
};

/**
 * Strips quantity information from option labels.
 *
 * As in "Engineering (23)" becomes "Engineering"
 */
export const stripQuantityFromLabel = (label: string) => {
  return label.replace(/\s\(\d+\)$/, '');
};

export const getCheckBoxFilterLabel = (value: string) => {
  switch (value) {
    case 'continuous':
      return Drupal.t('Open-ended vacancies', {}, { context: 'Job search' });
    case 'internship':
      return Drupal.t('Practical training', {}, { context: 'Job search' });
    case 'summer_jobs':
      return Drupal.t('Summer jobs', {}, { context: 'Job search' });
    case 'youth_summer_jobs':
      return Drupal.t('Summer jobs for young people', {}, { context: 'Job search' });
    default:
      return value;
  }
};
