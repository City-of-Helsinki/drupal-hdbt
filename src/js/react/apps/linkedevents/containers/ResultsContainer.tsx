import { useAtomValue, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import Pagination from '../components/Pagination';
import type { ResultCardProps } from '../components/ResultCard';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { addressAtom, initializedAtom, settingsAtom, submittedParamsAtom, urlAtom } from '../store';
import type Event from '../types/Event';

type ResultsContainerProps = {
  addressRequired?: boolean;
  countNumber: number;
  error?: Error;
  events: Event[];
  loading: boolean;
  ResultCardComponent?: React.ComponentType<ResultCardProps>;
  retriesExhausted?: boolean;
  resultHeaderFunction?: (count: number) => string;
  sort?: JSX.Element;
  validating: boolean;
};

function ResultsContainer({
  addressRequired,
  countNumber,
  error,
  events,
  loading,
  ResultCardComponent,
  retriesExhausted,
  resultHeaderFunction,
  sort,
  validating,
}: ResultsContainerProps) {
  const Card = ResultCardComponent ?? ResultCard;
  const { seeAllNearYouLink, cardsWithBorders } = drupalSettings.helfi_events;
  const settings = useAtomValue(settingsAtom);
  const size = settings.eventCount;
  const isLifts = settings.layout === 'lifts';
  const resultsListRef = useRef<HTMLDivElement>(null);
  const readAddress = useAtomCallback((get) => get(addressAtom));
  const url = useAtomValue(urlAtom);
  const submittedParams = useAtomValue(submittedParamsAtom);
  const readInitialized = useAtomCallback(useCallback((get) => get(initializedAtom), []));
  const setInitialized = useSetAtom(initializedAtom);

  const { scrollTarget, loadingHeaderRef, skipResultsFocusRef, isSearching } = useSearchFocusManagement(
    loading || validating,
    url,
    loading ? undefined : events,
    error,
    submittedParams,
  );

  const scrollToFirstItem = useScrollToFirstItem(resultsListRef, loading || validating);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollTarget.current is a ref, intentionally read at effect run time
  useEffect(() => {
    if (!readInitialized() && !loading && !validating && scrollTarget.current) {
      setInitialized(true);
    }
  }, [loading, readInitialized, setInitialized, validating]);

  if (error) {
    return retriesExhausted ? (
      <ResultsError
        error={error}
        errorMessage={Drupal.t(
          'Failed to fetch events. You can reload the page or try again later.',
          {},
          { context: 'Events search: Fetch failed message' },
        )}
        ref={scrollTarget}
      />
    ) : (
      <GhostList bordered={cardsWithBorders} count={size} />
    );
  }

  const address = readAddress();
  const pages = Math.floor(countNumber / size);
  const addLastPage = countNumber > size && countNumber % size;
  const count = countNumber.toString();

  const getContent = () => {
    if (isSearching) {
      return (
        // Different keys force React to fully replace the DOM between ghost and results
        // instead of patching in place, which prevents a removeChild crash in React version 17.
        <div key='ghost' className='react-search__results'>
          <ResultsHeader
            resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
            ref={loadingHeaderRef}
          />
          <GhostList bordered={cardsWithBorders} count={size} />
        </div>
      );
    }
    if (addressRequired && !address) {
      return (
        <ResultsHeader
          resultText={Drupal.t(
            'Start by searching with your address.',
            {},
            { context: 'Helsinki near you events search' },
          )}
          ref={scrollTarget}
        />
      );
    }
    if (events.length > 0) {
      return (
        <>
          {!isLifts && (
            <ResultsHeader
              actions={sort ? sort : undefined}
              resultText={
                <>
                  {resultHeaderFunction
                    ? resultHeaderFunction(countNumber)
                    : Drupal.formatPlural(
                        count,
                        '1 result',
                        '@count results',
                        {},
                        { context: 'Events search: result count' },
                      )}
                  {settings.useLocationSearch && address
                    ? ` ${Drupal.t('using address', {}, { context: 'React search: Address result display' })} ${address}`
                    : ''}
                </>
              }
              ref={scrollTarget}
            />
          )}
          <div ref={resultsListRef}>
            {events.map((event) => (
              <Card key={event.id} {...event} {...(cardsWithBorders && { cardModifierClass: 'card--border' })} />
            ))}
          </div>
          {!isLifts && !settings.hidePagination && (
            <Pagination
              onPageChange={() => {
                scrollToFirstItem();
                skipResultsFocusRef.current = true;
              }}
              pages={5}
              totalPages={addLastPage ? pages + 1 : pages}
            />
          )}
        </>
      );
    }

    return <ResultsEmpty wrapperClass='event-list__no-results' ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}${isLifts ? ' simple-event-list' : ''}`}>
      {isLifts ? <ul className='simple-event-list__events'>{getContent()}</ul> : getContent()}
      {seeAllNearYouLink ? (
        <div className='see-all-button see-all-button--near-results'>
          <a data-hds-component='button' href={seeAllNearYouLink}>
            {Drupal.t('See all events near you', {}, { context: 'Helsinki near you events search' })}
          </a>
        </div>
      ) : (
        <SeeAllButton />
      )}
    </div>
  );
}

export default ResultsContainer;
