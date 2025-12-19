import type Result from '@/types/Result';
import type Job from '../../types/Job';
import ResultCard from './ResultCard';

type ResultsListProps = { hits: Result<Job>[] };

const ResultsList = ({ hits }: ResultsListProps) => (
  <>
    {hits.map((hit) => (
      <ResultCard key={hit._id} innerHits={hit?.inner_hits.translations.hits.hits || null} job={hit._source} />
    ))}
  </>
);

export default ResultsList;
