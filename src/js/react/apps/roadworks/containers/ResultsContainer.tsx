import { createRef, useEffect, useState } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import RoadworkCard from '../components/RoadworkCard';
import { settingsAtom, currentPageAtom, itemsPerPageAtom } from '../store';
import type Roadwork from '../types/Roadwork';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';

type ResultsContainerProps = {
  addressRequired?: boolean;
  countNumber: number;
  error?: Error;
  roadworks: Roadwork[];
  loading: boolean;
  retriesExhausted?: boolean;
  seeAllUrl?: string;
  size: number;
  pages?: number;
};

function ResultsContainer({
  countNumber,
  error,
  roadworks,
  loading,
  retriesExhausted,
  seeAllUrl
}: ResultsContainerProps) {
  const { cardsWithBorders } = drupalSettings.helfi_roadworks;

  const settings = useAtomValue(settingsAtom);
  const size = settings.roadworkCount;
  const scrollTarget = createRef<HTMLDivElement>();

  const [initialized, setInitialized] = useState(false);

  // Client-side pagination state
  const [currentPage] = useAtom(currentPageAtom);
  const itemsPerPage = useAtomValue(itemsPerPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  useScrollToResults(scrollTarget, initialized && !loading);

  useEffect(() => {
    if (!initialized && !loading) {
      setInitialized(true);
    }
  }, [initialized, setInitialized, loading]);

  // Reset to page 1 when roadworks data changes (only on paginated pages)
  useEffect(() => {
    if (!settings.hidePagination && roadworks.length > 0) {
      const totalPages = Math.ceil(roadworks.length / itemsPerPage);
      if (currentPage > totalPages) {
        // Reset to page 1 if current page is beyond available pages
        setCurrentPage(1);
      }
    }
  }, [roadworks.length, currentPage, itemsPerPage, setCurrentPage, settings.hidePagination]);

  if (error) {
    return retriesExhausted ?
      <ResultsError
        error={error}
        errorMessage={Drupal.t('Failed to fetch roadworks. You can reload the page or try again later.', {}, {context: 'Roadworks search: Fetch failed message'})}
        ref={scrollTarget}
      /> :
      <GhostList bordered={false} count={size} />;
  }

  const getContent = () => {
    if (loading && !roadworks.length) {
      return <GhostList bordered={false} count={size} />;
    }

    if (roadworks.length > 0) {
      // Calculate pagination for client-side paging (only on full listing page)
      const totalPages = Math.ceil(roadworks.length / itemsPerPage);
      const shouldPaginate = !settings.hidePagination;

      const paginatedRoadworks = shouldPaginate
        ? roadworks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : roadworks.slice(0, 5); // Main page: show max 5 items

      return (
        <>
          <ResultsHeader
            resultText={
              <>
                {Drupal.formatPlural(countNumber.toString(), '1 result', '@count results', {}, {context: 'Roadworks search: result count'})}
              </>
            }
            ref={scrollTarget}
          />
          {loading ?
            <GhostList bordered={cardsWithBorders} count={size} /> :
            paginatedRoadworks.map((roadwork, index) => {
              const cardProps = cardsWithBorders ? { cardModifierClass: 'card--border' } : {};
              return <RoadworkCard key={`roadwork-${index}`} roadwork={roadwork} {...cardProps} />;
            })
          }
          {!settings.hidePagination && (
            <Pagination totalPages={totalPages} />
          )}
        </>
      );
    }

    return <ResultsEmpty ref={scrollTarget} />;
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      {
        seeAllUrl && settings.hidePagination ?
        <div className='see-all-button see-all-button--near-results'>
          <a
            data-hds-component="button"
            href={seeAllUrl}
          >
            {Drupal.t('See all roadworks near you', {}, { context: 'Helsinki near you roadworks search' })}
          </a>
        </div> : null
      }
    </div>
  );
}

export default ResultsContainer;
