import * as Sentry from '@sentry/react';
import { Notification } from 'hds-react';
import { ForwardedRef, forwardRef } from 'react';

type ResultsErrorProps = {
  error: string|Error;
  className?: string;
  headingLevel?: number;
}

const ResultsError = forwardRef(({ error, className, headingLevel = 3 }: ResultsErrorProps, ref: ForwardedRef<HTMLDivElement>) => {
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
        {Drupal.t('Please reload the page or try again later.', {}, {context: 'React search'})}
      </Notification>
    </div>
  );
});

export default ResultsError;
