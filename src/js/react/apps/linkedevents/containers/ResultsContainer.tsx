import { createRef } from 'react';
import { useAtomValue } from 'jotai';

import ResultsError from '@/react/common/ResultsError';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom } from '../store';
import type Event from '../types/Event';

type ResultsContainerProps = {
  count: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ count, events, loading, error }: ResultsContainerProps) {
  const settings = useAtomValue(settingsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  useScrollToResults(scrollTarget, true);

  if (loading) {
    return (
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <ResultsError
        error={error}
        ref={scrollTarget}
      />
    );
  }

  const size = settings.eventCount;
  const pages = Math.floor(count / size);
  const addLastPage = count > size && count % size;
  const showCount = !Number.isNaN(count) && !loading;

  return (
    <div className='react-search__list-container'>
      <div className='react-search__results-stats' ref={scrollTarget}>
        {Boolean(showCount) &&
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
        <div className='event-list__no-results' ref={scrollTarget}>
          <h3>{Drupal.t('This event list is empty.')}</h3>
          <p className='events-list__empty-subtext'>{Drupal.t('No worries though, this city does not run out of things to do.')}</p>
        </div>
      }
      <SeeAllButton />
    </div>
  );
}

export default ResultsContainer;
