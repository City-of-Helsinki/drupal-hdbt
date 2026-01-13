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

  let languages: string | undefined;
  const currentInterfaceLanguage = getCurrentLanguage(window.drupalSettings.path.currentLanguage);

  // In Finnish and Swedish all languages are written in lowercase. This helper function formats
  // the language names case to match the current interface language.
  const formatLanguages = (existingLanguages: string | undefined, newLanguage: string): string => {
    // In case there is only one language given to the function, just print that language in correct case.
    if (!existingLanguages) {
      return currentInterfaceLanguage !== 'en' ? newLanguage.toLowerCase() : newLanguage;
    }
    // In case there are multiple languages given to the function, separate them by comma and print them in the correct case.
    const formattedExisting = currentInterfaceLanguage !== 'en' ? existingLanguages.toLowerCase() : existingLanguages;
    const formattedNew = currentInterfaceLanguage !== 'en' ? newLanguage.toLowerCase() : newLanguage;
    return `${formattedExisting}, ${formattedNew}`;
  };

  if (additionalFilters.finnish_education) {
    const translatedFinnish = Drupal.t('Finnish', {}, { context: 'School search: language option' });
    languages = formatLanguages('', translatedFinnish);
  }

  if (additionalFilters.swedish_education) {
    const translatedSwedish = Drupal.t('Swedish', {}, { context: 'School search: language option' });
    languages = formatLanguages(languages, translatedSwedish);
  }

  if (additionalFilters.english_education) {
    const translatedEnglish = Drupal.t('English', {}, { context: 'School search: language option' });
    languages = formatLanguages(languages, translatedEnglish);
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
      language={bilingualEducation?.length ? formatLanguages(languages, bilingualEducation.join(', ')) : languages}
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
