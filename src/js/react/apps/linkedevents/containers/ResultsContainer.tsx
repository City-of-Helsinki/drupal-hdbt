import { createRef } from 'react';
import { useAtomValue } from 'jotai';

import ResultsError from '@/react/common/ResultsError';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom, urlAtom } from '../store';
import type Event from '../types/Event';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';

type ResultsContainerProps = {
  countNumber: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ countNumber, events, loading, error }: ResultsContainerProps) {
  const settings = useAtomValue(settingsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const url = useAtomValue(urlAtom);
  // Checks when user makes the first search and api url is set.
  const choices = Boolean(url);
  useScrollToResults(scrollTarget, choices);

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
  const pages = Math.floor(countNumber / size);
  const addLastPage = countNumber > size && countNumber % size;
  const count = countNumber.toString();

  return (
    <div className='react-search__list-container'>
      {events?.length > 0 ?
        <>
          <ResultsHeader
            resultText={
              <>
                { Drupal.formatPlural(count, '1 event', '@count events',{},{context: 'Event search: result count'}) }
              </>
            }
            ref={scrollTarget}
          />
          {events.map(event => <ResultCard key={event.id} {...event} />)}
          <Pagination pages={5} totalPages={addLastPage ? pages + 1 : pages} />
        </>
        :
        <ResultsEmpty wrapperClass='event-list__no-results' ref={scrollTarget} />
      }
      <SeeAllButton />
    </div>
  );
}

export default ResultsContainer;
