import { useAtomValue } from 'jotai';
import { eventsPublicUrl, hobbiesPublicUrl, settingsAtom } from '../store';
import ExternalLink from '../../../common/ExternalLink';

function SeeAllButton() {
  const filterSettings = useAtomValue(settingsAtom);
  const eventsUrl = useAtomValue(eventsPublicUrl) || '';
  const { seeAllButtonOverride } = drupalSettings?.helfi_events || null;
  const { eventListType } = filterSettings;

  return (
    <div className='see-all-button__container'>
      {['events', 'events_and_hobbies'].includes(eventListType) && (
        <div className='see-all-button see-all-button--centered'>
          <ExternalLink
            data-hds-component='button'
            data-hds-variant='secondary'
            href={eventsUrl}
            title={
              seeAllButtonOverride ||
              Drupal.t('Search for more events on the Events website', {}, { context: 'Events search' })
            }
          />
        </div>
      )}
      {['hobbies', 'events_and_hobbies'].includes(eventListType) && (
        <div className='see-all-button see-all-button--centered'>
          <ExternalLink
            data-hds-component='button'
            data-hds-variant='secondary'
            href={hobbiesPublicUrl}
            title={Drupal.t('Search for more events on the Hobbies website', {}, { context: 'Events search' })}
          />
        </div>
      )}
    </div>
  );
}

export default SeeAllButton;
