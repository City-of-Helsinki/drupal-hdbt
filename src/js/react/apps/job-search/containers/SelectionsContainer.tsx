import { useAtomValue, useSetAtom } from 'jotai';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import { resetFormAtom, submittedStateAtom } from '../store';
import { useSelectionButtons } from '../hooks/useSelectionButtons';
import { useVisibleSelections } from '../hooks/useVisibleSelections';

const SelectionsContainer = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const visibleSelections = useVisibleSelections();
  const selectionButtons = useSelectionButtons(visibleSelections);

  const showClearButton = Object.entries(submittedState).some(([, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Boolean(value);
  });

  return (
    <SelectionsWrapper showClearButton={showClearButton} resetForm={resetForm}>
      {selectionButtons}
    </SelectionsWrapper>
  );
};

export default SelectionsContainer;
