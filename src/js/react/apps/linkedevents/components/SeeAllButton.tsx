import { useAtomValue} from 'jotai';
import { eventsPublicUrl } from '../store';


function SeeAllButton() {
  const eventsUrl = useAtomValue(eventsPublicUrl);

  return (
    <div className="event-list__see-all-button">
      <a
        href={eventsUrl}
        className="hds-button hds-button--link hds-button--secondary"
        data-is-external="true"
      >
        <span className="hds-button__label">{Drupal.t('Refine search in tapahtumat.hel.fi', {}, { context: 'Events search' })}</span>
        <span className="link__type link__type--external" aria-label={`(${Drupal.t(
            'Link leads to external service',
            {},
            { context: 'Explanation for screen-reader software that the icon visible next to this link means that the link leads to an external service.' }
          )})`}>
        </span>
      </a>
    </div>
  );
}

export default SeeAllButton;
