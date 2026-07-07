import { useAtomValue, useSetAtom } from 'jotai';
import { type SyntheticEvent, useEffect, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import type Result from '@/types/Result';
import RssFeedLink from '../components/RssFeedLink';
import ResultCard from '../components/results/ResultCard';
import Global from '../enum/Global';
import useIndexQuery from '../hooks/useIndexQuery';
import useQueryString from '../hooks/useQueryString';
import { setPageAtom, urlAtom } from '../store';
import type NewsItem from '../types/NewsItem';
import SearchMonitorContainer from './SearchMonitorContainer';

type ResultsContainerProps = { hidePagination?: boolean };

const ResultsContainer = ({
  // biome-ignore lint/correctness/noUnusedFunctionParameters: @todo UHF-12501
  hidePagination = false,
}: ResultsContainerProps): JSX.Element => {
  const size = drupalSettings?.helfi_news_archive?.max_results ?? Global.SIZE;
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  const cardsWithBorders = drupalSettings?.helfi_news_archive?.cardsWithBorders ?? false;
  const urlParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const setPage = useSetAtom(setPageAtom);
  const { data, error, isValidating } = useIndexQuery({ keepPreviousData: true, query: queryString });
  const scrollTarget = useRef<HTMLDivElement>(null);
  const dialogTargetRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);
  const scrollToFirstItem = useScrollToFirstItem(resultsListRef, isValidating);
  const loadingHeaderRef = useRef<HTMLHeadingElement>(null);
  const lastDataKeyRef = useRef<string | null>(null);
  const wasSearchingRef = useRef(false);
  const skipResultsFocusRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const hadGhostCardsRef = useRef(false);
  const choices =
    Boolean(urlParams.groups?.length) ||
    Boolean(urlParams.neighbourhoods?.length) ||
    Boolean(urlParams.page) ||
    Boolean(urlParams.keyword?.length) ||
    Boolean(urlParams.topic?.length);

  useScrollToResults(scrollTarget, choices);

  const results = data?.hits?.hits;
  const total = data?.hits?.total?.value || 0;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const currentPage = Number(urlParams.page) || 1;
  const isLoadingNewSearch = isValidating && queryString !== lastDataKeyRef.current;
  const isSearching = (!data && !error) || isLoadingNewSearch;

  useEffect(() => {
    if (!isSearching || !initialLoadDoneRef.current) return;
    hadGhostCardsRef.current = true;
    const node = loadingHeaderRef.current;
    if (node) {
      node.setAttribute('tabindex', '-1');
      node.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSearching]);

  useEffect(() => {
    if (isValidating) {
      if (initialLoadDoneRef.current) {
        wasSearchingRef.current = true;
      }
    } else {
      lastDataKeyRef.current = queryString;
      initialLoadDoneRef.current = true;
      if (wasSearchingRef.current) {
        wasSearchingRef.current = false;
        if (skipResultsFocusRef.current) {
          skipResultsFocusRef.current = false;
          return;
        }
        const node = scrollTarget.current;
        if (node) {
          node.setAttribute('tabindex', '-1');
          node.focus({ preventScroll: true });
          if (!hadGhostCardsRef.current) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          hadGhostCardsRef.current = false;
        }
      }
    }
  }, [isValidating, queryString]);

  // urlUpdateAtom always creates a new urlParams object, so this effect fires on every
  // form submit. When queryString matches lastDataKeyRef, the search is identical to the
  // previous one and SWR won't revalidate — focus results directly in that case.
  // biome-ignore lint/correctness/useExhaustiveDependencies: urlParams is intentionally used as a trigger only
  useEffect(() => {
    if (!initialLoadDoneRef.current || queryString !== lastDataKeyRef.current || !data) return;
    if (skipResultsFocusRef.current) {
      skipResultsFocusRef.current = false;
      return;
    }
    const node = scrollTarget.current;
    if (node) {
      node.setAttribute('tabindex', '-1');
      node.focus({ preventScroll: true });
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [urlParams]);

  if (isSearching) {
    return (
      <div className='react-search__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <GhostList bordered={cardsWithBorders} count={size} />
      </div>
    );
  }

  if (error) {
    return <ResultsError error={error} className='react-search__results' ref={!hideForm ? scrollTarget : undefined} />;
  }

  const searchMonitor = drupalSettings?.hakuvahti && <SearchMonitorContainer dialogTargetRef={dialogTargetRef} />;

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
    scrollToFirstItem();
    skipResultsFocusRef.current = true;
  };

  if (!results?.length) {
    return (
      <>
        <div ref={dialogTargetRef} />
        {hideForm ? (
          <div className='react-search__results'>
            <p>
              {Drupal.t(
                'No results were found for the criteria you entered. Try changing your search criteria.',
                {},
                { context: 'React search: no search results' },
              )}
            </p>
          </div>
        ) : (
          <ResultsEmpty leftActions={searchMonitor || undefined} ref={scrollTarget} />
        )}
      </>
    );
  }

  return (
    <div className='react-search__results'>
      <div ref={dialogTargetRef} />
      {hideForm || (
        <ResultsHeader
          leftActions={searchMonitor || undefined}
          resultText={Drupal.formatPlural(
            total,
            '@count search result',
            '@count search results',
            {},
            { context: 'News archive' },
          )}
          ref={scrollTarget}
        />
      )}
      <div className='hdbt-search--react__results--container' ref={resultsListRef}>
        {results.map((hit: Result<NewsItem>) => (
          <ResultCard
            key={hit._id}
            {...hit._source}
            {...(cardsWithBorders && { cardModifierClass: 'card--border' })}
            {...(hideForm && { cardTitleLevel: 3 })}
          />
        ))}
        {hideForm || <RssFeedLink />}
        {hideForm || (
          <Pagination
            currentPage={currentPage}
            pages={5}
            totalPages={addLastPage ? pages + 1 : pages}
            updatePage={updatePage}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsContainer;
