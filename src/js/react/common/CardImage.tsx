import { ImgHTMLAttributes } from 'react';

type CardImageProps = {
  photographer?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

const CardImage = (props: CardImageProps) => {
  const {alt, photographer, ...rest} = props;

  return (
    <img
      alt={alt}
      data-photographer={photographer}
      {...rest}
    />
  );
};

export default CardImage;
