import ROOT_ID from '../enum/RootId';

function SeeAllButton() {
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const eventsUrl = rootElement?.dataset?.eventsUrl;

  return (
    <a
      className='event-list__see-all-button'
      href={eventsUrl}
    >
      {Drupal.t('Tarkenna hakua tapahtumat.hel.fi:ssä')}
    </a>
  );
}

export default SeeAllButton;
