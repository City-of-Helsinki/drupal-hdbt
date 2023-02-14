import { useAtomValue, useSetAtom } from 'jotai';
import useSWR from 'swr';
import { LoadingSpinner } from 'hds-react';
import { SyntheticEvent } from 'react';
import { configurationsAtom, paramsAtom, updatePageAtom } from '../store';
import useQuery from '../hooks/UseQuery';
import GlobalSettings from '../enum/GlobalSettings';
import ResultCard from '../components/ResultCard';
import Result from '@/types/Result';
import { School } from '../types/School';
import Pagination from '@/react/common/Pagination';

const ResultsContainer = () => {
  const { size } = GlobalSettings;
  const { baseUrl } = useAtomValue(configurationsAtom);
  const params = useAtomValue(paramsAtom);
  const updatePage = useSetAtom(updatePageAtom);
  const { url, noResults } = useQuery(params);

  const fetcher = () => {
    const { index } = GlobalSettings;

    return fetch(`${baseUrl}/${index}/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: url,
    }).then((res) => res.json());
  };

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false
  });

  if (!data && !error) {
    return <LoadingSpinner />;
  }

  // @todo: Implement no results message
  if (!data?.hits?.hits.length || noResults) {
    return (
      <div className='react-search__no-results'>
        No results
      </div>
    );
  }

  const results = data.hits.hits;
  const total = data.hits.total.value;
  const pages = Math.floor(total / size);
  const addLastPage = total > size && total % size;

  return (
    <div className='react-search__results'>
      <div className='react-search__results-stats'>
        <div className='react-search__count-container'>
          {!Number.isNaN(total) &&
            <> 
              <span className='react-search__count'>{total}</span>
              <span> {Drupal.t('schools', {}, {context: 'School search results statline'})}</span>
            </>
          }
        </div>
      </div>
      {results.map((hit: Result<School>) => (
        <ResultCard key={hit._id} {...hit._source} />
      ))}
      <Pagination
        currentPage={params.page || 1}
        pages={5}
        totalPages={addLastPage ? pages + 1 : pages}
        updatePage={(e: SyntheticEvent, page: number) => {
          e.preventDefault();
          updatePage(page);
        }}  
      />
    </div>
  );
};

export default ResultsContainer;