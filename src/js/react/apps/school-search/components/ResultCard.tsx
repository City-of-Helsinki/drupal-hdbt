import CardItem from '@/react/common/Card';
import CardImage from '@/react/common/CardImage';
import { School } from '../types/School';

const ResultCard = ({ additional_filters, address, summary_processed, name, name_override, picture_url, media_as_objects, url }: School) => {
  const title = name_override?.[0] || name?.[0];
  const imageOverride = media_as_objects?.[0].picture_url_override;
  const additionalFilters = additional_filters[0];

  if (!title) {
    return null;
  }

  let cardImage;

  if (imageOverride) {
   cardImage = <CardImage
      alt={imageOverride.alt}
      photographer={imageOverride.photographer}
      src={imageOverride.url}
      title={imageOverride.title}
    />;
  }
  else if (picture_url?.[0]) {
    cardImage = <CardImage src={picture_url?.[0]} />;
  }

  let language;

  if (additionalFilters.finnish_education) {
    language = Drupal.t('Finnish');
  }

  if (additionalFilters.swedish_education) {
    const swedish = Drupal.t('Swedish');
    language = language?.length ? `${language}, ${swedish.toLowerCase()}` : swedish;
  }

  return (
    <CardItem
      cardDescription={summary_processed?.[0]}
      cardDescriptionHtml
      cardImage={cardImage}
      cardModifierClass=''
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      language={language}
      languageLabel={Drupal.t('Language of instruction', {}, {context: 'School search: language options'})}
      location={address?.[0]}
    />
  );
};

export default ResultCard;
