import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { LoadingSpinner } from 'hds-react';
import React, { SyntheticEvent } from 'react';
import { setPageAtom, urlAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import NoResults from '../components/results/NoResults';
import ResultsError from '../components/results/ResultsError';
import Result from '@/types/Result';
import type NewsItem from '../types/NewsItem';
import ResultCard from '../components/results/ResultCard';
import Global from '../enum/Global';
import ResultsHeading from '../components/results/ResultsHeading';
import MostReadNews from '../components/results/MostReadNews';
import Pagination from '@/react/common/Pagination';
import RssFeedLink from '../components/RssFeedLink';

const ResultsContainer = () => {
  const size = Global.SIZE;
  const index = Global.INDEX;
  const urlParams = useAtomValue(urlAtom);
  const setPage = useSetAtom(setPageAtom);
  const queryString = useQueryString(urlParams);
  const fetcher = () => {
    const proxyUrl = drupalSettings?.helfi_news_archive?.elastic_proxy_url;
    const url: string|undefined = proxyUrl || process.env.REACT_APP_ELASTIC_URL;

    return fetch(`${url}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: queryString,
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(queryString, fetcher, {
    revalidateOnFocus: false
  });

  const total = data?.hits?.total.value || 0;

  const getResults = () => {
    if (!data && !error) {
      return <LoadingSpinner />;
    }

    if (!data?.hits?.hits.length) {
      return <NoResults />;
    }

    if (error) {
      return <ResultsError />;
    }

    const results = data.hits.hits;
    const pages = Math.floor(total / size);
    const addLastPage = total > size && total % size;
    const currentPage = Number(urlParams.page) || 1;
    const updatePage = (e: SyntheticEvent<HTMLButtonElement>, newPage: number) => {
      e.preventDefault();
      setPage(newPage);
    };

    return (
      <>
        {results.map((hit: Result<NewsItem>) => (
          <ResultCard
            key={hit._id}
            {...hit._source}
          />
        ))}
        <RssFeedLink />
        <Pagination
          currentPage={currentPage}
          pages={5}
          totalPages={addLastPage ? pages + 1 : pages}
          updatePage={updatePage}
        />
      </>
    );
  };

  const choices =
    Boolean(urlParams.groups?.length) ||
    Boolean(urlParams.neighbourhoods?.length) ||
    Boolean(urlParams.topic?.length);

  return (
    <div className='news-wrapper main-content'>
      <div className='layout-content'>
        <ResultsHeading
          choices={choices}
          total={total}
        />
        {getResults()}
      </div>
      <MostReadNews />
    </div>
  );
};

export default ResultsContainer;
