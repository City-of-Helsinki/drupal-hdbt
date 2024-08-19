type ExternalLinkProps = {
  className?: string;
  href: string;
  title: string | JSX.Element;
  'data-hds-component'?: string;
  'data-hds-variant'?: string;
};

const ExternalLink = ({ href, title, 'data-hds-component': dataHdsComponent, 'data-hds-variant': dataHdsVariant }: ExternalLinkProps) => {
  const dataAttributes = {
    ...(dataHdsComponent && { 'data-hds-component': dataHdsComponent }),
    ...(dataHdsVariant && { 'data-hds-variant': dataHdsVariant }),
  };

  return (
    <a
      href={href}
      data-is-external='true'
      {...dataAttributes}
    >
      {title}

      {!dataHdsComponent && (
        <span className="link__type link__type--external"></span>
      )}
      <span className="visually-hidden">
        {
          Drupal.t(
            'Link leads to external service',
            {},
            { context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.' }
          )
        }
      </span>
    </a>
  );
};

export default ExternalLink;
