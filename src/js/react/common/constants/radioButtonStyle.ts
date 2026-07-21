import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultRadioButtonStyle: CSSWithVars = {
  '--border-color-selected': 'var(--color-black-90)',
  '--border-color-selected-hover': 'var(--color-black-90)',
  '--border-color-selected-focus': 'var(--color-black-90)',
  '--color-focus-outline': 'var(--color-coat-of-arms)',
  '--focus-outline-color': 'var(--color-black-90)',
  '--icon-color-selected': 'var(--color-black-90)',
};
