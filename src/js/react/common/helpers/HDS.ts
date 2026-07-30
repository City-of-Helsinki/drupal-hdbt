import type { SelectProps, SupportedLanguage, TextKey } from 'hds-react';
import type { OptionIterator } from 'hds-react/components/dropdownComponents/select';
import type OptionType from '@/types/OptionType';

/**
 * hds-react no longer re-exports ModularOptionListData from its barrel files,
 * so derive it from the Select onChange signature, where it is the third argument.
 */
export type ModularOptionListData = Parameters<NonNullable<SelectProps['onChange']>>[2];

type HDSStorage = {
  getProps: () => SelectProps;
  updateAllOptions: (iterator: OptionIterator) => void;
  setError: (textOrInvalid: string | boolean) => void;
  setOpen: (open: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setInvalid: (invalid: boolean) => void;
  updateTexts: (texts: Partial<Texts>, language?: SupportedLanguage) => void;
  render: () => void;
};

export const clearAllSelectionsFromStorage = (storage: HDSStorage) => {
  storage.updateAllOptions((option, _group, _groupindex) => {
    if (option.selected) {
      return { ...option, selected: false };
    }
    return option;
  });
  storage.setOpen(false);
  storage.render();
};

type Texts = Record<TextKey, string> & {
  searchPlaceholder: string;
  noOptionsText: string;
  selectedText: string;
  deselectAllText: string;
  selectAllText: string;
};

export const updateSelectionsInStorage = (storage: HDSStorage, selections: OptionType[]) => {
  storage.updateAllOptions((option, _group, _groupindex) => {
    if (option.selected && !selections.some((selection) => selection.value === option.value)) {
      return { ...option, selected: false };
    }
    return option;
  });
  storage.setOpen(false);
  storage.render();
};
