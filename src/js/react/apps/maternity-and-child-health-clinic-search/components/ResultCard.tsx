import CardItem from '@/react/common/Card';
import CardImage from '@/react/common/CardImage';
import { MaternityAndChildHealthClinic } from '../types/MaternityAndChildHealthClinic';

const ResultCard = ({ address, name, name_override, picture_url, provided_languages, media_as_objects, url }: MaternityAndChildHealthClinic) => {
  const title = name_override?.[0] || name?.[0];
  const imageOverride = media_as_objects?.[0].picture_url_override;

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

  return (
    <CardItem
      cardImage={cardImage}
      cardModifierClass=''
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      location={address?.[0]}
      locationLabel={Drupal.t('Address', {}, {context: 'React search: location label'})}
      cardCategoryTag={provided_languages.includes('sv') ? {'tag': Drupal.t('Service in Swedish', {}, {'context': 'React search: Service in Swedish tag'})} : undefined}
    />
  );
};

export default ResultCard;
