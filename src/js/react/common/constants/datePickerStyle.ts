import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultDatePickerStyle: CSSWithVars = {
  '--color-focus-outline': 'var(--color-coat-of-arms)',
  '--selected-date-background': 'var(--hdbt-color-black)',
};
