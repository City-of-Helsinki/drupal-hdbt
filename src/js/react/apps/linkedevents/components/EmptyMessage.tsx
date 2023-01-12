function EmptyMessage() {
  return (
    <div className='event-list__no-results'>
      <h3>{Drupal.t('This event list is empty.')}</h3>
      <p className='events-list__empty-subtext'>{Drupal.t('No worries though, this city does not run out of things to do.')}</p>
    </div>
  );
}

export default EmptyMessage;
