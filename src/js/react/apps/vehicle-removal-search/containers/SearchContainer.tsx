import { Suspense } from 'react';
import { GhostList } from '@/react/common/GhostList';
import Global from '../enum/Global';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = () => (
  <div className='vehicle-removal-search'>
    <Suspense fallback={<GhostList count={Global.size} />}>
      <FormContainer />
      <ResultsContainer />
    </Suspense>
  </div>
);

export default SearchContainer;
