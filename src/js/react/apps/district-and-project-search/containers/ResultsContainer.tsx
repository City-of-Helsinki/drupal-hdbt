import { useAtomValue, useSetAtom } from 'jotai';
import { type SyntheticEvent, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { GhostList } from '@/react/common/GhostList';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultCard from '../components/results/ResultCard';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import Settings from '../enum/Settings';
import useQueryString from '../hooks/useQueryString';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import type Result from '../types/Result';
import type URLParams from '../types/URLParams';

const ResultsContainer = (): JSX.Element => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const scrollTarget = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);
  const loadingHeaderRef = useRef<HTMLHeadingElement>(null);
  const lastDataKeyRef = useRef<string | null>(null);
  const wasSearchingRef = useRef(false);
  const skipResultsFocusRef = useRef(false);
  const initialLoadDoneRef = useRef(false);
  const hadGhostCardsRef = useRef(false);

  const choices = Boolean(window.location.search?.length);
  useScrollToResults(scrollTarget, choices);

  const fetcher = async () => {
    const proxyUrl = drupalSettings?.helfi_react_search?.elastic_proxy_url;
    const url: string | undefined = proxyUrl;

    // biome-ignore lint/correctness/useHookAtTopLevel: @todo UHF-12501
    return useTimeoutFetch(`${url}/${Settings.INDEX}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: queryString,
    }).then((res) => res.json());
  };

  const { data, error, isValidating } = useSWR(queryString, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
  const scrollToFirstItem = useScrollToFirstItem(resultsListRef, isValidating);

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

  // Moving the focus to the results header even when the search query is unchanged.
  // To do this we compare the queryString to the lastDataKeyRef and if they are identical
  // we just move the focus directly to the results heading.
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
        <GhostList count={size} />
      </div>
    );
  }

  if (error || initializationError) {
    return <ResultsError error={error || initializationError} className='react-search__results' ref={scrollTarget} />;
  }

  if (!data?.hits?.hits.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
    scrollToFirstItem();
    skipResultsFocusRef.current = true;
  };

  return (
    <div className='react-search__results'>
      <ResultsHeader
        resultText={
          // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12501
          <>
            {Drupal.formatPlural(
              total,
              '1 search result',
              '@count search results',
              {},
              { context: 'District and project search' },
            )}
          </>
        }
        actions={<ResultsSort />}
        actionsClass='hdbt-search--react__results--sort'
        ref={scrollTarget}
      />

      <div className='hdbt-search--react__results--container'>
        <div ref={resultsListRef}>
          {results.map((hit: Result) => (
            <ResultCard key={hit._id} _id={hit._id} {...hit._source} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          pages={5}
          totalPages={addLastPage ? pages + 1 : pages}
          updatePage={updatePage}
        />
      </div>
    </div>
  );
};

export default ResultsContainer;
