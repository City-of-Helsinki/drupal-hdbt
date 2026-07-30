import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const primaryButtonTheme: CSSWithVars = {
  '--background-color': 'var(--color-black)',
  '--background-color-hover': 'var(--primary-button-black-hover-fill)',
  '--background-color-focus': 'var(--color-black)',
  '--background-color-hover-focus': 'var(--primary-button-black-hover-fill)',
  '--background-color-disabled': 'var(--color-black-20)',
  '--border-color': 'var(--color-black)',
  '--border-color-hover': 'transparent',
  '--border-color-focus': 'var(--color-black',
  '--border-color-hover-focus': 'transparent',
  '--border-color-disabled': 'var(--color-black-20)',
  '--color': 'var(--color-white)',
  '--color-hover': 'var(--color-black)',
  '--color-focus': 'var(--color-white)',
  '--color-hover-focus': 'var(--color-black)',
  '--color-disabled': 'var(--color-white)',
  '--outline-color-focus': 'var(--color-black)',
  '--submit-input-focus-gutter-color': 'transparent',
};

export const secondaryButtonTheme: CSSWithVars = {
  '--background-color': 'transparent',
  '--background-color-hover': 'var(--secondary-button-hover-fill)',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'var(--secondary-button-hover-fill)',
  '--background-color-disabled': 'transparent',
  '--border-color': 'var(--color-black)',
  '--border-color-hover': 'transparent',
  '--border-color-focus': 'var(--color-black)',
  '--border-color-hover-focus': 'transparent',
  '--border-color-disabled': 'var(--color-black)',
  '--color': 'var(--color-black)',
  '--color-hover': 'var(--color-white)',
  '--color-focus': 'var(--color-black)',
  '--color-hover-focus': 'var(--color-black)',
  '--outline-color-focus': 'var(--color-black)',
};

export const supplementaryButtonTheme: CSSWithVars = {
  '--background-color': 'transparent',
  '--background-color-hover': 'var(--color-black-20)',
  '--background-color-focus': 'transparent',
  '--background-color-hover-focus': 'var(--color-black)',
  '--background-color-disabled': 'transparent',
  '--border-color': 'transparent',
  '--border-color-hover': 'transparent',
  '--border-color-focus': 'transparent',
  '--border-color-hover-focus': 'transparent',
  '--border-color-disabled': 'transparent',
  '--color': 'var(--color-black)',
  '--color-hover': 'var(--color-black)',
  '--color-focus': 'var(--color-black)',
  '--color-hover-focus': 'var(--color-black)',
  '--computed-border-color': 'transparent',
  '--outline-color-focus': 'var(--color-black)',
  'text-decoration': 'underline',
  'text-underline-offset': '10%',
};
