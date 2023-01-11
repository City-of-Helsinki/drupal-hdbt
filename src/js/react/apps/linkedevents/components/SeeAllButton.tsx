import ROOT_ID from '../enum/RootId';

function SeeAllButton() {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  // TODO: add API EVENT URL as data attribute ti get tapahtumat.hel.fi url with params
  const eventsUrl = rootElement?.dataset?.eventsUrl;

  return (
    <a
      href={eventsUrl}
      className='hds-button hds-button--link hds-button--secondary'
      data-is-external="true"
    >
      <span className="hds-button__label">{Drupal.t('Refine search in tapahtumat.hel.fi')}</span>
      <span className="link__type link__type--external" aria-label={`(${Drupal.t(
          'Link leads to external service',
          {},
          { context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.' }
        )})`}>
      </span>
    </a>
  );
}

export default SeeAllButton;
