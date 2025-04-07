import { Suspense, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { paramsAtom } from '../store';
import { GhostList } from '@/react/common/GhostList';
import AppSettings from '../enum/AppSettings';

const SearchContainer = () => {
  const setParams = useSetAtom(paramsAtom);
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
      <GhostList count={AppSettings.size} />
    }>
      <div className='hdbt-search--react'>
        <FormContainer initialParams={initialParams} />
        <ResultsContainer />
      </div>
    </Suspense>
  );
};

export default SearchContainer;
