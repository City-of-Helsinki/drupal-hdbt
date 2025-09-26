import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const primaryButtonStyle: CSSWithVars = {
  '--background-color': 'var(--theme-bg1, var(--color-bus))',
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
  '--focus-outline-color': 'var(--theme-focus, var(--color-coat-of-arms))',
  '--submit-input-focus-gutter-color': 'var(--theme-focus-gutter-color, var(--color-white))',
};

export const secondaryButtonStyle: CSSWithVars = {
  '--background-color': 'transparent',
  '--background-color-hover': 'var(--hdbt-color-palette-button--secondary)',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'var(--hdbt-color-palette-button--secondary)',
  '--background-color-disabled': 'transparent',
  '--border-color': 'var(--hdbt-color-palette-button--secondary)',
  '--border-color-hover': 'var(--hdbt-color-palette-button--secondary)',
  '--border-color-focus': 'var(--hdbt-color-palette-button--secondary)',
  '--border-color-hover-focus': 'var(--hdbt-color-palette-button--secondary)',
  '--border-color-disabled': 'var(--hdbt-color-palette-button--secondary)',
  '--color': 'var(--hdbt-color-palette-button--secondary)',
  '--color-hover': 'var(--hdbt-color-palette-button-contrast--secondary)',
  '--color-focus': 'var(--hdbt-color-palette-button--secondary)',
  '--color-hover-focus': 'var(--hdbt-color-palette-button-contrast--secondary)',
  '--focus-outline-color': 'var(--hdbt-color-palette-button--secondary)',
};

