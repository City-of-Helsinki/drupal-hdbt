import { useAtomValue, useSetAtom } from 'jotai';
import ResultsList from '../components/ResultsList';
import UseFeatureQuery from '../hooks/UseFeatureQuery';
import { paramsAtom, updateParamsAtom } from '../store';

const FeatureResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const updatePage = (page: number) => {
    setParams({ ...params, page });
  };
  const { data, error, isLoading, isValidating } = UseFeatureQuery(params);
  const { page } = params;

  return <ResultsList {...{ data, error, isLoading, isValidating, page, updatePage }} />;
};

export default FeatureResultsContainer;
