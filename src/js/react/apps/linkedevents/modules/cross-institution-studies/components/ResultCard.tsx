import CardItem from '@/react/common/Card';
import type { ResultCardProps } from '../../../components/ResultCard';
import { useAtomValue } from 'jotai';
import { baseUrlAtom } from '../../../store';
import { useResultCardProps } from '../../../hooks/useResultCardProps';
import { TeachingModes } from '../../enum/TeachingModes';
import { LanguageOptions } from '../../../enum/LanguageOptions';

export const ResultCard = (props: ResultCardProps) => {
  const { cardTitle, location, time } = useResultCardProps(props);
  const { id, name, keywords, in_language } = props;
  const baseUrl = useAtomValue(baseUrlAtom);
  const { currentLanguage } = drupalSettings.path;

  const getUrl = () => {
    const resolvedLanguage = name?.[currentLanguage] ? currentLanguage : 'fi';

    let courseParam = '';
    switch (resolvedLanguage) {
      case 'fi':
        courseParam = 'ristiinopiskelu';
        break;
      case 'sv':
        courseParam = 'kosstudier';
        break;
      default:
        courseParam = 'cross-institutional-studies';
    }

    return `${baseUrl}/${resolvedLanguage}/${courseParam}/${id}`;
  };

  const getTheme = () => {
    const matched: string[] = [];

    for (const keyword of keywords ?? []) {
      const key = '@id' in keyword ? /\/([^/]+)\/?$/.exec(keyword['@id'])?.[1] : undefined;
      if (key && TeachingModes.has(key)) {
        matched.push(TeachingModes.get(key)?.toLowerCase() || '');
      }
    }

    return matched.join(', ');
  };

  const getLanguage = () => {
    const allowedLanguages = new Set(['fi', 'sv', 'en'] as const);
    const matched: string[] = [];

    for (const lang of in_language ?? []) {
      const key = '@id' in lang ? /\/([^/?]+)\/?(?:\?.*)?$/.exec(lang['@id'])?.[1] : undefined;
      if (key && allowedLanguages.has(key as 'fi' | 'sv' | 'en') && key in LanguageOptions) {
        matched.push(LanguageOptions[key as keyof typeof LanguageOptions]?.toLowerCase() || '');
      }
    }

    return matched.join(', ');
  };

  return (
    <CardItem
      language={getLanguage()}
      languageLabel={Drupal.t('Language of instruction', {}, { context: 'Cross institutional studies search' })}
      theme={getTheme()}
      themeLabel={Drupal.t('Mode of teaching', {}, { context: 'Cross institutional studies search' })}
      cardUrl={getUrl()}
      {...{
        cardTitle,
        location,
        time,
      }}
    />
  );
};
