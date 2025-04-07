import { createRef } from 'react';
import { useAtomValue } from 'jotai';

import useScrollToResults from '@/react/common/hooks/useScrollToResults';
import ResultsError from '@/react/common/ResultsError';
import ResultCard from './ResultCard';
import { paramsAtom } from '../store';
import getScheduleCard from '../helpers/GetScheduleCard';
import { GhostList } from '@/react/common/GhostList';

type ResultsListProps = {
  data: any;
  error: string|Error;
  isLoading: boolean;
  isValidating: boolean;
}

const ResultsList = ({ data, error, isLoading, isValidating }: ResultsListProps) => {
  const params = useAtomValue(paramsAtom);
  const scrollTarget = createRef<HTMLDivElement>();
  const choices = Boolean(Object.keys(params).length);
  useScrollToResults(scrollTarget, choices);

  if (isLoading || isValidating) {
    return (
      <GhostList count={1} />
    );
  }

  if (error) {
    return (
      <ResultsError
        error={error}
        ref={scrollTarget}
      />
    );
  }

  const results = data.hits.hits;
  const several = results.length > 1;
  const address = params.address?.replace(/^(?![A-Za-z]\d+$)(.*?)(\s*\d+\w?)$/, '$1') ?? '';

  return (
    <div className='hdbt-search--react__results'>
      { results.length
        ? <ResultCard {...getScheduleCard(results[0]._source.maintenance_class, several)} address={address} ref={scrollTarget} />
        : <ResultCard {...getScheduleCard(0)} ref={scrollTarget} />
      }
    </div>
  );
};

export default ResultsList;
