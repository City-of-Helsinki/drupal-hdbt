import { Suspense } from 'react';

import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import { GhostList } from '@/react/common/GhostList';
import GlobalSettings from '../enum/Global';

const SearchContainer = () => (
  <div className='recruitment-search'>
    {/* For async atoms that need to load option values from elastic */}
    <Suspense fallback={<GhostList count={GlobalSettings.size} />}>
      <FormContainer />
      {!drupalSettings?.helfi_rekry_job_search?.results_page_path && (
        <ResultsContainer />
      )}
    </Suspense>
  </div>
);

export default SearchContainer;
