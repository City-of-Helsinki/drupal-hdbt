import { ImgHTMLAttributes } from 'react';

type CardPictureProps = {
  photographer?: string;
  sources: {
    srcSet: string;
    media: string;
    type?: string;
  }[];
} & ImgHTMLAttributes<HTMLImageElement>;

const CardPicture = (props: CardPictureProps) => {
  const { alt, photographer, sources, src, ...rest } = props;

  return (
    <picture>
      {sources.map((source, index) => (
        <source key={index} srcSet={source.srcSet} media={source.media} type={source.type} />
      ))}
      <img
        src={src}
        alt={alt && alt !== '""' ? alt : ''}
        data-photographer={photographer}
        {...rest}
      />
    </picture>
  );
};

export default CardPicture;
