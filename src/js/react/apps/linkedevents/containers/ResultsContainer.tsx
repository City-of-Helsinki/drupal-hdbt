import { createRef, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom, urlAtom } from '../store';
import type Event from '../types/Event';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';

type ResultsContainerProps = {
  addressRequired?: boolean;
  countNumber: number;
  error?: Error;
  events: Event[];
  loading: boolean;
  retriesExhausted?: boolean;
};

function ResultsContainer({
  addressRequired,
  countNumber,
  error,
  events,
  loading,
  retriesExhausted
}: ResultsContainerProps) {
  const { seeAllNearYouLink, cardsWithBorders } = drupalSettings.helfi_events;
  const settings = useAtomValue(settingsAtom);
  const size = settings.eventCount;
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
    return retriesExhausted ?
      <ResultsError
        error={error}
        errorMessage={Drupal.t('Failed to fetch events. You can reload the page or try again later.', {}, {context: 'Events search: Fetch failed message'})}
        ref={scrollTarget}
      /> :
      <GhostList bordered={cardsWithBorders} count={size} />;
  }

  const pages = Math.floor(countNumber / size);
  const addLastPage = countNumber > size && countNumber % size;
  const count = countNumber.toString();

  const getContent = () => {
    if (loading && !events.length) {
      return <GhostList bordered={cardsWithBorders} count={size} />;
    }
    if (addressRequired) {
      return (
        <ResultsHeader
          resultText={
            <>
              {Drupal.t('Start by searching with your address.', {}, {context: 'Helsinki near you events search'})}
            </>
          }
          ref={scrollTarget}
        />
      );
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
          {loading ?
            <GhostList bordered={cardsWithBorders} count={size} /> :
            events.map(event => <ResultCard key={event.id} {...event} {...(cardsWithBorders && { cardModifierClass: 'card--border' })} />)
          }
          {!settings.hidePagination &&
            <Pagination pages={5} totalPages={addLastPage ? pages + 1 : pages} />
          }
        </>
      );
    }

    return <ResultsEmpty wrapperClass='event-list__no-results' ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      {
        seeAllNearYouLink ?
        <div className='event-list__see-all-button event-list__see-all-button--near-you'>
          <a
            data-hds-component="button"
            href={seeAllNearYouLink}
          >
            {Drupal.t('See all events near you', {}, { context: 'Helsinki near you events search' })}
          </a>
        </div> :
        <SeeAllButton />
      }
    </div>
  );
}

export default ResultsContainer;
