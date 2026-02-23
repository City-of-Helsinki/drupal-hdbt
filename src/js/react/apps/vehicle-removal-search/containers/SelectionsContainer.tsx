import { useAtomValue, useSetAtom } from 'jotai';

import FilterButton from '@/react/common/FilterButton';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import { Events } from '../enum/Event';
import { submittedStateAtom } from '../store';

const SelectionsContainer = () => {
  const { streets } = useAtomValue(submittedStateAtom);
  const setSubmittedState = useSetAtom(submittedStateAtom);

  const clearAll = () => {
    setSubmittedState({ streets: [], page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_ALL));
  };

  const clearSingle = (value: string) => {
    const updated = streets.filter((street) => street.value !== value);
    setSubmittedState({ streets: updated, page: 1 });
    window.dispatchEvent(new CustomEvent(Events.VEHICLE_REMOVAL_CLEAR_SINGLE));
  };

  return (
    <SelectionsWrapper showClearButton={streets.length > 0} resetForm={clearAll}>
      {streets.map((street) => (
        <FilterButton
          key={street.value}
          value={street.label}
          clearSelection={() => clearSingle(street.value as string)}
        />
      ))}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;
