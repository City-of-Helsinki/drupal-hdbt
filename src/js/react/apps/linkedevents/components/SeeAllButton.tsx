import { useAtomValue} from 'jotai';
import { eventsPublicUrl } from '../store';
import ExternalLink from '../../../common/ExternalLink';

function SeeAllButton() {
  const eventsUrl = useAtomValue(eventsPublicUrl) || '';

  return (
    <div className="event-list__see-all-button">
      <ExternalLink
        data-hds-component="button"
        data-hds-variant="secondary"
        href={eventsUrl}
        title={Drupal.t('Refine search in tapahtumat.hel.fi', {}, { context: 'Events search' })} />
    </div>
  );
}

export default SeeAllButton;
