import { Suspense, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';
import type SearchParams from '../types/SearchParams';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { keywordAtom, paramsAtom } from '../store';
import { GhostList } from '@/react/common/GhostList';
import AppSettings from '../enum/AppSettings';

const SearchContainer = () => {
  const setKeyword = useSetAtom(keywordAtom);
  const setParams = useSetAtom(paramsAtom);
  const initialParams = useInitialParams<SearchParams>({ home_address: '' });

  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
    if (initialParams?.home_address) {
      setKeyword(initialParams.home_address);
    }
  });

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
