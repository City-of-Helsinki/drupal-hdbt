import { useAtomValue } from 'jotai';

import { paramsAtom } from '../store';
import UseQuery from '../hooks/UseQuery';
import ResultsList from '../components/ResultsList';

const ResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const { data, error, isLoading, isValidating } = UseQuery(params);

  return <ResultsList {...{ data, error, isLoading, isValidating }} />;
};

export default ResultsContainer;
