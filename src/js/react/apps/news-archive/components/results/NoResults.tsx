const NoResults = () => (
    <div className='news-listing__no-results'>
    {Drupal.t('No results found', {}, { context: 'News archive no results' })}
  </div>
  );

export default NoResults;
