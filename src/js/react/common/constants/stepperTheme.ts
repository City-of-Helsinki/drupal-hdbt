import type { Properties } from 'csstype';

type CSSWithVars = Properties<string | number> & Record<string, string>;

export const defaultStepperTheme: CSSWithVars = {
  '--hds-not-selected-step-label-color': 'var(--color-black-90)',
  '--hds-step-content-color': 'var(--color-black-90)',
  '--hds-stepper-background-color': 'var(--color-white)',
  '--hds-stepper-color': 'var(--color-black-90)',
  '--hds-stepper-focus-border-color': 'var(--color-coat-of-arms)'
};
