import { Suspense } from 'react';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = () => (
  <Suspense fallback={
    <div className='hdbt__loading-wrapper'>
      <LoadingOverlay />
    </div>
  }>
    <div className='hdbt-search--react'>
      <FormContainer />
      <ResultsContainer />
    </div>
  </Suspense>
);

export default SearchContainer;
