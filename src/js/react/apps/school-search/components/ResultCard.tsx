import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import CardImage from '@/react/common/CardImage';
import { School } from '../types/School';
import ontologyDetailsIdsToLang from '../enum/LanguageEducationMap';

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
  url
}: School) => {
  const title = name_override?.[0] || name?.[0];
  const imageOverride = media_as_objects?.[0].picture_url_override;
  const additionalFilters = additional_filters[0];

  if (!title) {
    return null;
  }

  let cardImage;

  if (imageOverride) {
    const sources = [
      {
        srcSet: `${imageOverride.variants['1248']} 1x, ${imageOverride.variants['1248_2x']} 2x`,
        media: 'all and (min-width: 1248px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageOverride.variants['992']} 1x, ${imageOverride.variants['992_2x']} 2x`,
        media: 'all and (min-width: 992px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageOverride.variants['768']} 1x, ${imageOverride.variants['768_2x']} 2x`,
        media: 'all and (min-width: 768px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageOverride.variants['576']} 1x, ${imageOverride.variants['575_2x']} 2x`,
        media: 'all and (min-width: 576px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageOverride.variants['320']} 1x, ${imageOverride.variants['320_2x']} 2x`,
        media: 'all and (min-width: 320px)',
        type: 'image/jpeg'
      },
    ];

    cardImage = <CardPicture
      alt={imageOverride.alt}
      photographer={imageOverride.photographer}
      src={imageOverride.variants['1248']}
      sources={sources}
      title={imageOverride.title}
    />;
  }
  else if (picture_url?.[0]) {
    cardImage = <CardImage src={picture_url?.[0]} />;
  }

  let language;

  if (additionalFilters.finnish_education) {
    language = Drupal.t('Finnish', {}, {context: 'School search: language option'});
  }

  if (additionalFilters.swedish_education) {
    const swedish = Drupal.t('Swedish', {}, {context: 'School search: language option'});
    language = language?.length ? `${language}, ${swedish.toLowerCase()}` : swedish;
  }

  let languageEducation = ontologyword_ids?.reduce((acc: any, currentItem: any) => {
    if ((currentItem >= 15 && currentItem <= 124) && ontologyDetailsIdsToLang[currentItem]) {
      acc.push(ontologyDetailsIdsToLang[currentItem]);
    }
    return acc;
  }, []);

  // Remove duplicates.
  languageEducation = [...new Set(languageEducation)];

  const bilingualEducation = ontologyword_ids?.reduce((acc: any, currentItem: any) => {
    if ((currentItem >= 293 && currentItem <= 911) && ontologyDetailsIdsToLang[currentItem]) {
      acc.push(ontologyDetailsIdsToLang[currentItem]);
    }
    return acc;
  }, []);

  return (
    <CardItem
      cardDescription={summary_processed?.[0]}
      cardDescriptionHtml
      cardImage={cardImage}
      cardModifierClass=''
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      language={bilingualEducation && bilingualEducation.length ? `${language}, ${bilingualEducation.join(', ')}` : language}
      languageLabel={Drupal.t('Language of instruction', {}, {context: 'School search: language options'})}
      location={address?.[0]}
      locationLabel={Drupal.t('Address', {}, {context: 'React search: location label'})}
      weightedEducation={ontologyword_details_clarifications && ontologyword_details_clarifications.length ? ontologyword_details_clarifications.join(', ') : ''}
      languageEducation={languageEducation && languageEducation.length ? languageEducation.join(', ') : ''}
    />
  );
};

export default ResultCard;
