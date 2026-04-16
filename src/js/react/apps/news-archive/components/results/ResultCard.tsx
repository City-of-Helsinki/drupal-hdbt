import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import { useMainImage } from '@/react/common/hooks/useMainImage';
import type NewsItem from '../../types/NewsItem';

interface ResultCardProps extends NewsItem {
  cardModifierClass?: string;
  cardTitleLevel?: 2 | 3 | 4 | 5 | 6;
}

const ResultCard = ({
  cardModifierClass,
  cardTitleLevel,
  field_photographer,
  main_image_url,
  title,
  published_at,
  url,
}: ResultCardProps) => {
  const { src, keyedStyles } = useMainImage(main_image_url);

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
      minute: '2-digit',
    });
  };

  const getImage = () => {
    if (!main_image_url?.toString().length) {
      return undefined; // No image to display
    }

    return (
      <CardPicture
        alt=''
        photographer={field_photographer?.length ? field_photographer[0] : undefined}
        imageUrls={keyedStyles}
        src={src}
      />
    );
  };

  return (
    <CardItem
      cardImage={getImage()}
      cardTitle={title.toString()}
      cardTitleLevel={cardTitleLevel || 4}
      cardModifierClass={`card--news-item${cardModifierClass ? ` ${cardModifierClass}` : ''}`}
      cardUrl={url.toString()}
      date={getDate()}
      dateLabel={Drupal.t('Published', {}, { context: 'News search' })}
    />
  );
};

export default ResultCard;
