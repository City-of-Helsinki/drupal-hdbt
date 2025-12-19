import { useAtomValue } from 'jotai';
import { submittedStateAtom } from '../store';
import SearchComponents from '../enum/SearchComponents';

export const useVisibleSelections = (includeKeyword = false) => {
  const submittedState = useAtomValue(submittedStateAtom);

  return Object.entries({ ...submittedState }).filter(([key, value]) => {
    if ([SearchComponents.PAGE, SearchComponents.ORDER, 'sort'].includes(key)) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    if (typeof value === 'boolean' && value === false) {
      return false;
    }

    if (value === '') {
      return false;
    }

    if (!includeKeyword && key === SearchComponents.KEYWORD) {
      return false;
    }

    return true;
  });
};
