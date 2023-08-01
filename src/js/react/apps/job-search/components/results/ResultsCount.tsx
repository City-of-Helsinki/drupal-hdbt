type ResultsCountProps = {
  jobs?: number;
  total?: number;
};

const ResultsCount = ({ jobs, total }: ResultsCountProps) => (
    <div className='job-listing-search__count-container'>
      {!Number.isNaN(jobs) && !Number.isNaN(total) && (
        <>
          <span className='job-listing-search__count'>{jobs}</span>
          {` ${ 
            Drupal.t(
              'open positions (@listings job listings)',
              { '@listings': total },
              { context: 'Job search results statline' }
            )}`}
        </>
      )}
    </div>
  );

export default ResultsCount;
