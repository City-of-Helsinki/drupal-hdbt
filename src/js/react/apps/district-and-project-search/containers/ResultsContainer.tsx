import { useAtomValue, useSetAtom } from 'jotai';
import { type SyntheticEvent, useRef } from 'react';
import useSWR from 'swr';
import { GhostList } from '@/react/common/GhostList';
import useScrollToFirstItem from '@/react/common/hooks/useScrollToFirstItem';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
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
  const resultsListRef = useRef<HTMLDivElement>(null);

  const choices = Boolean(window.location.search?.length);

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
  const { scrollTarget, loadingHeaderRef, skipResultsFocusRef, isSearching } = useSearchFocusManagement(
    isValidating,
    queryString,
    data,
    error,
    urlParams,
  );
  useScrollToResults(scrollTarget, choices);

  if (isSearching) {
    return (
      // Different keys force React to fully replace the DOM between ghost and results
      // instead of patching in place, which prevents a removeChild crash in React version 17.
      <div key='ghost' className='react-search__results'>
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
    <div key='results' className='react-search__results'>
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
