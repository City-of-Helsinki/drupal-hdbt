import OptionType from '../types/OptionType';

export const getLanguageLabel = (key: string) => {
  switch (key.toString()) {
    case 'fi':
      return Drupal.t('Finnish', {}, {context: 'Job search languages'});
    case 'sv':
      return Drupal.t('Swedish', {}, {context: 'Job search languages'});
    case 'en':
      return Drupal.t('English', {}, {context: 'Job search languages'});
    default:
      return Drupal.t('Finnish', {}, {context: 'Job search languages'});
  }
};

export const getInitialLanguage = (key: string[] | string = '', options: OptionType[] = []) => options.find((option: OptionType) => option?.value === key.toString()) || null;
