import { useAtomValue, useSetAtom } from 'jotai';
import React, { SyntheticEvent, createRef, useEffect } from 'react';
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
import useIndexQuery from '../hooks/useIndexQuery';
import ResultWrapper from '@/react/common/ResultWrapper';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';

const ResultsContainer = () => {
  const size = Global.SIZE;
  const urlParams = useAtomValue(urlAtom);
  const setPage = useSetAtom(setPageAtom);
  const queryString = useQueryString(urlParams);
  const { data, error, isLoading, isValidating } = useIndexQuery({
    keepPreviousData: true,
    query: queryString
  });
  const resultsContainer = createRef<HTMLDivElement>();
  const choices =
    Boolean(urlParams.groups?.length) ||
    Boolean(urlParams.neighbourhoods?.length) ||
    Boolean(urlParams.topic?.length);

  useScrollToResults(resultsContainer, choices);

  const hits = data?.hits?.hits;
  const total = data?.hits.total.value || 0;

  const getResults = () => {
    if (!data) {
      return;
    }

    if (!hits?.length) {
      return <NoResults />;
    }

    if (error) {
      return <ResultsError />;
    }
    
    const pages = Math.floor(total / size);
    const addLastPage = total > size && total % size;
    const currentPage = Number(urlParams.page) || 1;
    const updatePage = (e: SyntheticEvent<HTMLButtonElement>, newPage: number) => {
      e.preventDefault();
      setPage(newPage);
    };

    return (
      <>
        {hits.map((hit: Result<NewsItem>) => (
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

  const loading = isLoading || isValidating;
  return (
    <div className='news-wrapper main-content' ref={resultsContainer}>
      <ResultWrapper className='layout-content' loading={loading}>
        <ResultsHeading
          choices={choices}
          total={total}
        />
        {getResults()}
      </ResultWrapper>
      <MostReadNews />
    </div>
  );
};

export default ResultsContainer;
