import { LoadingSpinner } from 'hds-react';

const LoadingOverlay = () => (
  <div
    className='hdbt__loading-overlay'
    aria-live='assertive'
    aria-atomic='true'
  >
    <div className='visually-hidden'>
      {Drupal.t(
        'Search results are loading',
        {},
        { context: 'React search: results loading' },
      )}
    </div>
    <LoadingSpinner loadingText='' loadingFinishedText='' />
  </div>
);

export default LoadingOverlay;
