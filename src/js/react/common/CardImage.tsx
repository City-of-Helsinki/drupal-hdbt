import type { ImgHTMLAttributes } from 'react';

type CardImageProps = { photographer?: string } & ImgHTMLAttributes<HTMLImageElement>;

const CardImage = (props: CardImageProps) => {
  const { photographer, src, ...rest } = props;

  return <img src={src} alt='' data-photographer={photographer} {...rest} />;
};

export default CardImage;
