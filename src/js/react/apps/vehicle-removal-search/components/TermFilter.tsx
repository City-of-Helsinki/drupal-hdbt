import type { SelectProps } from 'hds-react';
import { type Option, Select, useSelectStorage } from 'hds-react';
import { useSetAtom, type WritableAtom } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { defaultMultiSelectTheme } from '@/react/common/constants/selectTheme';
import { clearAllSelectionsFromStorage, updateSelectionsInStorage } from '@/react/common/helpers/HDS';
import { Events } from '../enum/Event';
import useTermSuggestions, { type TermField } from '../hooks/useTermSuggestions';

type TermFilterProps = {
  /** Id of the select element. */
  id: string;
  /** Atom holding the selected options. */
  atom: WritableAtom<Option[], [Option[]], void>;
  /** The index field the suggestions are aggregated from. */
  field: TermField;
  /** See useTermSuggestions. */
  toIncludePattern: (searchTerm: string) => string;
  /** Translated texts. */
  texts: {
    label: string;
    searchLabel: string;
    searchPlaceholder: string;
  };
};

/**
 * Multiselect filter with suggestions from the values of a mobilenote_data index field.
 */
export const TermFilter = ({ id, atom, field, toIncludePattern, texts }: TermFilterProps) => {
  const setValue = useSetAtom(atom);
  const getValue = useAtomCallback(useCallback((get) => get(atom), [atom]));
  const onSearch = useTermSuggestions(field, toIncludePattern);

  const onChange = (selectedOptions: Option[]) => {
    setValue(selectedOptions);
    selectStorage.updateAllOptions((option) => ({
      ...option,
      selected: selectedOptions.some((selection) => selection.value === option.value),
    }));
  };

  const [storageKey, setStorageKey] = useState(0);

  const selectStorage = useSelectStorage({
    disabled: false,
    id,
    invalid: false,
    multiSelect: true,
    noTags: true,
    onChange,
    onSearch,
    open: false,
    updateKey: String(storageKey),
    options: getValue()?.map((dm) => ({ ...dm, selected: true })) ?? [],
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
        searchLabel: texts.searchLabel,
        searchPlaceholder: texts.searchPlaceholder,
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
