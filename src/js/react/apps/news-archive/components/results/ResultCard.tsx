import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import type NewsItem from '../../types/NewsItem';

type ImageUrls = {
  [key: string]: string;
};

interface ResultCardProps extends NewsItem {
  cardModifierClass?: string;
  cardTitleLevel?: 2 | 3 | 4 | 5 | 6;
}

const ResultCard = ({
  alt,
  cardModifierClass,
  cardTitleLevel,
  field_main_image_caption,
  field_photographer,
  main_image_url,
  original_title,
  published_at,
  url,
}: ResultCardProps) => {
  const getDate = () => {
    if (!published_at || !published_at.length) {
      return undefined;
    }

    const date = new Date(published_at[0] * 1000);
    return date.toLocaleString('fi-FI', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImage = () => {
    if (!main_image_url || !main_image_url.length || !main_image_url[0]) {
      return undefined; // No image to display
    }

    let imageUrls: ImageUrls = {};

    try {
      imageUrls = typeof main_image_url?.[0] === 'string' ? JSON.parse(main_image_url?.[0]) : main_image_url?.[0];
    } catch (e) {
      console.error('Failed to parse main_image_url', e);
      return undefined; // Return undefined if parsing fails
    }

    return (
      <CardPicture
        alt=''
        photographer={field_photographer && field_photographer.length ? field_photographer[0] : undefined}
        imageUrls={imageUrls}
      />
    );
  };

  return (
    <CardItem
      cardImage={getImage()}
      cardTitle={original_title.toString()}
      cardTitleLevel={cardTitleLevel || 4}
      cardModifierClass={`card--news-item${cardModifierClass ? ` ${cardModifierClass}` : ''}`}
      cardUrl={url.toString()}
      date={getDate()}
      dateLabel={Drupal.t('Published', {}, { context: 'News search' })}
    />
  );
};

export default ResultCard;
