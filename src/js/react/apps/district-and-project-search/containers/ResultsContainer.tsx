import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { SyntheticEvent, createRef } from 'react';

import Result from '../types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsError from '@/react/common/ResultsError';
import ResultCard from '../components/results/ResultCard';
import ResultsSort from '../components/results/ResultsSort';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import Global from '../enum/Global';
import Settings from '../enum/Settings';
import type URLParams from '../types/URLParams';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import useTimeoutFetch from '@/react/common/hooks/useTimeoutFetch';

const ResultsContainer = (): JSX.Element => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const scrollTarget = createRef<HTMLDivElement>();

  const choices = Boolean(window.location.search?.length);
  useScrollToResults(scrollTarget, choices);

  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_react_search?.elastic_proxy_url;
    const url: string | undefined = proxyUrl;

    return useTimeoutFetch(`${url}/${Settings.INDEX}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: queryString,
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(queryString, fetcher, {
    revalidateOnFocus: false,
  });

  if (!data && !error) {
    return (
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    );
  }

  if (error || initializationError) {
    return (
      <ResultsError
        error={error || initializationError}
        className='react-search__results'
        ref={scrollTarget}
      />
    );
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
  };

  return (
    <div className="react-search__results">
      <ResultsHeader
        resultText={
          <>
            { Drupal.formatPlural(total, '1 search result', '@count search results',{},{ context: 'District and project search' }) }
          </>
        }
        actions={<ResultsSort />}
        actionsClass="hdbt-search--react__results--sort"
        ref={scrollTarget}
      />

      <div className='hdbt-search--react__results--container'>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          {results.map((hit: Result) => (
            <ResultCard key={hit._id} {...hit._source} />
          ))}
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
