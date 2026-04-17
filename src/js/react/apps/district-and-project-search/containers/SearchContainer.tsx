import { Suspense } from 'react';
import { GhostList } from '@/react/common/GhostList';
import globalSettings from '../enum/Global';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

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
