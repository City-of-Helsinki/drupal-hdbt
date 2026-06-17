// biome-ignore-all lint/suspicious/noExplicitAny: @todo UHF-12501
// biome-ignore-all lint/complexity/noUselessFragments: @todo UHF-12501
import type { estypes } from '@elastic/elasticsearch';
import { createRef, type SyntheticEvent } from 'react';

import { GhostList } from './GhostList';
import useScrollToResults from './hooks/useScrollToResults';
import Pagination from './Pagination';
import ResultsEmpty from './ResultsEmpty';
import ResultsError from './ResultsError';
import ResultsHeader from './ResultsHeader';

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
  currentPage: string | number;
  data?: estypes.SearchResponse<any>;
  error?: string;
  customTotal?: number;
  getHeaderText: () => string;
  isLoading: boolean;
  resultItemCallBack: (item: estypes.SearchHit<any>) => JSX.Element;
  setPage: (page: string) => void;
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
    return <ResultsError error={error} className='react-search__results' ref={scrollTarget} />;
  }

  if (!data?.hits?.hits.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const totalHits = typeof data.hits.total === 'number' ? data.hits.total : (data.hits.total?.value ?? 0);
  const total = customTotal || totalHits;
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
        {results.map((item: estypes.SearchHit<any>) => resultItemCallBack(item))}
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
