import { useAtomValue, useSetAtom } from 'jotai';
import ResultsList from '../components/ResultsList';
import UseProximityQuery from '../hooks/UseProximityQuery';
import { paramsAtom, updateParamsAtom } from '../store';

const ProximityResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const updatePage = (page: number) => {
    setParams({ ...params, page });
  };
  const { data, error, isLoading, isValidating } = UseProximityQuery(params);
  const { page } = params;

  return <ResultsList {...{ data, error, isLoading, isValidating, page, updatePage }} />;
};

export default ProximityResultsContainer;
