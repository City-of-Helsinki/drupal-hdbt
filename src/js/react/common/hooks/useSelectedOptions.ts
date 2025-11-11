import type OptionType from '@/types/OptionType';

const useSelectedOptions = (options: OptionType[], selections: OptionType[]) =>
  options.map((option) => {
    if (selections?.some((selection) => selection.value === option.value)) {
      return { ...option, selected: true };
    }

    return option;
  });

export default useSelectedOptions;
