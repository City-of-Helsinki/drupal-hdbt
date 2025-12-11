import type { ImgHTMLAttributes } from 'react';

type ImageUrls = { [key: string]: string };

type ImageOverride = { alt?: string; photographer?: string; title?: string; variants: { [key: string]: string } };

type CardPictureProps = {
  photographer?: string;
  alt?: string;
  imageUrls?: ImageUrls;
  imageOverride?: ImageOverride;
  sources?: { srcSet: string; media: string; type?: string }[];
} & ImgHTMLAttributes<HTMLImageElement>;

const CardPicture = (props: CardPictureProps) => {
  // biome-ignore lint/correctness/noUnusedVariables: @todo UHF-12501
  const { alt, photographer, imageUrls, imageOverride, src, ...rest } = props;

  // Determine which source of images to use
  const sourceImages = imageOverride ? imageOverride.variants : imageUrls;

  const derivedSources = sourceImages
    ? [
        {
          srcSet: `${sourceImages['1248'] || ''} 1x, ${sourceImages['1248_2x'] || ''} 2x`,
          media: 'all and (min-width: 1248px)',
          type: 'image/jpeg',
        },
        {
          srcSet: `${sourceImages['992'] || ''} 1x, ${sourceImages['992_2x'] || ''} 2x`,
          media: 'all and (min-width: 992px)',
          type: 'image/jpeg',
        },
        {
          srcSet: `${sourceImages['768'] || ''} 1x, ${sourceImages['768_2x'] || ''} 2x`,
          media: 'all and (min-width: 768px)',
          type: 'image/jpeg',
        },
        {
          srcSet: `${sourceImages['576'] || ''} 1x, ${sourceImages['576_2x'] || ''} 2x`,
          media: 'all and (min-width: 576px)',
          type: 'image/jpeg',
        },
        {
          srcSet: `${sourceImages['320'] || ''} 1x, ${sourceImages['320_2x'] || ''} 2x`,
          media: 'all and (min-width: 320px)',
          type: 'image/jpeg',
        },
      ]
    : [];

  // Use the provided `src` prop or fallback to the `1248` image
  const derivedSrc = src || sourceImages?.['1248'];

  // If no sources are available, don't render anything
  if (!derivedSrc) {
    return null;
  }

  return (
    <picture>
      {derivedSources.map((source, index) => (
        <source
          // biome-ignore lint/suspicious/noArrayIndexKey: @todo UHF-12501
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <img src={derivedSrc} alt='' data-photographer={photographer || imageOverride?.photographer} {...rest} />
    </picture>
  );
};

export default CardPicture;
