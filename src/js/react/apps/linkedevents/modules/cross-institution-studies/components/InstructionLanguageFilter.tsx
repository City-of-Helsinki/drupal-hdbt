import { LanguageFilter } from '../../../components/LanguageFilter';
import { InstructionLanguages } from '../../enum/InstructionLanguages';

export const InstructionLanguageFilter = () => (
  <LanguageFilter
    includeLanguages={['fi', 'en', 'sv']}
    languageLabels={InstructionLanguages}
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
