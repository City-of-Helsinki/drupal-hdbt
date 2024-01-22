import { Suspense, useState } from 'react';
import { useSetAtom } from 'jotai';

import LoadingOverlay from '@/react/common/LoadingOverlay';
import ProximityFormContainer from './ProximityFormContainer';
import ProximityResultsContainer from './ProximityResultsContainer';
import FeatureFormContainer from './FeatureFormContainer';
import FeatureResultsContainer from './FeatureResultsContainer';
import { paramsAtom } from '../store';

const MODE_OPTIONS = {
  // Search by school features
  feature: 'feature',
  // Lists schools where you can apply to based on your address
  proximity: 'proximity',
};

const SearchContainer = () => {
  const [searchMode, setSearchMode] = useState<string>(MODE_OPTIONS.proximity);
  const setParams = useSetAtom(paramsAtom);

  const changeSearchMode = (mode: string) => {
    if (mode === searchMode) {
      return;
    }

    setParams({});
    setSearchMode(mode);
  };

  return (
    <>
      <div className='hdbt-search--react__results--tablist' role='tablist'>
        <button type='button' className='tablist-tab' role='tab' aria-selected={searchMode === MODE_OPTIONS.proximity} aria-controls='hdbt-search--react__results--tabpanel' onClick={() => changeSearchMode(MODE_OPTIONS.proximity)}>
          {Drupal.t('Search for your local school', {}, {context: 'School search: local search title'})}
        </button>
        <button type='button' className='tablist-tab' role='tab' aria-selected={searchMode === MODE_OPTIONS.feature} aria-controls='hdbt-search--react__results--tabpanel' onClick={() => changeSearchMode(MODE_OPTIONS.feature)}>
          {Drupal.t('Search with school information', {}, {context: 'School search: Feature form title'})}
        </button>
      </div>
      <Suspense fallback={
        <div className='hdbt__loading-wrapper'>
          <LoadingOverlay />
        </div>
      }>
        {
          searchMode === MODE_OPTIONS.proximity ?
            <div>
              <ProximityFormContainer />
              <ProximityResultsContainer />
            </div> :
            <div>
              <FeatureFormContainer />
              <FeatureResultsContainer />
            </div>
        }
      </Suspense>
    </>
  );
};

export default SearchContainer;
