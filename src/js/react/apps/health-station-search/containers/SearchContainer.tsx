import { useSetAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import AppSettings from '../enum/AppSettings';
import { keywordAtom, paramsAtom } from '../store';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = () => {
  const setKeyword = useSetAtom(keywordAtom);
  const setParams = useSetAtom(paramsAtom);
  const initialParams = useInitialParams({ home_address: '' });

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
    if (initialParams?.home_address) {
      setKeyword(initialParams.home_address);
    }
  }, []);

  return (
    <Suspense fallback={<GhostList count={AppSettings.size} />}>
      <div className='hdbt-search--react'>
        <FormContainer />
        <ResultsContainer />
      </div>
    </Suspense>
  );
};

export default SearchContainer;
