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
  const initialParams = useInitialParams({
    address: '',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12066
  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
    if (initialParams?.address) {
      setKeyword(initialParams.address);
    }
  }, []);

  return (
    <Suspense fallback={<GhostList count={AppSettings.size} />}>
      <div className='hdbt-search--react'>
        <FormContainer initialParams={initialParams} />
        <ResultsContainer />
      </div>
    </Suspense>
  );
};

export default SearchContainer;
