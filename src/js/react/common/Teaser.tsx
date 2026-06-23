import ExternalLink from './ExternalLink';

export const Teaser = ({
  className,
  image,
  time,
  title,
  url,
}: {
  className?: string;
  time?: string | JSX.Element;
  image: React.ReactNode;
  title: string;
  url: string;
}) => {
  return (
    <li className={`card-teaser__content card-teaser${className ? ` ${className}` : ''}`}>
      <div className='card-teaser__img'>{image}</div>
      <div className='card-teaser__text-container'>
        <h3 className='card-teaser__title'>
          <ExternalLink className='card-teaser__link' href={url} rel='bookmark' title={title} />
        </h3>
        {time && <div className='card-teaser__datetime'>{time}</div>}
      </div>
    </li>
  );
};
