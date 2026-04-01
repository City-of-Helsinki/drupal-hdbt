import type { ResponsiveImage } from '@/types/ResponsiveImage';

export const ResponsiveCardImage = ({ alt, original, styles }: ResponsiveImage) => {
  const breakpoints = ['1248', '992', '768', '576', '320'];

  const keyedStyles = Object.keys(styles).reduce(
    (acc, key) => {
      const { breakpoint, url } = styles[key];
      acc[breakpoint] = url;
      return acc;
    },
    {} as Record<string, string>,
  );

  return (
    <picture>
      {breakpoints.map((bp) => {
        let srcSet = keyedStyles?.[bp];

        if (!srcSet) {
          return null;
        }

        if (keyedStyles[`${bp}_2x`]) {
          srcSet += `, ${keyedStyles[`${bp}_2x`]} 2x`;
        }

        return <source key={bp} media={`(max-width: ${bp}px)`} srcSet={srcSet} />;
      })}
      <img src={original} alt={alt} />
    </picture>
  );
};
