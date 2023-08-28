import { LoadingSpinner} from 'hds-react';

import { useAtomValue } from 'jotai';
import { createRef, useEffect, useRef, useState } from 'react';
import type Event from '../types/Event';
import Pagination from '../components/Pagination';
import EmptyMessage from '../components/EmptyMessage';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom } from '../store';
import ResultWrapper from '@/react/common/ResultWrapper';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';

type ResultsContainerProps = {
  count: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ count, events, loading, error }: ResultsContainerProps) {
  const settings = useAtomValue(settingsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const initiated = useRef(false);

  useEffect(() => {
    if (!loading &&  !initiated.current) {
      initiated.current = true;
    }
  });

  useScrollToResults(scrollTarget, initiated.current);

  if (error || !settings) {
    return <p>{Drupal.t('Could not retrieve events')}</p>;
  }

  const size = settings.eventCount;
  const pages = Math.floor(count / size);
  const addLastPage = count > size && count % size;

  const showCount = !Number.isNaN(count);

  return (
    <ResultWrapper loading={loading}>
      <div className='react-search__results-stats' ref={scrollTarget}>
        {showCount &&
          <>
            <span className='react-search__count'>{count} </span>
            <span>{Drupal.t('events')}</span>
          </>
        }
      </div>
      {events?.length > 0 ?
        <>
          {events.map(event => <ResultCard key={event.id} {...event} />)}
          <Pagination pages={5} totalPages={addLastPage ? pages + 1 : pages} />
        </>
        :
        <EmptyMessage />
      }
      <SeeAllButton />
    </ResultWrapper>
  );

}

export default ResultsContainer;
