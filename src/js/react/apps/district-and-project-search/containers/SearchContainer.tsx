
import { LoadingSpinner } from 'hds-react';
import { Suspense } from 'react';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = ():JSX.Element => (
  <>
    {/* For async atoms that need to load option values from elastic */}
    <Suspense fallback={<LoadingSpinner />}>
      <FormContainer />
      <ResultsContainer />
    </Suspense>
  </>
);

export default SearchContainer;
