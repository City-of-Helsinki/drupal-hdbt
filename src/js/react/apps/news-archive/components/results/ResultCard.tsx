import CardItem from '@/react/common/Card';
import CardImage from '@/react/common/CardImage';
import type NewsItem from '../../types/NewsItem';

const ResultCard = ({
  alt,
  field_main_image_caption,
  main_image_url,
  field_photographer,
  title,
  published_at,
  url,
}: NewsItem) => {
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

  const getAlt = () => {
    if (field_main_image_caption && field_main_image_caption.length) {
      return field_main_image_caption[0];
    }

    if (!alt?.length || alt[0] === '""') {
      return '';
    }

    return alt[0];
  };

  const getImage = () => {
    if (!main_image_url || !main_image_url.length) {
      return undefined;
    }

    return (
      <CardImage
        src={main_image_url[0]}
        alt={getAlt()}
        data-photographer={field_photographer && field_photographer.length ? field_photographer[0] : null}
      />
    );
  };

  return (
    <CardItem
      cardImage={getImage()}
      cardTitle={title.toString()}
      cardModifierClass='news-listing__item'
      cardUrl={url.toString()}
      date={getDate()}
      dateLabel={Drupal.t('Published', {}, { context: 'News search' })}
    />
  );
};

export default ResultCard;
