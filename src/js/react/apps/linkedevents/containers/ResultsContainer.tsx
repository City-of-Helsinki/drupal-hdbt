import { createRef, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import ResultCard from '../components/ResultCard';
import CardGhost from '@/react/common/CardGhost';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom, urlAtom } from '../store';
import type Event from '../types/Event';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import LoadingOverlay from '@/react/common/LoadingOverlay';

type ResultsContainerProps = {
  countNumber: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ countNumber, events, loading, error }: ResultsContainerProps) {
  const { useExperimentalGhosts } = drupalSettings.helfi_events;
  const settings = useAtomValue(settingsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const url = useAtomValue(urlAtom);
  // Checks when user makes the first search and api url is set.
  const choices = Boolean(url);
  const [initialized, setInitialized] = useState(false);
  useScrollToResults(scrollTarget, initialized && choices && !loading);

  useEffect(() => {
    if (!initialized && !loading) {
      setInitialized(true);
    }
  }, [initialized, setInitialized, loading]);

  if (error) {
    return (
      <ResultsError
        error={error}
        ref={scrollTarget}
      />
    );
  }

  if (loading && !useExperimentalGhosts) {
    return (
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    );
  }

  const size = settings.eventCount;
  const pages = Math.floor(countNumber / size);
  const addLastPage = countNumber > size && countNumber % size;
  const count = countNumber.toString();

  const getContent = () => {
    if (loading && !events.length) {
      return Array.from({ length: size }, (_, i) => <CardGhost key={i} />);
    }
    if (events.length > 0) {
      return (
        <>
          <ResultsHeader
            resultText={
              <>
                {Drupal.formatPlural(count, '1 event', '@count events', {}, {context: 'Events search: result count'})}
              </>
            }
            ref={scrollTarget}
          />
          {events.map(event => loading ? <CardGhost key={event.id} /> : <ResultCard key={event.id} {...event} />)}
          <Pagination pages={5} totalPages={addLastPage ? pages + 1 : pages} />
        </>
      );
    }

    return <ResultsEmpty wrapperClass='event-list__no-results' ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      <SeeAllButton />
    </div>
  );
}

export default ResultsContainer;
