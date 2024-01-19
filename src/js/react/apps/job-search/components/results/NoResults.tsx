import { ForwardedRef, forwardRef } from 'react';

const NoResults = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
    <div className='hdbt-search--react__results--container'>
      <h3 className='hdbt-search--react__results--title' ref={ref}>{Drupal.t('No results')}</h3>
      <p>
        {Drupal.t(
          'Jobs meeting search criteria was not found. Try different search criteria.',
          {},
          { context: 'Job search no results message' }
        )}
      </p>
    </div>
  ));

export default NoResults;
