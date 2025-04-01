import * as Sentry from '@sentry/react';
import { Notification } from 'hds-react';
import { ForwardedRef, forwardRef } from 'react';

type ResultsErrorProps = {
  className?: string;
  error: string|Error;
  errorMessage?: string;
  headingLevel?: number;
}

const ResultsError = forwardRef(({
  className,
  error,
  errorMessage,
  headingLevel = 3
}: ResultsErrorProps, ref: ForwardedRef<HTMLDivElement>) => {
  console.warn(`Error loading data from Elastic: ${error}`);

  if (drupalSettings?.helfi_react_search?.sentry_dsn_react) {
    Sentry.captureException(error);
  }

  return (
    <div className={className} ref={ref}>
      <Notification
        label={Drupal.t('An error occured while loading the content', {}, { context: 'React search' })}
        type='error'
        headingLevel={headingLevel}
      >
        {errorMessage || Drupal.t('Please reload the page or try again later.', {}, {context: 'React search'})}
      </Notification>
    </div>
  );
});

export default ResultsError;
