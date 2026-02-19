import { useAtom, useAtomValue } from 'jotai';
import { type SyntheticEvent, createRef } from 'react';

import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import SearchMonitor from '@/react/common/SearchMonitor';
import type Result from '@/types/Result';
import Global from '../enum/Global';
import { submittedStateAtom } from '../store';
import type VehicleRemoval from '../types/VehicleRemoval';
import ResultCard from './ResultCard';
import { GhostList } from '@/react/common/GhostList';
import useVehicleRemovalQuery from '../hooks/useVehicleRemovalQuery';
import type TagType from '@/types/TagType';

type ResultsListProps = {
  /** Elasticsearch results. */
  data: unknown;
  error: string | Error;
  isLoading: boolean;
  isValidating: boolean;
};

const ResultsList = ({ data, error, isLoading, isValidating }: ResultsListProps) => {
  const [submittedState, setSubmittedState] = useAtom(submittedStateAtom);
  const { page } = submittedState;
  const scrollTarget = createRef<HTMLDivElement>();
  const dialogTargetRef = createRef<HTMLDivElement>();
  useScrollToResults(scrollTarget, Boolean(data));

  const elasticQuery = useVehicleRemovalQuery();
  const { streets } = useAtomValue(submittedStateAtom);

  const selectionTags: TagType[] = streets.map((street) => ({
    tag: street.label,
  }));

  const { hakuvahti } = drupalSettings;
  const searchMonitor = hakuvahti && (
    <SearchMonitor
      apiUrl={hakuvahti.apiUrl}
      dialogTargetRef={dialogTargetRef}
      elasticQuery={elasticQuery}
      enabledNotificationMethods={['email_sms', 'email', 'sms']}
      selectionTags={selectionTags}
      secureQuery={true}
      texts={{
        tosCheckboxLabel: Drupal.t(
          'I have read the privacy policy and consent to the processing of my personal data for the purposes of the Vehicle Removal Alert Service',
          {},
          { context: 'Vehicle removal search' },
        ),
        tosLinkText: Drupal.t(
          'Read the vehicle removal and Vehicle Removal Alert Service (Siirtovahti Service) privacy policy',
          {},
          { context: 'Vehicle removal search' },
        ),
        tosLinkUrl: hakuvahti.texts.hakuvahti_tos_link_url || '',
        noSelectionsNotification: Drupal.t(
          'You have not selected any search criteria. You will be informed of all vehicle removal requests.',
          {},
          { context: 'Vehicle removal search' },
        ),
      }}
    />
  );

  if (isLoading || isValidating) {
    return <GhostList count={Global.size} />;
  }

  if (error) {
    return <ResultsError error={error} ref={scrollTarget} />;
  }

  if (!data?.hits?.hits?.length) {
    return <ResultsEmpty ref={scrollTarget} />;
  }

  const results: Result<VehicleRemoval>[] = data.hits.hits;
  const total: number = data.hits.total.value;
  const pages = Math.floor(total / Global.size);
  const addLastPage = total > Global.size && total % Global.size;
  const totalPages = addLastPage ? pages + 1 : pages;
  const showPagination = pages > 1 || addLastPage;

  const updatePage = (e: SyntheticEvent, nextPage: number) => {
    e.preventDefault();
    setSubmittedState({ page: nextPage });
  };

  return (
    <div className='hdbt-search--react__results'>
      <div ref={dialogTargetRef} />
      <ResultsHeader
        leftActions={searchMonitor}
        resultText={`${Drupal.formatPlural(String(total), '1 result', '@count results', {}, { context: 'Vehicle removal search' })}`}
        ref={scrollTarget}
      />
      {results.map((hit) => (
        <ResultCard key={hit._id} item={hit._source} />
      ))}
      {showPagination && (
        <Pagination currentPage={page || 1} pages={5} totalPages={totalPages} updatePage={updatePage} />
      )}
    </div>
  );
};

export default ResultsList;
