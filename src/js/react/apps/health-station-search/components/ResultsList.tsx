import { useAtomValue } from 'jotai';
import { createRef, type SyntheticEvent, useState } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import ResultsMap from '@/react/common/ResultsMap';
import type Result from '@/types/Result';
import AppSettings from '../enum/AppSettings';
import { paramsAtom } from '../store';
import type { HealthStation } from '../types/HealthStation';
import ResultCard from './ResultCard';

type ResultsListProps = {
  // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
  data: any;
  error: string | Error;
  isLoading: boolean;
  isValidating: boolean;
  page?: number;
  // biome-ignore lint/complexity/noBannedTypes: @todo UHF-12066
  updatePage: Function;
};

const ResultsList = ({ data, error, isLoading, isValidating, page, updatePage }: ResultsListProps) => {
  const [useMap, setUseMap] = useState<boolean>(false);
  const { size } = AppSettings;
  const params = useAtomValue(paramsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const { sv_only, address } = params;
  const choices = Boolean(Object.keys(params).length);
  useScrollToResults(scrollTarget, choices);

  if (isLoading || isValidating) {
    return useMap ? <LoadingOverlay /> : <GhostList count={size} />;
  }

  if (error) {
    return <ResultsError error={error} ref={scrollTarget} />;
  }

  if (!data?.hits?.hits.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results = data.hits.hits;
  const total = address && sv_only ? data.hits.hits.length : data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;
  const showPagination = !useMap && (pages > 1 || addLastPage);
  const sv_id = results?.[0]?._source?.id?.[0];
  const mapIds =
    address && sv_only && sv_id
      ? // biome-ignore lint/suspicious/noExplicitAny: @todo UHF-12066
        data?.aggregations?.ids?.buckets?.filter((item: any) => item.key === sv_id)
      : data?.aggregations?.ids?.buckets;

  return (
    <div className='react-search__results'>
      <ResultsHeader
        resultText={
          <>
            {Drupal.formatPlural(
              total,
              '1 health station',
              '@count health stations',
              {},
              { context: 'Health station search: result count' },
            )}
            {data?.addressName
              ? ` ${Drupal.t('using address', {}, { context: 'React search: Address result display' })} ${data?.addressName}`
              : ''}
          </>
        }
        actions={
          <div className='hdbt-search--react__results--tablist' role='tablist'>
            <button
              type='button'
              className='tablist-tab'
              role='tab'
              aria-selected={!useMap}
              aria-controls='hdbt-search--react__results--tabpanel'
              onClick={() => setUseMap(false)}
            >
              {Drupal.t('View as a list', {}, { context: 'React search: result display' })}
            </button>
            <button
              type='button'
              className='tablist-tab'
              role='tab'
              aria-selected={useMap}
              aria-controls='hdbt-search--react__results--tabpanel'
              onClick={() => setUseMap(true)}
            >
              {Drupal.t('View in a map', {}, { context: 'React search: result display' })}
            </button>
          </div>
        }
        actionsClass='hdbt-search--react__results--sort'
        ref={scrollTarget}
      />
      <div id='hdbt-search--react__results--tabpanel' role='tabpanel'>
        {useMap ? (
          <ResultsMap ids={mapIds} />
        ) : (
          // biome-ignore lint/complexity/noUselessFragments: @todo UHF-12066
          <>
            {results.map((hit: Result<HealthStation>) => (
              <ResultCard key={hit._id} {...hit._source} />
            ))}
          </>
        )}
        {showPagination && (
          <Pagination
            currentPage={page || 1}
            pages={5}
            totalPages={addLastPage ? pages + 1 : pages}
            updatePage={(e: SyntheticEvent, nextPage: number) => {
              e.preventDefault();
              updatePage(nextPage);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsList;
