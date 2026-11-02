import type { FilterFunction, SelectProps } from 'hds-react';
import { type Option, Select, useSelectStorage } from 'hds-react';
import { useSetAtom, type WritableAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';

type TermFilterProps = {
  /** Id of the select element. */
  id: string;
  /** Atom holding the selected options. */
  atom: WritableAtom<Option[], [Option[]], void>;
  /** The option values. */
  values: string[];
  /** Decides which options match the text typed in the filter input. */
  filter: FilterFunction;
  /** Translated texts. */
  texts: {
    label: string;
    filterLabel: string;
    filterPlaceholder: string;
  };
};

/**
 * Multiselect filter with the given option values.
 */
export const TermFilter = ({ id, atom, values, filter, texts }: TermFilterProps) => {
  const setValue = useSetAtom(atom);
  const getValue = useAtomCallback(useCallback((get) => get(atom), [atom]));

  const onChange = (selectedOptions: Option[]) => {
    setValue(selectedOptions);
    selectStorage.updateAllOptions((option) => ({
      ...option,
      selected: selectedOptions.some((selection) => selection.value === option.value),
    }));
  };

  const getOptions = () => {
    const selectedValues = getValue().map((option) => option.value);
    // Keep selections missing from the values like ones restored from the URL.
    const allValues = [...new Set([...values, ...selectedValues])];

    return allValues.map((value) => ({ value, label: value, selected: selectedValues.includes(value) }));
  };

  const [storageKey, setStorageKey] = useState(0);

  const selectStorage = useSelectStorage({
    disabled: false,
    filter,
    id,
    invalid: false,
    multiSelect: true,
    noTags: true,
    onChange,
    open: false,
    updateKey: String(storageKey),
    options: getOptions(),
    clearable: true,
  });

  const clearAllSelections = () => {
    clearAllSelectionsFromStorage(selectStorage);
    // Force reload to prevent stale internal state.
    setStorageKey((key) => key + 1);
  };

  const updateSelections = () => {
    updateSelectionsInStorage(selectStorage, getValue());
  };

  useEffect(() => {
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
    window.addEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);

    return () => {
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_ALL, clearAllSelections);
      window.removeEventListener(Events.VEHICLE_REMOVAL_CLEAR_SINGLE, updateSelections);
    };
  });

  return (
    <Select
      className='hdbt-search__dropdown'
      texts={{
        label: texts.label,
        placeholder: Drupal.t('All', {}, { context: 'Vehicle removal search' }),
        filterLabel: texts.filterLabel,
        filterPlaceholder: texts.filterPlaceholder,
        clearButtonAriaLabel_one: Drupal.t(
          'Clear @label selection',
          { '@label': texts.label },
          { context: 'React search clear selection label' },
        ),
        clearButtonAriaLabel_multiple: Drupal.t(
          'Clear @label selection',
          { '@label': texts.label },
          { context: 'React search clear selection label' },
        ),
      }}
      theme={defaultMultiSelectTheme}
      {...(selectStorage.getProps() as SelectProps<ReactElement<HTMLOptGroupElement | HTMLOptionElement>>)}
    />
  );
};
