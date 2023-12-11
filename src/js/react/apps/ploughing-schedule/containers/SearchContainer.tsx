import { Suspense, useState } from 'react';

import { useAtomValue } from 'jotai';
import LoadingOverlay from '@/react/common/LoadingOverlay';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { paramsAtom } from '../store';

const SearchContainer = () => {
  const params = useAtomValue(paramsAtom);

  return (
    <Suspense fallback={
        <div className='hdbt__loading-wrapper'>
          <LoadingOverlay />
        </div>
      }>
        <div>
          <FormContainer />
          { params.keyword ? <ResultsContainer /> : '' }
        </div>
      </Suspense>
  );
};

export default SearchContainer;
