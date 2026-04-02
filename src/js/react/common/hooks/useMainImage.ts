export const useMainImage = (main_image_urls?: string[]) => {
  if (!main_image_urls?.length) {
    return {
      src: '',
      keyedStyles: {},
    };
  }

  const { original, styles } = main_image_urls?.length ? JSON.parse(main_image_urls[0]) : {};

  const keyedStyles = Object.keys(styles || {}).reduce(
    (acc, key) => {
      const { breakpoint, url } = styles[key];
      acc[breakpoint] = url;
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    src: original?.url || styles?.['1248'] || '',
    keyedStyles,
  };
};
