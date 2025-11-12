import { useAtomValue, useSetAtom } from 'jotai';
import { createRef, type SyntheticEvent } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
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

type ResultsContainerProps = { hidePagination?: boolean };

const ResultsContainer = ({
  // biome-ignore lint/correctness/noUnusedFunctionParameters: @todo UHF-12501
  hidePagination = false,
}: ResultsContainerProps): JSX.Element => {
  const size = drupalSettings?.helfi_news_archive?.max_results ?? Global.SIZE;
  const hideForm = drupalSettings?.helfi_news_archive?.hide_form ?? false;
  const cardsWithBorders =
    drupalSettings?.helfi_news_archive?.cardsWithBorders ?? false;
  const urlParams = useAtomValue(urlAtom);
  const queryString = useQueryString(urlParams);
  const setPage = useSetAtom(setPageAtom);
  const { data, error } = useIndexQuery({
    keepPreviousData: true,
    query: queryString,
  });
  const scrollTarget = createRef<HTMLDivElement>();
  const choices =
    Boolean(urlParams.groups?.length) ||
    Boolean(urlParams.neighbourhoods?.length) ||
    Boolean(urlParams.page) ||
    Boolean(urlParams.keyword?.length) ||
    Boolean(urlParams.topic?.length);

  useScrollToResults(scrollTarget, choices);

  const results = data?.hits?.hits;
  const total = data?.hits?.total?.value || 0;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const currentPage = Number(urlParams.page) || 1;

  if (!data && !error) {
    return <GhostList bordered={cardsWithBorders} count={size} />;
  }

  if (error) {
    return (
      <ResultsError
        error={error}
        className='react-search__results'
        ref={!hideForm ? scrollTarget : undefined}
      />
    );
  }

  if (!results?.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const updatePage = (
    e: SyntheticEvent<HTMLButtonElement>,
    newPage: number,
  ) => {
    e.preventDefault();
    setPage(newPage);
  };

  return (
    <div className='react-search__results'>
      {hideForm || (
        <ResultsHeader
          resultText={
            // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12501
            <>
              {Drupal.formatPlural(
                total,
                '@count search result',
                '@count search results',
                {},
                { context: 'News archive' },
              )}
            </>
          }
          ref={scrollTarget}
        />
      )}
      <div className='hdbt-search--react__results--container'>
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
