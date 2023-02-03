import { useAtomValue } from 'jotai';
import useSWR from 'swr';
import { LoadingSpinner } from 'hds-react';
import { configurationsAtom } from '../store';
import useQueryString from '../hooks/UseQueryString';
import GlobalSettings from '../enum/GlobalSettings';
import ResultCard from '../components/ResultCard';
import Result from '@/types/Result';
import { School } from '../types/School';


const ResultsContainer = () => {
  const { baseUrl } = useAtomValue(configurationsAtom);
  const queryString = useQueryString();

  if (!baseUrl) {
    return null;
  }

  const fetcher = () => {
    const {index} = GlobalSettings;

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: queryString,
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(queryString, fetcher, {
    revalidateOnFocus: false
  });

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  // @todo: Implement no results message
  if (!data?.hits?.hits.length) {
    return (
      <div className='react-search__no-results'>
        No results
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;

  return (
    <div className='react-search__results'>
      <div className='react-search__results-stats'>
        <div className='react-search__count-container'>
          {!Number.isNaN(total) &&
            <> 
              <span className='react-search__count'>{total}</span>
              <span>{Drupal.t('schools', {}, {context: 'School search results statline'})}</span>
            </>
          }
          {results.map((hit: Result<School>) => (
            <ResultCard key={hit._id} {...hit._source} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsContainer;