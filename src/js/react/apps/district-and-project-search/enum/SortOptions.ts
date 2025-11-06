import type OptionType from '../types/OptionType';

const SortOptions: OptionType[] = [
  {
    label: Drupal.t('Most relevant first', {}, { context: 'District and project search sort option' }),
    value: 'most_relevant',
  },
  {
    label: Drupal.t('Alphabetical @AO', { '@AO': 'A-Ö' }, { context: 'District and project search sort option' }),
    value: 'asc',
  },
  {
    label: Drupal.t('Alphabetical @OA', { '@OA': 'Ö-A' }, { context: 'District and project search sort option' }),
    value: 'desc',
  },
];

export default SortOptions;
