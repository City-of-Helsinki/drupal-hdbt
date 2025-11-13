import type OptionType from '../types/OptionType';

const transformDropdownsValues = (
  paramOptions: string[] | undefined = [],
  availableOptions: OptionType[] = [],
) => {
  const transformedOptions: OptionType[] = [];

  paramOptions.forEach((selection: string) => {
    const matchedOption = availableOptions.find(
      (option: OptionType) => option.value.toString() === selection.toString(),
    );

    if (matchedOption) {
      transformedOptions.push(matchedOption);
    }
  });

  return transformedOptions;
};

export default transformDropdownsValues;
