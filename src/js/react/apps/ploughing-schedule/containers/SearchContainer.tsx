import { Suspense, useEffect } from 'react';
import { useAtom } from 'jotai';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { paramsAtom } from '../store';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { GhostList } from '@/react/common/GhostList';

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
      <GhostList count={1} />
    }>
      <div>
        <FormContainer initialParams={initialParams} />
        { params.address ? <ResultsContainer /> : '' }
      </div>
    </Suspense>
  );
};

export default SearchContainer;
