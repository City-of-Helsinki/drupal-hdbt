import { useAtomValue, useSetAtom } from 'jotai';

import { paramsAtom, updateParamsAtom } from '../store';
import UseProximityQuery from '../hooks/UseProximityQuery';
import ResultsList from '../components/ResultsList';

const ProximityResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const updatePage = (page: number) => {
    setParams({
      ...params,
      page,
    });
  };
  const { data, error, isLoading, isValidating } = UseProximityQuery(params);
  const { page } = params;

  return <ResultsList {...{ data, error, isLoading, isValidating, page, updatePage }} />;
};

export default ProximityResultsContainer;
