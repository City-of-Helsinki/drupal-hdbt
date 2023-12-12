import { Suspense } from 'react';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import ProximityFormContainer from './ProximityFormContainer';
import ProximityResultsContainer from './ProximityResultsContainer';

const SearchContainer = () => (
  <Suspense fallback={
    <div className='hdbt__loading-wrapper'>
      <LoadingOverlay />
    </div>
  }>
    <div className='hdbt-search--react'>
      <ProximityFormContainer />
      <ProximityResultsContainer />
    </div>
  </Suspense>
);

export default SearchContainer;
