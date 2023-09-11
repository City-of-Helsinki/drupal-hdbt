import { Suspense } from 'react';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = ():JSX.Element => (
  <>
    {/* For async atoms that need to load option values from elastic */}
    <Suspense fallback={
      <div className='hdbt__loading-wrapper'>
        <LoadingOverlay />
      </div>
    }>
      <FormContainer />
      <ResultsContainer />
    </Suspense>
  </>
);

export default SearchContainer;
