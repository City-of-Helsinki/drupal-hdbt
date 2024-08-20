import CardItem from '@/react/common/Card';
import CardPicture from '@/react/common/CardPicture';
import type NewsItem from '../../types/NewsItem';

type ImageUrls = {
  [key: string]: string;
};

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

    const sources = [
      {
        srcSet: `${imageUrls['1248'] || ''} 1x, ${imageUrls['1248_2x'] || ''} 2x`,
        media: 'all and (min-width: 1248px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageUrls['992'] || ''} 1x, ${imageUrls['992_2x'] || ''} 2x`,
        media: 'all and (min-width: 992px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageUrls['768'] || ''} 1x, ${imageUrls['768_2x'] || ''} 2x`,
        media: 'all and (min-width: 768px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageUrls['576'] || ''} 1x, ${imageUrls['575_2x'] || ''} 2x`,
        media: 'all and (min-width: 576px)',
        type: 'image/jpeg'
      },
      {
        srcSet: `${imageUrls['320'] || ''} 1x, ${imageUrls['320_2x'] || ''} 2x`,
        media: 'all and (min-width: 320px)',
        type: 'image/jpeg'
      },
    ];

    if (!imageUrls['1248']) {
      return undefined; // Return undefined if there's no primary image to display
    }

    return (
      <CardPicture
        alt={getAlt()}
        photographer={field_photographer && field_photographer.length ? field_photographer[0] : undefined}
        src={imageUrls['1248']}
        sources={sources}
      />
    );
  };

  return (
    <CardItem
      cardImage={getImage()}
      cardTitle={title.toString()}
      cardModifierClass='card--news-item'
      cardUrl={url.toString()}
      date={getDate()}
      dateLabel={Drupal.t('Published', {}, { context: 'News search' })}
    />
  );
};

export default ResultCard;
