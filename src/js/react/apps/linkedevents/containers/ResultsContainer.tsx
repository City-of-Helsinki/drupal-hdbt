import parse from 'html-react-parser';

import EmptyMessage from '../components/EmptyMessage';
import ResultCard from '../components/ResultCard';
import type Event from '@/types/Event';

type ResultsContainerProps = {
  count: Number | null,
  events: Event[],
  loading: boolean,
  error?: Error,
};

function ResultsContainer({ count, events, loading, error }: ResultsContainerProps) {

  if (error) {
    return <p>{Drupal.t('Could not retrieve events')}</p>;
  }

  return (
    <div className='event-list__list-container'>
      {!loading && count && !Number.isNaN(count) &&
        <div className='event-list__count'>
          <strong>{!loading && count}{loading && Drupal.t('loading')}</strong> {Drupal.t('events')}
        </div>
      }
      {!loading && events?.length > 0 && events.map(event => <ResultCard key={event.id} {...event} />)}
      {!loading && events?.length === 0 && <EmptyMessage />}
      {loading &&
        <div className='event-list-spinner'>
          {parse(Drupal.theme('ajaxProgressThrobber'))}
        </div>
      }
    </div>
  );

}

export default ResultsContainer;
