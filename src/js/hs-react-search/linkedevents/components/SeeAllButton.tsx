const SeeAllButton = () => {
  const { baseUrl } = drupalSettings.helfi_events;

  return (
    <a
      className='event-list__see-all-button'
      href={baseUrl}
    >
      {Drupal.t('See all events')}
    </a>
  )
}

export default SeeAllButton;
