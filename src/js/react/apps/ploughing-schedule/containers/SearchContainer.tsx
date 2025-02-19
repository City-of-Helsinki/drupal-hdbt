import { Suspense, useEffect } from 'react';
import { useAtom } from 'jotai';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { paramsAtom } from '../store';
import useInitialParams from '@/react/common/hooks/useInitialParams';

const SearchContainer = () => {
  const [params, setParams] = useAtom(paramsAtom);
  const initialParams = useInitialParams({
    address: '',
  });

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, []);

  return (
    <Suspense fallback={
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    }>
      <div>
        <FormContainer initialParams={initialParams} />
        { params.address ? <ResultsContainer /> : '' }
      </div>
    </Suspense>
  );
};

export default SearchContainer;
