type ResultsErrorProps = {
  errorMessage?: string;
}

const ResultsError = ({ errorMessage }: ResultsErrorProps) => (
    <div className='news-listing__no-results'>
      {errorMessage || Drupal.t('The website encountered an unexpected error. Please try again later.')}
    </div>
  );

export default ResultsError;
