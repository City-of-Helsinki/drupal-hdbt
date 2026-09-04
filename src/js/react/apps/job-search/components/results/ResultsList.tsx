import type Job from '../../types/Job';
import type { Result } from '../../types/Result';
import ResultCard from './ResultCard';

type ResultsListProps = { hits: Result<Job>[] };

const ResultsList = ({ hits }: ResultsListProps) => (
  <>
    {hits.map((hit) => (
      <ResultCard key={hit._id} innerHits={hit.inner_hits?.translations.hits.hits || []} job={hit._source} />
    ))}
  </>
);

export default ResultsList;
