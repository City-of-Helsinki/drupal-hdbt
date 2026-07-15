import { useAtomValue } from 'jotai';
import ResultsList from '../components/ResultsList';
import UseQuery from '../hooks/UseQuery';
import { paramsAtom } from '../store';

const ResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const { data, error, isValidating, queryString } = UseQuery(params);

  return <ResultsList {...{ data, error, isValidating, queryString }} />;
};

export default ResultsContainer;
