import { SelectProps, SupportedLanguage, Texts } from 'hds-react';
import { OptionIterator } from 'hds-react/utils-ba10fa35';
import OptionType from '@/types/OptionType';

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
  storage.updateAllOptions((option, group, groupindex) => {
    if (option.selected) {
      return {
        ...option,
        selected: false,
      };
    }
    return option;
  });
  storage.setOpen(false);
  storage.render();
};

export const updateSelectionsInStorage = (storage: HDSStorage, selections: OptionType[]) => {
  storage.updateAllOptions((option, group, groupindex) => {
    if (option.selected && !selections.some(selection => selection.value === option.value)) {
      return {
        ...option,
        selected: false,
      };
    }
    return option;
  });
  storage.setOpen(false);
  storage.render();
};
