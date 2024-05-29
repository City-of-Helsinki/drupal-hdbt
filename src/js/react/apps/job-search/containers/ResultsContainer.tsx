import { useAtomValue } from 'jotai';

import SimpleResultsContainer from './SimpleResultsContainer';
import PromotedResultsContainer from './PromotedResultsContainer';
import { configurationsAtom } from '../store';
import SearchMonitorContainer from './SearchMonitorContainer';

const ResultsContainer = () => {
  const { promoted } = useAtomValue(configurationsAtom);

  return promoted?.length ?
  <PromotedResultsContainer /> :
  <>
    {drupalSettings?.helfi_react_search?.hakuvahti_url_set && <SearchMonitorContainer />}
    <SimpleResultsContainer />
  </>;
};

export default ResultsContainer;
