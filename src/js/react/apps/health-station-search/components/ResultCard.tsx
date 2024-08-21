import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import CardImage from '@/react/common/CardImage';
import { HealthStation } from '../types/HealthStation';

const ResultCard = ({
  address,
  name,
  name_override,
  picture_url,
  provided_languages,
  media_as_objects,
  url
}: HealthStation) => {
  const title = name_override?.[0] || name?.[0];
  const imageOverride = media_as_objects?.[0].picture_url_override;

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

  else {
    cardImage = undefined; // No image to display
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
