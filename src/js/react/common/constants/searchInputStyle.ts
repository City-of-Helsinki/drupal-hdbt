import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultSearchInputStyle: CSSWithVars = {
  '--focus-outline-color': 'var(--color-coat-of-arms)',
  '--color-focus-outline': 'var(--color-coat-of-arms)',
  '--menu-item-background-hover': 'var(--hdbt-color-black)',
  '--menu-item-color-hover': 'var(--color-white)',
};
