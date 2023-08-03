import { useAtomValue } from 'jotai';
import SimpleResultsContainer from './SimpleResultsContainer';
import PromotedResultsContainer from './PromotedResultsContainer';
import { configurationsAtom } from '../store';

const ResultsContainer = () => {
  const { promoted } = useAtomValue(configurationsAtom);

  return promoted?.length ?
    <PromotedResultsContainer /> :
    <SimpleResultsContainer />;
};

export default ResultsContainer;
