import { useAtom, useAtomValue } from 'jotai';
import { type ReactElement, type ReactNode, type RefObject, type SyntheticEvent, useRef } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useSearchFocusManagement from '@/react/common/hooks/useSearchFocusManagement';
import Pagination from '@/react/common/Pagination';
import ResultsEmpty from '@/react/common/ResultsEmpty';
import ResultsError from '@/react/common/ResultsError';
import ResultsHeader from '@/react/common/ResultsHeader';
import SearchMonitor from '@/react/common/SearchMonitor';
import type Result from '@/types/Result';
import type TagType from '@/types/TagType';
import Global from '../enum/Global';
import useVehicleRemovalQuery from '../hooks/useVehicleRemovalQuery';
import { submittedStateAtom } from '../store';
import type VehicleRemoval from '../types/VehicleRemoval';
import ResultCard from './ResultCard';

type VehicleRemovalResponse = {
  hits: {
    total: { value: number; relation: string };
    hits: Result<VehicleRemoval>[];
  };
};

type ResultsListProps = {
  /** Elasticsearch results. */
  data?: VehicleRemovalResponse;
  error: string | Error;
  isLoading: boolean;
  isValidating: boolean;
};

const Header = ({
  total,
  children,
  scrollTarget,
  dialogTarget,
  leftActions,
}: {
  children?: ReactNode;
  dialogTarget: RefObject<HTMLDivElement | null>;
  leftActions?: ReactElement;
  scrollTarget: RefObject<HTMLDivElement | null>;
  total: number;
}) => (
  <div className='hdbt-search--react__results'>
    <div ref={dialogTarget} />
    <ResultsHeader
      leftActions={leftActions}
      resultText={
        total > 0
          ? `${Drupal.formatPlural(String(total), '1 result', '@count results', {}, { context: 'Vehicle removal search' })}`
          : ''
      }
      ref={scrollTarget}
    />
    {children}
  </div>
);

const ResultsList = ({ data, error, isValidating }: ResultsListProps) => {
  const [submittedState, setSubmittedState] = useAtom(submittedStateAtom);
  const { page } = submittedState;
  const dialogTargetRef = useRef<HTMLDivElement>(null);

  const query = useVehicleRemovalQuery();
  const elasticQuery = useVehicleRemovalQuery({ from: 0 });
  const { streets } = useAtomValue(submittedStateAtom);
  const { scrollTarget, loadingHeaderRef, resultsListRef, onPageChange, isSearching } = useSearchFocusManagement(
    isValidating,
    query,
    data,
    error,
    submittedState,
  );

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
        dialogTitle: Drupal.t(
          'Subscribe to the Vehicle Removal Alert Service',
          {},
          { context: 'Vehicle removal search' },
        ),
        formDescription: [
          Drupal.t(
            'Make a search according to your specifications and save it as a Vehicle Removal Alert. You can add more than one street to the same Vehicle Removal Alert.',
            {},
            { context: 'Vehicle removal search' },
          ),
          Drupal.t(
            'You will be notified of new search matches no more than once a day. You can cancel your subscription using the link sent with each notification.',
            {},
            { context: 'Vehicle removal search' },
          ),
          Drupal.t('Required fields are indicated with an asterisk (*).', {}, { context: 'Vehicle removal search' }),
        ],
        noSelectionsNotification: Drupal.t(
          'You have not selected any search criteria. You will be informed of all vehicle removal requests.',
          {},
          { context: 'Vehicle removal search' },
        ),
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
        buttonLabel: Drupal.t(
          'Subscribe to the Vehicle Removal Alert Service',
          {},
          { context: 'Vehicle removal search' },
        ),
        submittedTitle: Drupal.t(
          'Your Vehicle Removal Alert Service subscription is almost ready',
          {},
          { context: 'Vehicle removal search' },
        ),
        submittedDescription: Drupal.t(
          'Confirm your subscription to the Vehicle Removal Alert Service with a link that you can choose to receive by email, SMS or both. If you subscribed to both email and SMS alerts, please confirm the subscription separately for both.',
          {},
          { context: 'Vehicle removal search' },
        ),
      }}
    />
  );

  if (isSearching) {
    return (
      <div className='hdbt-search--react__results'>
        <ResultsHeader
          resultText={Drupal.t('Searching for results...', {}, { context: 'React search: Fetching results title' })}
          ref={loadingHeaderRef}
        />
        <GhostList count={Global.size} />
      </div>
    );
  }

  if (error) {
    return <ResultsError error={error} ref={scrollTarget} />;
  }

  if (!data?.hits?.hits?.length) {
    return (
      <Header total={0} dialogTarget={dialogTargetRef} scrollTarget={scrollTarget}>
        <ResultsEmpty
          ref={scrollTarget}
          leftActions={searchMonitor}
          resultText={Drupal.t('No vehicle removal requests', {}, { context: 'Vehicle removal search' })}
          bodyText={Drupal.t(
            'No vehicle removal requests were found with your search criteria.',
            {},
            { context: 'Vehicle removal search' },
          )}
          additionalDescription={Drupal.t(
            'Subscribe to the Vehicle Removal Alert Service to be notified of new removal requests.',
            {},
            { context: 'Vehicle removal search' },
          )}
        />
      </Header>
    );
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
    onPageChange();
  };

  return (
    <Header total={total} dialogTarget={dialogTargetRef} scrollTarget={scrollTarget} leftActions={searchMonitor}>
      <div ref={resultsListRef}>
        {results.map((hit) => (
          <ResultCard key={hit._id} item={hit._source} />
        ))}
      </div>
      {showPagination && (
        <Pagination currentPage={page || 1} pages={5} totalPages={totalPages} updatePage={updatePage} />
      )}
    </Header>
  );
};

export default ResultsList;
