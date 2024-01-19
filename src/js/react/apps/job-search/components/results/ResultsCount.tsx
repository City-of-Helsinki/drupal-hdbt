import { ForwardedRef, forwardRef } from 'react';

type ResultsCountProps = {
  jobs?: number;
  total?: number;
};

const ResultsCount = forwardRef((props: ResultsCountProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { jobs, total } = props;

  return (
    <h3 className='hdbt-search--react__results--title' ref={ref}>
      {!Number.isNaN(jobs) && !Number.isNaN(total) && (
        <>
          {jobs}
          {` ${
            Drupal.t(
              'open positions (@listings job listings)',
              { '@listings': total },
              { context: 'Job search results statline' }
            )}`}
        </>
      )}
    </h3>
  );
});

export default ResultsCount;
