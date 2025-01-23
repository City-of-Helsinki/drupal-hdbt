import { Suspense, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import SearchParams from '../types/SearchParams';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { paramsAtom } from '../store';

const SearchContainer = () => {
  const setParams = useSetAtom(paramsAtom);
  const initialParams = useInitialParams<SearchParams>({
    address: '',
  });

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  });

  return (
    <Suspense fallback={
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    }>
      <div className='hdbt-search--react'>
        <FormContainer initialParams={initialParams} />
        <ResultsContainer />
      </div>
    </Suspense>
  );
};

export default SearchContainer;
