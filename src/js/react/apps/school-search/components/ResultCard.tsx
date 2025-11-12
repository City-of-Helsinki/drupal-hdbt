import CardItem from '@/react/common/Card';
import CardImage from '@/react/common/CardImage';
import CardPicture from '@/react/common/CardPicture';
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
    cardImage = (
      <CardPicture imageOverride={imageOverride} title={imageOverride.title} />
    );
  } else if (picture_url?.[0]) {
    cardImage = <CardImage src={picture_url?.[0]} />;
  } else {
    cardImage = undefined; // No image to display
  }

  // biome-ignore lint/suspicious/noImplicitAnyLet: @todo UHF-12501
  let language;

  if (additionalFilters.finnish_education) {
    language = Drupal.t(
      'Finnish',
      {},
      { context: 'School search: language option' },
    );
  }

  if (additionalFilters.swedish_education) {
    const swedish = Drupal.t(
      'Swedish',
      {},
      { context: 'School search: language option' },
    );
    language = language?.length
      ? `${language}, ${swedish.toLowerCase()}`
      : swedish;
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

  const bilingualEducation = ontologyword_ids?.reduce(
    // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12501
    (acc: any, currentItem: any) => {
      if (ontologyDetailsIdsToLang.bilingualEducation[currentItem]) {
        acc.push(ontologyDetailsIdsToLang.bilingualEducation[currentItem]);
      }
      return acc;
    },
    [],
  );

  return (
    <CardItem
      cardDescription={summary_processed?.[0]}
      cardDescriptionHtml
      cardImage={cardImage}
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      language={
        bilingualEducation?.length
          ? `${language}, ${bilingualEducation.join(', ')}`
          : language
      }
      languageLabel={Drupal.t(
        'Language of instruction',
        {},
        { context: 'School search: language options' },
      )}
      location={address?.[0]}
      locationLabel={Drupal.t(
        'Address',
        {},
        { context: 'React search: location label' },
      )}
      weightedEducation={
        ontologyword_details_clarifications?.length
          ? ontologyword_details_clarifications.join(', ')
          : ''
      }
      languageEducation={
        languageEducation?.length ? languageEducation.join(', ') : ''
      }
    />
  );
};

export default ResultCard;
