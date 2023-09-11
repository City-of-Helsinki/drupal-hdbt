import * as Sentry from '@sentry/react';
import { ForwardedRef, forwardRef } from 'react';

type ResultsErrorProps = {
  error: string|Error;
  className: string;
}

const ResultsError = forwardRef(({ error, className }: ResultsErrorProps, ref: ForwardedRef<HTMLDivElement> ) => {
  console.warn(`Error loading data. ${error}`);
  Sentry.captureException(error);
  return (
    <div className={className} ref={ref}>
      {Drupal.t('The website encountered an unexpected error. Please try again later.')}
    </div>
  );
});

export default ResultsError;
