import { useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import { Events } from '../enum/Event';
import { type SearchState, submittedStateAtom } from '../store';

const SelectionsContainer = () => {
  const { streets, postalCodes } = useAtomValue(submittedStateAtom);
  const setSubmittedState = useSetAtom(submittedStateAtom);

  const clearAll = () => {
    setSubmittedState({ streets: [], postalCodes: [], page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_ALL));
  };

  const clearSingle = (key: 'streets' | 'postalCodes', value: string) => {
    const current: SearchState[typeof key] = key === 'streets' ? streets : postalCodes;
    setSubmittedState({ [key]: current.filter((option) => option.value !== value), page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_SINGLE));
  };

  return (
    <SelectionsWrapper showClearButton={streets.length > 0 || postalCodes.length > 0} resetForm={clearAll}>
      {streets.map((street) => (
        <FilterButton
          key={`street-${street.value}`}
          value={street.label}
          clearSelection={() => clearSingle('streets', street.value as string)}
        />
      ))}
      {postalCodes.map((postalCode) => (
        <FilterButton
          key={`postal-code-${postalCode.value}`}
          value={postalCode.label}
          clearSelection={() => clearSingle('postalCodes', postalCode.value as string)}
        />
      ))}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;
