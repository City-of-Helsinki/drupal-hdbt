import { useAtomValue, useSetAtom } from 'jotai';
import { SyntheticEvent, createRef } from 'react';

import Result from '@/types/Result';
import Pagination from '@/react/common/Pagination';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import ResultsError from '@/react/common/ResultsError';
import { setPageAtom, urlAtom } from '../store';
import useQueryString from '../hooks/useQueryString';
import type NewsItem from '../types/NewsItem';
import ResultCard from '../components/results/ResultCard';
import Global from '../enum/Global';
import ResultsHeader from '@/react/common/ResultsHeader';
import RssFeedLink from '../components/RssFeedLink';
import useIndexQuery from '../hooks/useIndexQuery';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import ResultsEmpty from '@/react/common/ResultsEmpty';

const ResultsContainer = (): JSX.Element => {
  const size = Global.SIZE;
  const urlParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const setPage = useSetAtom(setPageAtom);
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

  const results = data?.hits?.hits;
  const total = data?.hits?.total?.value || 0;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const currentPage = Number(urlParams.page) || 1;

  if (!data && !error) {
    return (
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    );
  }

  if (error) {
    return (
      <ResultsError
        error={error}
        className='react-search__results'
        ref={scrollTarget}
      />
    );
  }

  if (!results?.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
  };

  return (
    <div className="react-search__results">
      <ResultsHeader
        resultText={
          <>
            {Drupal.formatPlural(total, '1 search result', '@count search results', {}, {context: 'News archive'})}
          </>
        }
        ref={scrollTarget}
      />
      <div className='hdbt-search--react__results--container'>
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        {results.map((hit: Result<NewsItem>) => (
          <ResultCard key={hit._id} {...hit._source} />
        ))}
        <RssFeedLink />
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
