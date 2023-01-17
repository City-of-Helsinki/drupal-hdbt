import { LoadingSpinner} from 'hds-react';

import type Event from '../types/Event';
import Pagination from '../components/Pagination';
import EmptyMessage from '../components/EmptyMessage';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import ROOT_ID from '../enum/RootId';
import Global from '../enum/Global';

type ResultsContainerProps = {
  count: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ count, events, loading, error }: ResultsContainerProps) {
  const { size } = Global;
  const rootElement: HTMLElement | null = document.getElementById(ROOT_ID);
  const eventCount = rootElement?.dataset?.eventCount || '-1';

  if (error) {
    return <p>{Drupal.t('Could not retrieve events')}</p>;
  }

  const pages = Math.floor(count / size);
  const addLastPage = count > size && count % size;

  return (
    <div className='event-list__list-container'>
      {!loading && count && !Number.isNaN(count) &&
        <div className='event-list__count'>
          <strong>{!loading && count}{loading && Drupal.t('loading')}</strong> {Drupal.t('events')}
        </div>
      }
      {!loading && events?.length > 0 &&
        <>
          {events.map(event => <ResultCard key={event.id} {...event} />)}
          <Pagination pages={5} totalPages={addLastPage ? pages + 1 : pages} />
        </>
      }
      {!loading && events?.length === 0 && <EmptyMessage />}
      {!loading && <SeeAllButton />}
      {loading &&
        <div className='event-list__loading-spinner'>
          <LoadingSpinner />
        </div>
      }
    </div>
  );

}

export default ResultsContainer;
