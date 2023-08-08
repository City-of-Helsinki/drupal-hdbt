import { ForwardedRef, forwardRef } from 'react';

type ResultsCountProps = {
  jobs?: number;
  total?: number;
};

const ResultsCount = forwardRef((props: ResultsCountProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { jobs, total } = props;

  return (
    <div className='job-listing-search__count-container' ref={ref}>
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
});

export default ResultsCount;
