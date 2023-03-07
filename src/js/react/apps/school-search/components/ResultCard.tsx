import CardItem from '@/react/common/Card';
import { School } from '../types/School';
import CardImage from '@/react/common/CardImage';

const ResultCard = ({ address, summary_processed, name, name_override, picture_url, media_as_objects, url }: School) => {
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
      cardDescription={summary_processed?.[0]}
      cardDescriptionHtml
      cardImage={cardImage}
      cardModifierClass=''
      cardTitle={title}
      cardUrl={url?.[0] || ''}
      location={address?.[0]}
    />
  );
};

export default ResultCard;
