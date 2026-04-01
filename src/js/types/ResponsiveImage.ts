export type ResponsiveImage = {
  alt?: string;
  original: string;
  styles: {
    [key: string]: {
      breakpoint: '320' | '320_2x' | '576' | '576_2x' | '768' | '768_2x' | '992' | '992_2x' | '1248' | '1248_2x';
      url: string;
    };
  };
};
