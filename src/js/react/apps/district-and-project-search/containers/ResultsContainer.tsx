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

    return fetch(`${url}/${Settings.INDEX}/_search`, {
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
    return (
      <div className="react-search__results">
        <div className='hdbt-search--react__results--container'>
          <h3 className='hdbt-search--react__results--title' ref={scrollTarget}>{Drupal.t('Oh no! We did not find anything matching the search terms.', {}, { context: 'District and project search' })}</h3>
          <p>{Drupal.t('Our website currently shows only some of the projects and residential areas of Helsinki. You can try again by removing some of the limiting search terms or by starting over.', {}, { context: 'District and project search' })}</p>
        </div>
      </div>
    );
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
      <div className="hdbt-search--react__result-top-area">
        {!Number.isNaN(total) &&
          <h3 className='hdbt-search--react__results--title' ref={scrollTarget}>
            { Drupal.formatPlural(total, '1 search result', '@count search results', {}, {context: 'District and project search'}) }
          </h3>
        }
        <div className="hdbt-search--react__results--sort">
          <ResultsSort />
        </div>
      </div>

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
