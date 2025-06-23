import { Suspense, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import SearchParams from '../types/SearchParams';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { keywordAtom, paramsAtom } from '../store';
import { GhostList } from '@/react/common/GhostList';
import AppSettings from '../enum/AppSettings';

const SearchContainer = () => {
  const setKeyword = useSetAtom(keywordAtom);
  const setParams = useSetAtom(paramsAtom);
  const initialParams = useInitialParams<SearchParams>({
    address: '',
  });

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
    if (initialParams?.address) {
      setKeyword(initialParams.address);
    }
  });

  return (
    <Suspense fallback={
      <GhostList count={AppSettings.size} />
    }>
      <div className='hdbt-search--react'>
        <FormContainer initialParams={initialParams} />
        <ResultsContainer />
      </div>
    </Suspense>
  );
};

export default SearchContainer;
