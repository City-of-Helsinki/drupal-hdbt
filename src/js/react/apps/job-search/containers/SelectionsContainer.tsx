import { useAtomValue, useSetAtom } from 'jotai';
import SelectionsWrapper from '@/react/common/SelectionsWrapper';
import SearchComponents from '../enum/SearchComponents';
import { useSelectionButtons } from '../hooks/useSelectionButtons';
import { useVisibleSelections } from '../hooks/useVisibleSelections';
import { resetFormAtom, submittedStateAtom } from '../store';

const SelectionsContainer = () => {
  const submittedState = useAtomValue(submittedStateAtom);
  const resetForm = useSetAtom(resetFormAtom);
  const visibleSelections = useVisibleSelections(true);
  const selectionButtons = useSelectionButtons(visibleSelections, {
    [SearchComponents.KEYWORD]: Drupal.t('Search term', {}, { context: 'Search keyword label' }),
  });

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
