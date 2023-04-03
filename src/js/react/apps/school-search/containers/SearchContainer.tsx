import { LoadingSpinner, Tab, TabList, Tabs } from 'hds-react';
import { Suspense, useState } from 'react';
import ProximityFormContainer from './ProximityFormContainer';
import ProximityResultsContainer from './ProximityResultsContainer';
import FeatureFormContainer from './FeatureFormContainer';
import FeatureResultsContainer from './FeatureResultsContainer';

const MODE_OPTIONS = {
  // Search by school features
  feature: 'feature',
  // Lists schools where you can apply to based on your address
  proximity: 'proximity',
};

const SearchContainer = () => {
  const [searchMode, setSearchMode] = useState<string>(MODE_OPTIONS.proximity);
  
  return (
    <>
      <Tabs>
        <TabList className='react-search__tabs'>
          <Tab
            className='react-search__tab'
            index={0}
            onClick={() => setSearchMode(MODE_OPTIONS.proximity)}
          >
            {Drupal.t('Search for your local school', {}, {context: 'School search: local search title'})}
          </Tab>
          <Tab
            className='react-search__tab'
            index={1}
            onClick={() => setSearchMode(MODE_OPTIONS.feature)}
          >
            {Drupal.t('Search with school information', {}, {context: 'School search: Feature form title'})}
          </Tab>
        </TabList>
      </Tabs>
      <Suspense fallback={<LoadingSpinner />}>
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
