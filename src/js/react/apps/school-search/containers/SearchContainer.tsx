import { ErrorBoundary } from '@sentry/react';
import { useSetAtom } from 'jotai';
import { Suspense, useEffect, useState } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import ResultsError from '@/react/common/ResultsError';
import TabList from '@/react/common/TabList';
import AppSettings from '../enum/AppSettings';
import UseConfigurationsQuery from '../hooks/UseConfigurationsQuery';
import { keywordAtom, paramsAtom, setConfigurationsAtom } from '../store';
import FeatureFormContainer from './FeatureFormContainer';
import FeatureResultsContainer from './FeatureResultsContainer';
import ProximityFormContainer from './ProximityFormContainer';
import ProximityResultsContainer from './ProximityResultsContainer';

const MODE_OPTIONS = {
  // Search by school features
  feature: 'feature',
  // Lists schools where you can apply to based on your address
  proximity: 'proximity',
};

const SearchContainer = () => {
  const { data: configurations, error: configurationsError } = UseConfigurationsQuery();
  const [searchMode, setSearchMode] = useState<string>(MODE_OPTIONS.proximity);
  const setKeyword = useSetAtom(keywordAtom);
  const setParams = useSetAtom(paramsAtom);
  const setConfigurations = useSetAtom(setConfigurationsAtom);
  const initialParams = useInitialParams({ home_address: '' });

  const changeSearchMode = (mode: string) => {
    if (mode === searchMode) {
      return;
    }

    setParams({});
    setSearchMode(mode);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once on mount; URL params do not change
  useEffect(() => {
    if (initialParams?.home_address) {
      setParams({ keyword: initialParams.home_address });
      setKeyword(initialParams.home_address);
      setSearchMode(MODE_OPTIONS.proximity);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
  useEffect(() => {
    if (configurations) {
      setConfigurations({ ...configurations, error: configurationsError });
    }
  }, [configurations]);

  return (
    <>
      <TabList
        label={Drupal.t('School search mode', {}, { context: 'School search: tablist label' })}
        selected={searchMode}
        onSelect={changeSearchMode}
        tabs={[
          {
            value: MODE_OPTIONS.proximity,
            id: 'school-search-tab-proximity',
            controls: 'school-search-tabpanel-proximity',
            label: Drupal.t('Search for your local school', {}, { context: 'School search: local search title' }),
          },
          {
            value: MODE_OPTIONS.feature,
            id: 'school-search-tab-feature',
            controls: 'school-search-tabpanel-feature',
            label: Drupal.t('Search with school information', {}, { context: 'School search: Feature form title' }),
          },
        ]}
      />
      <ErrorBoundary fallback={<ResultsError error={new Error('Error loading school search results')} />}>
        <Suspense fallback={<GhostList count={AppSettings.size} />}>
          {searchMode === MODE_OPTIONS.proximity ? (
            <div id='school-search-tabpanel-proximity' role='tabpanel' aria-labelledby='school-search-tab-proximity'>
              <ProximityFormContainer />
              <ProximityResultsContainer />
            </div>
          ) : (
            <div id='school-search-tabpanel-feature' role='tabpanel' aria-labelledby='school-search-tab-feature'>
              <FeatureFormContainer />
              <FeatureResultsContainer />
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default SearchContainer;
