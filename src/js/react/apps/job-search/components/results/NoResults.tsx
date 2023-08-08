import { ForwardedRef, forwardRef } from 'react';

const NoResults = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
    <div className='job-search__no-results' ref={ref}>
      <div className='job-search__no-results__heading'>{Drupal.t('No results')}</div>
      <div>
        {Drupal.t(
          'Jobs meeting search criteria was not found. Try different search criteria.',
          {},
          { context: 'Job search no results message' }
        )}
      </div>
    </div>
  ));

export default NoResults;
