import { useAtomValue } from 'jotai';
import { paramsAtom } from '../store';

const SelectionsContainer = () => {
  const { grades_1_6, grades_7_9, finnish_education, swedish_education } = useAtomValue(paramsAtom);
  return (
    <div className='hdbt-search__selections-wrapper'>
      <ul className='hdbt-search__selections-container content-tags__tags'>

      </ul>
    </div>
  );
};

export default SelectionsContainer;
