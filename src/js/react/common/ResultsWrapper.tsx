// biome-ignore-all lint/suspicious/noExplicitAny: @todo UHF-12501
// biome-ignore-all lint/complexity/noUselessFragments: @todo UHF-12501
import type { estypes } from '@elastic/elasticsearch';
import type { SyntheticEvent } from 'react';
import { GhostList } from './GhostList';
import useSearchFocusManagement from './hooks/useSearchFocusManagement';
import Pagination from './Pagination';
import ResultsEmpty from './ResultsEmpty';
import ResultsError from './ResultsError';
import ResultsHeader from './ResultsHeader';

export const ResultsWrapper = <Trigger,>({
  currentPage,
  data,
  customTotal,
  error,
  getHeaderText,
  isValidating,
  queryString,
  resultItemCallBack,
  setPage,
  sortElement,
  trigger,
  size = 10,
}: {
  currentPage: string | number;
  data?: estypes.SearchResponse<any>;
  error?: string;
  customTotal?: number;
  getHeaderText: () => string;
  // Drives the ghost "Searching for results..." state and focus handling. Pass the
  // SWR isValidating flag (combined with any app-specific loading, e.g. aggregations
  // not being ready yet).
  isValidating: boolean;
  // The SWR key of the current search. Used to tell a fresh fetch from a cache hit.
  queryString: string;
  resultItemCallBack: (item: estypes.SearchHit<any>) => JSX.Element;
  setPage: (page: string) => void;
  sortElement?: JSX.Element;
  // Value that changes whenever the user (re)submits a search, e.g. the submitted
  // state/params atom. Lets a resubmitted, unchanged query move focus to the results.
  trigger: Trigger;
  size: number;
}) => {
  const { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching } = useSearchFocusManagement(
    isValidating,
    queryString,
    data,
    error,
    trigger,
  );

  if (isSearching) {
    return (
      // Different keys force React to fully replace the DOM between ghost and results
      // instead of patching in place, which prevents a removeChild crash in React version 17.
      <div key='ghost' className='react-search__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <GhostList count={size} bordered />
      </div>
    );
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
    onPageChange();
  };

  return (
    <div key='results' className='react-search__results'>
      <ResultsHeader
        actions={sortElement}
        actionsClass='hdbt-search--react__results--sort'
        ref={scrollTarget}
        resultText={<>{getHeaderText()}</>}
      />
      <div className='hdbt-search--react__results--list' ref={resultsListRef}>
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
