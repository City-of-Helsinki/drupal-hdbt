import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const primaryButtonTheme: CSSWithVars = {
  '--background-color': 'var(--color-black-90)',
  '--background-color-hover': 'transparent',
  '--background-color-focus': 'var(--color-black-90)',
  '--background-color-hover-focus': 'transparent',
  '--background-color-disabled': 'var(--color-black-20)',
  '--border-color': 'var(--color-black-90)',
  '--border-color-hover': 'var(--color-black-90)',
  '--border-color-focus': 'var(--color-black-90)',
  '--border-color-hover-focus': 'var(--color-black-90)',
  '--border-color-disabled': 'var(--color-black-20)',
  '--color': 'var(--color-white)',
  '--color-hover': 'var(--color-black-90)',
  '--color-focus': 'var(--color-white)',
  '--color-hover-focus': 'var(--color-black-90)',
  '--color-disabled': 'var(--color-white)',
  '--outline-color-focus': 'var(--color-black-90)',
  '--submit-input-focus-gutter-color': 'transparent',
};

export const secondaryButtonTheme: CSSWithVars = {
  '--background-color': 'transparent',
  '--background-color-hover': 'var(--color-black-90)',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'var(--color-black-90)',
  '--background-color-disabled': 'transparent',
  '--border-color': 'var(--color-black-90)',
  '--border-color-hover': 'var(--color-black-90)',
  '--border-color-focus': 'var(--color-black-90)',
  '--border-color-hover-focus': 'var(--color-black-90)',
  '--border-color-disabled': 'var(--color-black-90)',
  '--color': 'var(--color-black-90)',
  '--color-hover': 'var(--color-white)',
  '--color-focus': 'var(--color-black-90)',
  '--color-hover-focus': 'var(--color-black-90)',
  '--outline-color-focus': 'var(--color-black-90)',
};

