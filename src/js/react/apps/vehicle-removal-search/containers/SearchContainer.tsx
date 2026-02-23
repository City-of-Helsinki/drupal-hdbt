import { Suspense } from 'react';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { GhostList } from '@/react/common/GhostList';
import Global from '../enum/Global';

const SearchContainer = () => (
  <div className='vehicle-removal-search'>
    <Suspense fallback={<GhostList count={Global.size} />}>
      <FormContainer />
      <ResultsContainer />
    </Suspense>
  </div>
);

export default SearchContainer;
