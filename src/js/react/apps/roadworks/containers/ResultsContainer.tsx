import { createRef, useEffect, useState } from 'react';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import RoadworkCard from '../components/RoadworkCard';
import type Roadwork from '../types/Roadwork';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';

type ResultsContainerProps = {
  countNumber: number;
  error?: Error;
  roadworks: Roadwork[];
  loading: boolean;
  retriesExhausted?: boolean;
  seeAllUrl?: string;
};

function ResultsContainer({
  countNumber,
  error,
  roadworks,
  loading,
  retriesExhausted,
  seeAllUrl
}: ResultsContainerProps) {
  const size = 3; // Default roadwork count
  const scrollTarget = createRef<HTMLDivElement>();
  const [initialized, setInitialized] = useState(false);
  
  useScrollToResults(scrollTarget, initialized && !loading);
  
  useEffect(() => {
    if (!initialized && !loading) {
      setInitialized(true);
    }
  }, [initialized, setInitialized, loading]);

  if (error) {
    return retriesExhausted ?
      <ResultsError
        error={error}
        errorMessage={Drupal.t('Failed to fetch roadworks. You can reload the page or try again later.', {}, {context: 'Roadworks search: Fetch failed message'})}
        ref={scrollTarget}
      /> :
      <GhostList bordered={false} count={size} />;
  }

  const getContent = () => {
    if (loading && !roadworks.length) {
      return <GhostList bordered={false} count={size} />;
    }
    
    if (roadworks.length > 0) {
      return (
        <>
          <ResultsHeader
            resultText={
              <>
                {Drupal.formatPlural(countNumber.toString(), '1 result', '@count results', {}, {context: 'Roadworks search: result count'})}
              </>
            }
            ref={scrollTarget}
          />
          {loading ?
            <GhostList bordered={false} count={size} /> :
            roadworks.map((roadwork, index) => <RoadworkCard key={`roadwork-${index}`} roadwork={roadwork} />)
          }
        </>
      );
    }

    return <ResultsEmpty ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      {
        seeAllUrl ?
        <div className='roadwork-list__see-all-button roadwork-list__see-all-button--near-you'>
          <a
            href={seeAllUrl}
            className='hds-button hds-button--primary'
          >
            {Drupal.t('See all roadworks near you', {}, { context: 'Helsinki near you roadworks search' })}
          </a>
        </div> : null
      }
    </div>
  );
}

export default ResultsContainer;
