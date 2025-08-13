import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultCheckboxStyle: CSSWithVars = {
  '--background-selected': 'var(--hdbt-color-black)',
  '--background-hover': 'var(--hdbt-color-black)',
  '--border-color-selected': 'var(--hdbt-color-black)',
  '--border-color-selected-hover': 'var(--hdbt-color-black)',
  '--border-color-selected-focus': 'var(--hdbt-color-black)',
  '--color-focus-outline': 'var(--color-coat-of-arms)',
  '--focus-outline-color': 'var(--hdbt-color-black)',
  '--icon-color-selected': 'var(--color-white)',
};
