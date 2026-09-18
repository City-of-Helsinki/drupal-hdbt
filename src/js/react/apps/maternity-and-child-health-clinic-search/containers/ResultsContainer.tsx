import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import ResultsList from '../components/ResultsList';
import UseProximityQuery from '../hooks/UseProximityQuery';
import { addressErrorAtom, paramsAtom, updateParamsAtom } from '../store';

const ProximityResultsContainer = () => {
  const params = useAtomValue(paramsAtom);
  const setParams = useSetAtom(updateParamsAtom);
  const updatePage = (page: number) => {
    setParams({ ...params, page });
  };
  const { data, error, isLoading, isValidating, queryString } = UseProximityQuery(params);
  const setAddressError = useSetAtom(addressErrorAtom);

  useEffect(() => {
    setAddressError(Boolean(data?.addressError));
  }, [data, setAddressError]);
  const { page } = params;

  return <ResultsList {...{ data, error, isLoading, isValidating, page, queryString, updatePage }} />;
};

export default ProximityResultsContainer;
