import { LoadingSpinner, Tab, TabList, Tabs } from 'hds-react';
import { Suspense, useState } from 'react';
import ProximityFormContainer from './ProximityFormContainer';
import ResultsContainer from './ResultsContainer';

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
            {Drupal.t('Find nearby shools')}
          </Tab>
          <Tab
            className='react-search__tab'
            index={1}
            onClick={() => setSearchMode(MODE_OPTIONS.feature)}
          >
            {Drupal.t('Find by school features')}
          </Tab>
        </TabList>
      </Tabs>
      <Suspense fallback={<LoadingSpinner />}>
        {
          searchMode === MODE_OPTIONS.proximity ?
            <>
              <ProximityFormContainer />
              <ResultsContainer />
            </> :
            <ResultsContainer />
        }
      </Suspense>
    </>
  );
};

export default SearchContainer;
