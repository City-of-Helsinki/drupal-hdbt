import { useAtomValue, useSetAtom } from 'jotai';

import { paramsAtom, updateParamsAtom } from '../store';
import UseFeatureQuery from '../hooks/UseFeatureQuery';
import ResultsList from '../components/ResultsList';

const FeatureResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const updatePage = (page: number) => {
    setParams({
      ...params,
      page,
    });
  };
  const { data, error, isLoading, isValidating } = UseFeatureQuery(params);
  const { page } = params;

  return <ResultsList {...{ data, error, isLoading, isValidating, page, updatePage }} />;
};

export default FeatureResultsContainer;
