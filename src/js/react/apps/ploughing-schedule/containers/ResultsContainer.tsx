import { useAtomValue } from 'jotai';
import ResultsList from '../components/ResultsList';
import UseQuery from '../hooks/UseQuery';
import { paramsAtom } from '../store';

const ResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const { data, error, isLoading, isValidating } = UseQuery(params);

  return <ResultsList {...{ data, error, isLoading, isValidating }} />;
};

export default ResultsContainer;
