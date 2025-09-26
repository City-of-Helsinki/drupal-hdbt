import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const primaryButtonTheme: CSSWithVars = {
  '--background-color': 'var(--color-black-90)',
  '--background-color-hover': 'var(--theme-bg2, var(--color-bus-dark))',
  '--background-color-focus': 'var(--theme-bg1, var(--color-bus))',
  '--background-color-hover-focus': 'var(--theme-bg2, var(--color-bus-dark))',
  '--background-color-disabled': 'var(--color-black-20)',
  '--border-color': 'var(--theme-bg1, var(--color-bus))',
  '--border-color-hover': 'var(--theme-bg1, var(--color-bus-dark))',
  '--border-color-focus': 'var(--theme-bg1, var(--color-bus))',
  '--border-color-hover-focus': 'var(--theme-bg1, var(--color-bus-dark))',
  '--border-color-disabled': 'var(--color-black-20)',
  '--color': 'var(--theme-fg1, var(--color-white))',
  '--color-hover': 'var(--theme-fg2, var(--color-white))',
  '--color-focus': 'var(--theme-fg1, var(--color-white))',
  '--color-hover-focus': 'var(--theme-fg2, var(--color-white))',
  '--color-disabled': 'var(--color-white)',
  '--outline-color-focus': 'var(--color-black-90)',
  '--submit-input-focus-gutter-color': 'var(--theme-focus-gutter-color, var(--color-white))',
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

