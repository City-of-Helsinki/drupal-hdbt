import { LoadingSpinner } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';

import { SyntheticEvent } from 'react';
import Pagination from '@/react/common/Pagination';
import ResultCard from '../components/results/ResultCard';
import ResultsSort from '../components/results/ResultsSort';
import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import useQueryString from '../hooks/useQueryString';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import type URLParams from '../types/URLParams';

const ResultsContainer = () => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_rekry_job_search?.elastic_proxy_url;
    const url: string | undefined = proxyUrl || process.env.REACT_APP_ELASTIC_URL;

    return fetch(`${url}/_search`, {
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
    return <LoadingSpinner />;
  }

  if (!data?.hits?.hits.length) {
    return (
      <div className='job-search__no-results'>
        <div className='job-search__no-results__heading'>{Drupal.t('No results')}</div>
        <div>
          {Drupal.t(
            'Jobs meeting search criteria was not found. Try different search criteria.',
            {},
            { context: 'Job search no results message' }
          )}
        </div>
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  if (error || initializationError) {
    console.warn(`Error loading data. ${  error || initializationError}`);
    return (
      <div className='job-search__results'>
        {Drupal.t('The website encountered an unexpected error. Please try again later.')}
      </div>
    );
  }

  // Total number of available jobs
  const jobs: number = data?.aggregations?.[IndexFields.NUMBER_OF_JOBS]?.value;
  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  return (
    <div className='job-search__results'>
      <div className='job-search__results-stats'>
        <div className='job-listing-search__count-container'>
          {!Number.isNaN(jobs) && !Number.isNaN(total) && (
            <>
              <span className='job-listing-search__count'>{jobs}</span>
              {` ${ 
                Drupal.t(
                  'open positions (@listings job listings)',
                  { '@listings': total },
                  { context: 'Job search results statline' }
                )}`}
            </>
          )}
        </div>
        <ResultsSort />
      </div>
      {results.map((hit: any) => (
        <ResultCard key={hit._id} {...hit._source} />
      ))}
      <Pagination
        currentPage={currentPage}
        pages={5}
        totalPages={addLastPage ? pages + 1 : pages}
        updatePage={updatePage}
      />
    </div>
  );
};

export default ResultsContainer;
