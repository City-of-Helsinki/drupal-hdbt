import * as Sentry from '@sentry/react';
import { ForwardedRef, forwardRef } from 'react';

type ResultsErrorProps = {
  error: string|Error;
}

const ResultsError = forwardRef(({ error }: ResultsErrorProps, ref: ForwardedRef<HTMLDivElement> ) => {
  console.warn(`Error loading data. ${error}`);
  Sentry.captureException(error);
  return (
    <div className='news-listing__no-results' ref={ref}>
      {Drupal.t('The website encountered an unexpected error. Please try again later.')}
    </div>
  );
});

export default ResultsError;
