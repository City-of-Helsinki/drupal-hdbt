import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultTextInputStyle: CSSWithVars = {
  '--color-focus-outline': 'var(--color-coat-of-arms)',
};
