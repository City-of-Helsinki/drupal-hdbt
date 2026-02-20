import { optionDefaults } from '../../enum/OptionDefaults';

type SortOption = 'name' | 'start_time';

export const SortOptions: SortOption[] = ['name', 'start_time'];

export const sortOptions = SortOptions.map((option) => {
  let label = '';

  switch (option) {
    case 'name':
      label = Drupal.t('Alphabetical order', {}, { context: 'Cross-institutional studies: sort option' });
      break;
    case 'start_time':
      label = Drupal.t('Start time', {}, { context: 'Cross-institutional studies: start time filter label' });
      break;
  }

  return {
    ...optionDefaults,
    label,
    value: option,
  };
});
