import { Notification } from 'hds-react';
import { type ForwardedRef, forwardRef } from 'react';

type ResultsErrorProps = {
  className?: string;
  error: string | Error;
  errorMessage?: string;
  headingLevel?: number;
};

const ResultsError = forwardRef(
  (
    { className, error, errorMessage, headingLevel = 3 }: ResultsErrorProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    // This error path is hit quite often if e.g. user goes back before the api
    // network requests are finished, which causes a exception to be thrown.
    // Suppress TypeError to reduce spam to Sentry.
    //
    // Possible network errors:
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch#exceptions
    if (!(error instanceof TypeError)) {
      console.error('Error loading data from Elastic:', error);
    }

    return (
      <div className={className} ref={ref}>
        <Notification
          label={Drupal.t(
            'An error occurred while loading the content',
            {},
            { context: 'React search' },
          )}
          type='error'
          headingLevel={headingLevel}
        >
          {errorMessage ||
            Drupal.t(
              'Please reload the page or try again later.',
              {},
              { context: 'React search' },
            )}
        </Notification>
      </div>
    );
  },
);

export default ResultsError;
