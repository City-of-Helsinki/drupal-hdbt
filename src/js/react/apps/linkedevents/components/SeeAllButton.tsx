import { useAtomValue} from 'jotai';
import { eventsPublicUrl } from '../store';
import ExternalLink from '../../../common/ExternalLink';

function SeeAllButton() {
  const eventsUrl = useAtomValue(eventsPublicUrl) || '';
  const { seeAllButtonOverride } = drupalSettings?.helfi_events || null;

  return (
    <div className="event-list__see-all-button">
      <ExternalLink
        data-hds-component="button"
        data-hds-variant="secondary"
        href={eventsUrl}
        title={seeAllButtonOverride || Drupal.t('Search for more events on the Events website', {}, { context: 'Events search' })} />
    </div>
  );
}

export default SeeAllButton;
