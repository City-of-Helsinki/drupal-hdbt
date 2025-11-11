import { types } from '@elastic/elasticsearch';
import { createRef, SyntheticEvent } from 'react';

import { GhostList } from './GhostList';
import ResultsError from './ResultsError';
import useScrollToResults from './hooks/useScrollToResults';
import ResultsEmpty from './ResultsEmpty';
import ResultsHeader from './ResultsHeader';
import Pagination from './Pagination';

export const ResultsWrapper = ({
  currentPage,
  data,
  customTotal,
  error,
  getHeaderText,
  isLoading,
  resultItemCallBack,
  setPage,
  sortElement,
  shouldScroll = false,
  size = 10,
}: {
  currentPage: string|number;
  data?: types.SearchResponse<any>;
  error?: string;
  customTotal?: number;
  getHeaderText: () => string;
  isLoading: boolean;
  resultItemCallBack: (item: types.SearchHit<any>) => JSX.Element;
  setPage: (string) => void;
  sortElement?: JSX.Element;
  shouldScroll?: boolean;
  size: number;
}) => {
  const scrollTarget = createRef<HTMLHeadingElement>();
  useScrollToResults(scrollTarget, shouldScroll);

  if (!data && isLoading) {
    return <GhostList count={size} bordered />;
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

  if (!data?.hits?.hits.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const total = customTotal || data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    setPage(index.toString());
  };

  return (
    <div className='react-search__results'>
      <ResultsHeader
        actions={sortElement}
        actionsClass='hdbt-search--react__results--sort'
        ref={scrollTarget}
        resultText={<>{getHeaderText()}</>}
      />
      <div className='hdbt-search--react__results--list'>
        {results.map((item: types.SearchHit<any>) => resultItemCallBack(item))}
        <Pagination
          currentPage={Number(currentPage)}
          pages={5}
          totalPages={addLastPage ? pages + 1 : pages}
          updatePage={updatePage}
        />
      </div>
    </div>
  );
};
