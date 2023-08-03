type ResultsErrorProps = {
  error: string|Error;
}

const ResultsError = ({ error }: ResultsErrorProps ) => {
  console.warn(`Error loading data. ${error}`);
  return (
    <div className='job-search__results'>
      {Drupal.t('The website encountered an unexpected error. Please try again later.')}
    </div>
  );
};

export default ResultsError;
