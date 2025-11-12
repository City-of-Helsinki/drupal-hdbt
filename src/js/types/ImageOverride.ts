export type ImageOverride = {
  picture_url_override: {
    alt: string;
    photographer: string;
    title: string;
    url: string;
    variants: {
      [key: string]: string; // Keyed by breakpoint names, e.g., '320', '576', '320_2x', etc.
    };
  };
};
