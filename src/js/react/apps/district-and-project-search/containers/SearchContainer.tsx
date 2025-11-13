import { Suspense } from 'react';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import globalSettings from '../enum/Global';
import { GhostList } from '@/react/common/GhostList';

const SearchContainer = (): JSX.Element => (
  <>
    {/* For async atoms that need to load option values from elastic */}
    <Suspense fallback={<GhostList count={globalSettings.size} />}>
      <FormContainer />
      <ResultsContainer />
    </Suspense>
  </>
);

export default SearchContainer;
