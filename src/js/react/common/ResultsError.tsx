import * as Sentry from '@sentry/react';
import { ForwardedRef, forwardRef } from 'react';
import { sentryEnabled } from '@/react/common/helpers/Sentry';

type ResultsErrorProps = {
  error: string|Error;
  className?: string;
}

const ResultsError = forwardRef(({ error, className }: ResultsErrorProps, ref: ForwardedRef<HTMLDivElement>) => {
  console.warn(`Error loading data from Elastic: ${error}`);

  if (sentryEnabled()) {
    Sentry.captureException(error);
  }

  return (
    <div className={className} ref={ref}>
      {Drupal.t('An error occured while loading the content. Please reload page.', {}, { context: 'React search' })}
    </div>
  );
});

export default ResultsError;
