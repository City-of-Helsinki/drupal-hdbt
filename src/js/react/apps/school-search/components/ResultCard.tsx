import CardItem from '@/react/common/Card';
import CardImage from '@/react/common/CardImage';
import CardPicture from '@/react/common/CardPicture';
import { getCurrentLanguage } from '@/react/common/helpers/GetCurrentLanguage';
import ontologyDetailsIdsToLang from '../enum/LanguageEducationMap';
import type { School } from '../types/School';

const ResultCard = ({
  additional_filters,
  address,
  summary_processed,
  name,
  name_override,
  ontologyword_details_clarifications,
  ontologyword_ids,
  picture_url,
  media_as_objects,
  url,
}: School) => {
  const title = name_override?.[0] || name?.[0];
  const imageOverride = media_as_objects?.[0].picture_url_override;
  const additionalFilters = additional_filters[0];

  if (!title) {
    return null;
  }

  type CardImageType = JSX.Element | undefined;
  let cardImage: CardImageType;

  if (imageOverride) {
    cardImage = <CardPicture imageOverride={imageOverride} title={imageOverride.title} />;
  } else if (picture_url?.[0]) {
    cardImage = <CardImage src={picture_url?.[0]} />;
  } else {
    cardImage = undefined; // No image to display
  }

  let language: string | undefined;
  const currentLanguage = getCurrentLanguage(window.drupalSettings.path.currentLanguage);

  // In Finnish and Swedish languages are written in lowercase. This helper function formats
  // the language string to match the current language.
  const formatLanguage = (existingLang: string | undefined, newLang: string): string => {
    if (!existingLang) {
      return currentLanguage === 'fi' || currentLanguage === 'sv' ? newLang.toLowerCase() : newLang;
    }
    const formattedExisting =
      currentLanguage === 'fi' || currentLanguage === 'sv' ? existingLang.toLowerCase() : existingLang;
    const formattedNew = currentLanguage === 'fi' || currentLanguage === 'sv' ? newLang.toLowerCase() : newLang;
    return `${formattedExisting}, ${formattedNew}`;
  };

  if (additionalFilters.finnish_education) {
    const translatedFinnish = Drupal.t('Finnish', {}, { context: 'School search: language option' });
    language = formatLanguage(language, translatedFinnish);
  }

  if (additionalFilters.swedish_education) {
    const translatedSwedish = Drupal.t('Swedish', {}, { context: 'School search: language option' });
    language = formatLanguage(language, translatedSwedish);
  }

  if (additionalFilters.english_education) {
    const translatedEnglish = Drupal.t('English', {}, { context: 'School search: language option' });
    language = formatLanguage(language, translatedEnglish);
  }

  let languageEducation = ontologyword_ids?.reduce(
    // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
    (acc: any, currentItem: any) => {
      (['a1', 'a2', 'b1', 'b2'] as const).forEach((option) => {
        if (ontologyDetailsIdsToLang[option][currentItem]) {
          acc.push(ontologyDetailsIdsToLang[option][currentItem]);
        }
      });
      return acc;
    },
    [],
  );

  // Remove duplicates.
  languageEducation = [...new Set(languageEducation)];

  let bilingualEducation = ontologyword_ids?.reduce(
    // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
    (acc: any, currentItem: any) => {
      if (ontologyDetailsIdsToLang.bilingualEducation[currentItem]) {
        acc.push(ontologyDetailsIdsToLang.bilingualEducation[currentItem]);
      }
      return acc;
    },
    [],
  );

  // Remove duplicates.
  bilingualEducation = [...new Set(bilingualEducation)];

  return (
    <CardItem
      cardDescription={summary_processed?.[0]}
      cardDescriptionHtml
      cardImage={cardImage}
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      language={bilingualEducation?.length ? formatLanguage(language, bilingualEducation.join(', ')) : language}
      languageLabel={Drupal.t('Language of instruction', {}, { context: 'School search: language options' })}
      location={address?.[0]}
      locationLabel={Drupal.t('Address', {}, { context: 'React search: location label' })}
      weightedEducation={
        ontologyword_details_clarifications?.length ? ontologyword_details_clarifications.join(', ') : ''
      }
      languageEducation={languageEducation?.length ? languageEducation.join(', ') : ''}
    />
  );
};

export default ResultCard;
