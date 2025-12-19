import type OptionType from '../types/OptionType';
import URLParams from '../types/URLParams';

const transformDropdownsValues = (
  paramOptions: string | string[] | undefined = [],
  availableOptions: OptionType[] = [],
) => {
  const transformedOptions: OptionType[] = [];
  const options = Array.isArray(paramOptions)
    ? paramOptions
    : paramOptions
      ? [paramOptions]
      : [];

  options.forEach((selection: string) => {
    const matchedOption = availableOptions.find((option: OptionType) => {
      // Handle cases for employment options where option.value can be an array
      if (Array.isArray(option.value)) {
        return option.value.includes(parseInt(selection, 10));
      }
      // For other options, compare the string representation
      return option.value.toString() === selection.toString();
    });

    // If a matching option is found and it's not in the transformed options yet, add it to the transformed options
    if (
      matchedOption &&
      !transformedOptions.some((option) => option.value === matchedOption.value)
    ) {
      transformedOptions.push(matchedOption);
    }
  });

  return transformedOptions;
};

export const paramsFromSelections = (values: URLParams) => {
  values.page = values.page || '1';
  const newParams = new URLSearchParams();

  for (const key in values) {
    const value = values[key as keyof URLParams];

    if (Array.isArray(value)) {
      value.forEach((option: string) => {
        newParams.append(key, option);
      });
    } else if (value) {
      newParams.set(key, value.toString());
    } else {
      newParams.delete(key);
    }
  }

  return newParams.toString();
};

export default transformDropdownsValues;
