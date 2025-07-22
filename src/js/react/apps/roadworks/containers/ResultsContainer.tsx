import { createRef, useEffect, useState } from 'react';
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';

import ResultsError from '@/react/common/ResultsError';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '../components/Pagination';
import RoadworkCard from '../components/RoadworkCard';
import { settingsAtom, currentPageAtom, itemsPerPageAtom, keywordAtom, coordinatesAtom } from '../store';
import type Roadwork from '../types/Roadwork';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import { GhostList } from '@/react/common/GhostList';
import { GracefulError } from '../enum/GracefulError';
import { AddressNotFound } from '@/react/common/AddressNotFound';

type ResultsContainerProps = {
  addressRequired?: boolean;
  countNumber: number;
  error?: Error;
  gracefulError?: string;
  loading: boolean;
  pages?: number;
  retriesExhausted?: boolean;
  roadworks: Roadwork[];
  seeAllUrl?: string;
  size: number;
};

function ResultsContainer({
  countNumber,
  error,
  gracefulError,
  loading,
  retriesExhausted,
  roadworks,
  seeAllUrl
}: ResultsContainerProps) {
  const settings = useAtomValue(settingsAtom);
  const scrollTarget = createRef<HTMLHeadingElement>();
  const [initialized, setInitialized] = useState(false);
  const [currentPage] = useAtom(currentPageAtom);
  const itemsPerPage = useAtomValue(itemsPerPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const readKeyword = useAtomCallback((get) => get(keywordAtom));
  const readCoordinates = useAtomCallback((get) => get(coordinatesAtom));

  useScrollToResults(scrollTarget, initialized && !loading);

  useEffect(() => {
    if (!initialized && !loading) {
      setInitialized(true);
    }
  }, [initialized, setInitialized, loading]);

  // Reset to page 1 when roadworks data changes (only on paginated pages)
  useEffect(() => {
    if (!settings.isShortList && roadworks.length > 0) {
      const totalPages = Math.ceil(roadworks.length / itemsPerPage);
      if (currentPage > totalPages) {
        // Reset to page 1 if current page is beyond available pages
        setCurrentPage(1);
      }
    }
  }, [roadworks.length, currentPage, itemsPerPage, setCurrentPage, settings.isShortList]);

  if (error) {
    return retriesExhausted ?
      <ResultsError
        error={error}
        errorMessage={Drupal.t('Failed to fetch roadworks. You can reload the page or try again later.', {}, {context: 'Roadworks search: Fetch failed message'})}
        ref={settings.scrollToTarget ? scrollTarget : undefined}
      /> :
      <GhostList
        bordered={settings.cardsWithBorders || undefined}
        count={settings.roadworkCount ?? 10}
      />;
  }

  const getContent = () => {
    if (loading && !roadworks.length) {
      return (
        <GhostList
          bordered={settings.cardsWithBorders || undefined}
          count={settings.roadworkCount ?? 10}
        />
      );
    }

    if (roadworks.length > 0) {
      const totalPages = Math.ceil(roadworks.length / itemsPerPage);
      const paginatedRoadworks = settings.isShortList ?
        roadworks.slice(0, 3) :
        roadworks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

      const currentCoords = readCoordinates();
      const heading = `
        ${Drupal.formatPlural(countNumber.toString(), '1 result', '@count results', {}, {context: 'Roadworks search: result count'})}
        ${currentCoords ? ` ${Drupal.t('using address', {}, {context: 'React search: Address result display'})} ${currentCoords[2]}` : ''}
      `;

      return (
        <>
          {!settings.isShortList &&
            <ResultsHeader
              resultText={<span>{heading}</span>}
              ref={settings.scrollToTarget ? scrollTarget : undefined}
            />
          }
          {loading ?
            <GhostList
              bordered={settings.cardsWithBorders || undefined}
              count={settings.roadworkCount ?? 10}
            /> :
            paginatedRoadworks.map((roadwork, index) => {
              const cardProps = settings.cardsWithBorders ? { cardModifierClass: 'card--border' } : {};
              return <RoadworkCard key={`roadwork-${index}`} roadwork={roadwork} {...cardProps} />;
            })
          }
          {!settings.isShortList && (
            <Pagination totalPages={totalPages} />
          )}
        </>
      );
    }

    const keyword = readKeyword();
    if (keyword === '') {
      return (
        <ResultsHeader
          ref={settings.scrollToTarget ? scrollTarget : undefined}
          resultText={<span>{Drupal.t('Start by searching with your address.', {}, {context: 'React search: Address required hint'})}</span>}
        />
      );
    }

    if (gracefulError && gracefulError === GracefulError.NO_COORDINATES) {
      return <AddressNotFound ref={settings.scrollToTarget ? scrollTarget : undefined} />;
    }

    return (
      <ResultsEmpty
        ref={settings.scrollToTarget ? scrollTarget : undefined}
      />
    );
  };

  return (
    <div className={`react-search__list-container${loading ? ' loading' : ''}`}>
      {getContent()}
      {
        seeAllUrl && settings.isShortList ?
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
