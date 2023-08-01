import Job from '../../types/Job';
import Result from '@/types/Result';
import ResultCard from './ResultCard';

type ResultsListProps = {
  hits: Result<Job>[]
};

const ResultsList = ({ hits }: ResultsListProps) => (
    <>
      {hits.map(hit => (
        <ResultCard
          key={hit._id}
          innerHits={hit?.inner_hits.translations.hits.hits || null}
          job={hit._source}
        />
      ))}
    </>
  ); 

export default ResultsList;
