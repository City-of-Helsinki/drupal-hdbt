import { useAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { GhostList } from '@/react/common/GhostList';
import useInitialParams from '@/react/common/hooks/useInitialParams';
import { paramsAtom } from '../store';
import FormContainer from './FormContainer';
import ResultsContainer from './ResultsContainer';

const SearchContainer = () => {
  const [params, setParams] = useAtom(paramsAtom);
  const initialParams = useInitialParams({
    address: '',
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: @todo UHF-12501
  useEffect(() => {
    if (initialParams) {
      setParams(initialParams);
    }
  }, []);

  return (
    <Suspense fallback={<GhostList count={1} />}>
      <div>
        <FormContainer initialParams={initialParams} />
        {params.address ? <ResultsContainer /> : ''}
      </div>
    </Suspense>
  );
};

export default SearchContainer;
