import { Suspense, useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';

import { ErrorBoundary } from '@sentry/react';
import ProximityFormContainer from './ProximityFormContainer';
import ProximityResultsContainer from './ProximityResultsContainer';
import FeatureFormContainer from './FeatureFormContainer';
import FeatureResultsContainer from './FeatureResultsContainer';
import { paramsAtom, setConfigurationsAtom } from '../store';
import UseConfigurationsQuery from '../hooks/UseConfigurationsQuery';
import ResultsError from '@/react/common/ResultsError';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { GhostList } from '@/react/common/GhostList';
import AppSettings from '../enum/AppSettings';

const MODE_OPTIONS = {
  // Search by school features
  feature: 'feature',
  // Lists schools where you can apply to based on your address
  proximity: 'proximity',
};

const SearchContainer = () => {
  const { data: configurations, error: configurationsError } = UseConfigurationsQuery();
  const [searchMode, setSearchMode] = useState<string>(MODE_OPTIONS.proximity);
  const setParams = useSetAtom(paramsAtom);
  const setConfigurations = useSetAtom(setConfigurationsAtom);
  const initialParams = useInitialParams({
    address: '',
  });

  const changeSearchMode = (mode: string) => {
    if (mode === searchMode) {
      return;
    }

    setParams({});
    setSearchMode(mode);
  };

  useEffect(() => {
    if (initialParams?.address) {
      setParams({
        keyword: initialParams.address
      });
      setSearchMode(MODE_OPTIONS.proximity);
    }
  }, [initialParams]);

  useEffect(() => {
    if (configurations) {
      setConfigurations({
        ...configurations,
        error: configurationsError
      });
    }
  }, [configurations]);

  return (
    <>
      <div className='hdbt-search--react__results--tablist' role='tablist'>
        <button
          id='school-search-tab-proximity'
          type='button'
          className='tablist-tab'
          role='tab'
          aria-selected={searchMode === MODE_OPTIONS.proximity}
          aria-controls='school-search-tabpanel-proximity'
          onClick={() => changeSearchMode(MODE_OPTIONS.proximity)}
        >
          {Drupal.t('Search for your local school', {}, {context: 'School search: local search title'})}
        </button>
        <button
          id='school-search-tab-feature'
          type='button'
          className='tablist-tab'
          role='tab'
          aria-selected={searchMode === MODE_OPTIONS.feature}
          aria-controls='school-search-tabpanel-feature'
          onClick={() => changeSearchMode(MODE_OPTIONS.feature)}
        >
          {Drupal.t('Search with school information', {}, {context: 'School search: Feature form title'})}
        </button>
      </div>
      <ErrorBoundary
        fallback={<ResultsError error={new Error('Error loading school search results')} />}
      >
        <Suspense fallback={
          <GhostList count={AppSettings.size} />
        }>
          {
            searchMode === MODE_OPTIONS.proximity ?
              <div id='school-search-tabpanel-proximity' role='tabpanel' aria-labelledby='school-search-tab-proximity'>
                <ProximityFormContainer initialAddress={initialParams?.address} />
                <ProximityResultsContainer />
              </div> :
              <div id='school-search-tabpanel-feature' role='tabpanel' aria-labelledby='school-search-tab-feature'>
                <FeatureFormContainer />
                <FeatureResultsContainer />
              </div>
          }
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default SearchContainer;
