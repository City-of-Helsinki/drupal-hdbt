import type { SelectProps, SupportedLanguage, Texts } from 'hds-react';
import type { OptionIterator } from 'hds-react/components/select/utils';
import type OptionType from '@/types/OptionType';

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

export const updateSelectionsInStorage = (
  storage: HDSStorage,
  selections: OptionType[],
) => {
  storage.updateAllOptions((option, _group, _groupindex) => {
    if (
      option.selected &&
      !selections.some((selection) => selection.value === option.value)
    ) {
      return { ...option, selected: false };
    }
    return option;
  });
  storage.setOpen(false);
  storage.render();
};
