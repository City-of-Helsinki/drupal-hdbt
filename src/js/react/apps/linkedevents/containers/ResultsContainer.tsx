import { LoadingSpinner} from 'hds-react';

import { useAtomValue } from 'jotai';
import type Event from '../types/Event';
import Pagination from '../components/Pagination';
import EmptyMessage from '../components/EmptyMessage';
import ResultCard from '../components/ResultCard';
import SeeAllButton from '../components/SeeAllButton';
import { settingsAtom } from '../store';

type ResultsContainerProps = {
  count: number;
  events: Event[];
  loading: boolean;
  error?: Error;
};

function ResultsContainer({ count, events, loading, error }: ResultsContainerProps) {
  const settings = useAtomValue(settingsAtom);

  if (error || !settings) {
    return <p>{Drupal.t('Could not retrieve events')}</p>;
  }

  const size = settings.eventCount;
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
