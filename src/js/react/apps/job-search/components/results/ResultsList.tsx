import type { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import type Job from '../../types/Job';
import ResultCard from './ResultCard';

type ResultsListProps = { hits: SearchHit<Job>[] };

const ResultsList = ({ hits }: ResultsListProps) => (
  <>
    {hits.map((hit) =>
      hit._source ? (
        <ResultCard key={hit._id} innerHits={hit.inner_hits?.translations.hits.hits || []} job={hit._source} />
      ) : null,
    )}
  </>
);

export default ResultsList;
