import { ForwardedRef, forwardRef } from 'react';

const NoResults = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
  <div className='news-listing__no-results' ref={ref}>
    {Drupal.t('No results', {}, {context: 'No search results'})}
  </div>
));

export default NoResults;
