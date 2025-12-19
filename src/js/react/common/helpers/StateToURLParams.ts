import OptionType from '@/types/OptionType';

export const stateToURLParams = (
  state: Record<
    string,
    Array<string | number | OptionType> | string | number | boolean
  >,
  useLabelForOptions: boolean = false,
): URLSearchParams => {
  const params = new URLSearchParams();

  const serializeOptionValue = (
    key: string,
    option: string | number | OptionType,
  ): void => {
    if (typeof option !== 'object') {
      params.append(key, option.toString());
      return;
    }

    if (Array.isArray(option.value)) {
      option.value.forEach((optionValue) => {
        const value = useLabelForOptions
          ? option.label.toString()
          : optionValue.toString();
        params.append(key, value);
      });
      return;
    }

    const value = useLabelForOptions
      ? option.label.toString()
      : option.value.toString();
    params.append(key, value);
  };

  Object.entries({ ...state }).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length) {
      value.forEach((item) => serializeOptionValue(key, item));
    } else if (
      (typeof value === 'string' || typeof value === 'number') &&
      value.toString().length
    ) {
      params.set(key, value.toString());
    } else if (typeof value === 'boolean' && value === true) {
      params.set(key, 'true');
    }
  });

  return params;
};
