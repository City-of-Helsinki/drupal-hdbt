import { useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent, createRef } from 'react';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import ResultWrapper from '@/react/common/ResultWrapper';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import { setPageAtom, urlAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import NoResults from '../components/results/NoResults';
import ResultsError from '@/react/common/ResultsError';
import type NewsItem from '../types/NewsItem';
import ResultCard from '../components/results/ResultCard';
import Global from '../enum/Global';
import ResultsHeading from '../components/results/ResultsHeading';
import MostReadNews from '../components/results/MostReadNews';
import RssFeedLink from '../components/RssFeedLink';
import useIndexQuery from '../hooks/useIndexQuery';

const ResultsContainer = () => {
  const size = Global.SIZE;
  const urlParams = useAtomValue(urlAtom);
  const setPage = useSetAtom(setPageAtom);
  const queryString = useQueryString(urlParams);
  const { data, error, isLoading, isValidating } = useIndexQuery({
    keepPreviousData: true,
    query: queryString
  });
  const scrollTarget = createRef<HTMLDivElement>();
  const choices =
    Boolean(urlParams.page) ||
    Boolean(urlParams.groups?.length) ||
    Boolean(urlParams.neighbourhoods?.length) ||
    Boolean(urlParams.topic?.length);

  useScrollToResults(scrollTarget, choices);

  const hits = data?.hits?.hits;
  const total = data?.hits.total.value || 0;

  const getResults = () => {
    if (!data && !error) {
      return;
    }

    if (error) {
      return (
        <ResultsError
          error={error}
          className='news-listing__no-results'
          ref={scrollTarget}
        />
      );
    }

    if (!hits?.length) {
      return <NoResults ref={scrollTarget}/>;
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
    <div className='news-wrapper main-content'>
      <ResultWrapper className='layout-content' loading={loading}>
        <ResultsHeading
          choices={choices}
          ref={scrollTarget}
          total={total}
        />
        {getResults()}
      </ResultWrapper>
      <MostReadNews />
    </div>
  );
};

export default ResultsContainer;
