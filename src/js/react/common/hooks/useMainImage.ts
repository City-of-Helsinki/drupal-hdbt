const defaultResult = {
  src: '',
  keyedStyles: {},
};

export const useMainImage = (main_image_urls?: string[]) => {
  if (!main_image_urls?.length) {
    return defaultResult;
  }

  try {
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
      src: original?.url || keyedStyles?.['1248'] || '',
      keyedStyles,
    };
  } catch (error) {
    console.error('Error parsing main image URLs:', error);
    return defaultResult;
  }
};
