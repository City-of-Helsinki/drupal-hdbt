import { useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import { Events } from '../enum/Event';
import { type SearchState, submittedStateAtom } from '../store';

type FilterKey = 'streets' | 'postalCodes' | 'parkingZones';

const filterKeys: FilterKey[] = ['streets', 'postalCodes', 'parkingZones'];

const SelectionsContainer = () => {
  const state = useAtomValue(submittedStateAtom);
  const setSubmittedState = useSetAtom(submittedStateAtom);

  const clearAll = () => {
    setSubmittedState({ streets: [], postalCodes: [], parkingZones: [], page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_ALL));
  };

  const clearSingle = (key: FilterKey, value: string) => {
    const updated: SearchState[FilterKey] = state[key].filter((option) => option.value !== value);
    setSubmittedState({ [key]: updated, page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_SINGLE));
  };

  return (
    <SelectionsWrapper showClearButton={filterKeys.some((key) => state[key].length > 0)} resetForm={clearAll}>
      {filterKeys.flatMap((key) =>
        state[key].map((option) => (
          <FilterButton
            key={`${key}-${option.value}`}
            value={option.label}
            clearSelection={() => clearSingle(key, option.value as string)}
          />
        )),
      )}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;
