import type OptionType from '../types/OptionType';

const transformDropdownsValues = (paramOptions: string[] | undefined = [], availableOptions: OptionType[] = []) => {
  const transformedOptions: OptionType[] = [];

  paramOptions.forEach((selection: string) => {
    const matchedOption = availableOptions.find(
      (option: OptionType) => {
        // Handle cases for employment options where option.value can be an array
        if (Array.isArray(option.value)) {
          return option.value.includes(parseInt(selection, 10));
        }
        // For other options, compare the string representation
        return option.value.toString() === (selection.toString());
      }
    );

    // If a matching option is found and it's not in the transformed options yet, add it to the transformed options
    if (matchedOption && !transformedOptions.some((option) => option.value === matchedOption.value)) {
      transformedOptions.push(matchedOption);
    }
  });

  return transformedOptions;
};

export default transformDropdownsValues;
