import { LanguageFilter } from '../../../components/LanguageFilter';

export const InstructionLanguageFilter = () => (
  <LanguageFilter
    includeLanguages={['fi', 'en', 'sv']}
    labelOverride={Drupal.t(
      'Language of instruction',
      {},
      { context: 'Cross-institutional studies: language of instruction filter label' },
    )}
    placeholderOverride={Drupal.t(
      'All languages of instruction',
      {},
      { context: 'Cross-institutional studies: language of instruction filter placeholder' },
    )}
  />
);
