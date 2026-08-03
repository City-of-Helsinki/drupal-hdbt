import { useAtomValue, useSetAtom } from 'jotai';
import { type JSX, type SyntheticEvent, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import type Result from '@/types/Result';
import RssFeedLink from '../components/RssFeedLink';
import ResultCard from '../components/results/ResultCard';
import Global from '../enum/Global';
import useIndexQuery from '../hooks/useIndexQuery';
import useQueryString from '../hooks/useQueryString';
import { setPageAtom, urlAtom } from '../store';
import type NewsItem from '../types/NewsItem';
import SearchMonitorContainer from './SearchMonitorContainer';

type ResultsContainerProps = { hidePagination?: boolean };

const ResultsContainer = ({
  // biome-ignore lint/correctness/noUnusedFunctionParameters: @todo UHF-12501
  hidePagination = false,
}: ResultsContainerProps): JSX.Element => {
  const size = drupalSettings?.helfi_news_archive?.max_results ?? Global.SIZE;
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  const cardsWithBorders = drupalSettings?.helfi_news_archive?.cardsWithBorders ?? false;
  const urlParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const setPage = useSetAtom(setPageAtom);
  const { data, error, isValidating } = useIndexQuery({ keepPreviousData: true, query: queryString });
  const dialogTargetRef = useRef<HTMLDivElement>(null);
  const { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching } = useSearchFocusManagement(
    isValidating,
    queryString,
    data,
    error,
    urlParams,
  );

  const results = data?.hits?.hits;
  const total = data?.hits?.total?.value || 0;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const currentPage = Number(urlParams.page) || 1;

  if (isSearching) {
    return (
      // Different keys force React to fully replace the DOM between ghost and results
      // instead of patching in place, which prevents a removeChild crash in React version 17.
      <div key='ghost' className='react-search__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <GhostList bordered={cardsWithBorders} count={size} />
      </div>
    );
  }

  if (error) {
    return <ResultsError error={error} className='react-search__results' ref={!hideForm ? scrollTarget : undefined} />;
  }

  const searchMonitor = drupalSettings?.hakuvahti && <SearchMonitorContainer dialogTargetRef={dialogTargetRef} />;

  const updatePage = (e: SyntheticEvent<HTMLButtonElement>, newPage: number) => {
    e.preventDefault();
    setPage(newPage);
    onPageChange();
  };

  if (!results?.length) {
    return (
      <>
        <div ref={dialogTargetRef} />
        {hideForm ? (
          <div key='results' className='react-search__results'>
            <p>
              {Drupal.t(
                'No results were found for the criteria you entered. Try changing your search criteria.',
                {},
                { context: 'React search: no search results' },
              )}
            </p>
          </div>
        ) : (
          <ResultsEmpty leftActions={searchMonitor || undefined} ref={scrollTarget} />
        )}
      </>
    );
  }

  return (
    <div className='react-search__results'>
      <div ref={dialogTargetRef} />
      {hideForm || (
        <ResultsHeader
          leftActions={searchMonitor || undefined}
          resultText={Drupal.formatPlural(
            total,
            '@count search result',
            '@count search results',
            {},
            { context: 'News archive' },
          )}
          ref={scrollTarget}
        />
      )}
      <div className='hdbt-search--react__results--container' ref={resultsListRef}>
        {results.map((hit: Result<NewsItem>) => (
          <ResultCard
            key={hit._id}
            {...hit._source}
            {...(cardsWithBorders && { cardModifierClass: 'card--border' })}
            {...(hideForm && { cardTitleLevel: 3 })}
          />
        ))}
        {hideForm || <RssFeedLink />}
        {hideForm || (
          <Pagination
            currentPage={currentPage}
            pages={5}
            totalPages={addLastPage ? pages + 1 : pages}
            updatePage={updatePage}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsContainer;
