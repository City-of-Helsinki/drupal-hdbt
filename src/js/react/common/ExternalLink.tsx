type ExternalLinkProps = {
  className?: string;
  href: string;
  title: string|JSX.Element;
};

const ExternalLink = ({className, href, title}: ExternalLinkProps) => {
  let classes = 'link';

  if (className) {
    classes += ` ${className}`;
  }

  return (
    <a
      href={href}
      className={classes}
      data-is-external='true'
    >
      {title}
      <span
        aria-label={
          Drupal.t(
            'Link leads to external service',
            {},
            {context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.'}
        )}
        className='link__type link__type--external'
      />
    </a>
  );
};

export default ExternalLink;
