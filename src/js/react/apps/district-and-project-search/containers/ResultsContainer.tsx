import { LoadingSpinner } from 'hds-react';
import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { useEffect, SyntheticEvent } from 'react';

import Pagination from '@/react/common/Pagination';
import ResultCard from '../components/results/ResultCard';
import ResultsSort from '../components/results/ResultsSort';
import { configurationsAtom, pageAtom, setPageAtom, urlAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import Global from '../enum/Global';
import Settings from '../enum/Settings';
import type URLParams from '../types/URLParams';
import Result from '../types/Result';

const ResultsContainer = (): JSX.Element => {
  const { size } = Global;
  const urlParams: URLParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const { error: initializationError } = useAtomValue(configurationsAtom);
  const setPage = useSetAtom(setPageAtom);
  const currentPage = useAtomValue(pageAtom);
  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_kymp_district_project_search?.elastic_proxy_url;
    const url: string | undefined = proxyUrl || process.env.REACT_APP_ELASTIC_URL;

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

  useEffect(() => {
    const el = document.getElementById('helfi-kymp-district-project-search');

    if (el && window.location.search) {
      const titleEl = el.querySelector<HTMLElement>('.district-project-search__results');
      if (!titleEl) return;
      titleEl.setAttribute('tabindex', '0');
      titleEl.focus();
      el.scrollIntoView({ behavior: 'smooth' });
      titleEl.setAttribute('tabindex', '-1');
    }
  }, [data]);

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  if (!data?.hits?.hits.length) {
    return (
      <div className="district-project-search__results">
        <div className='district-project-search__listing__no-results'>
          <h2>{Drupal.t('Oh no! We did not find anything matching the search terms.', {}, { context: 'District and project search' })}</h2>
          <p>{Drupal.t('Our website currently shows only some of the projects and residential areas of Helsinki. You can try again by removing some of the limiting search terms or by starting over.', {}, { context: 'District and project search' })}</p>
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
      <div className='district-project-search__results'>
        {Drupal.t('The website encountered an unexpected error. Please try again later.')}
      </div>
    );
  }

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  return (
    <div className="district-project-search__results">
      <div className="district-project-search__results_heading">
        <div className="district-project-search__count__container">
          <span className="district-project-search__count">
            <span className="district-project-search__count-total">{total} </span>
            <span className="district-project-search__count-label">{Drupal.t('search results', {}, { context: 'District and project search' })} </span>
          </span>
        </div>
        <div className="district-project-search__sort__container">
          <ResultsSort />
        </div>
      </div>

      <div className='district-project-search__container'>
        <ul className='district-project-search__listing'>
          {results.map((hit: Result) => (
            <ResultCard key={hit._id} {...hit._source} />
          ))}
        </ul>
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
